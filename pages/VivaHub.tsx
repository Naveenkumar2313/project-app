
import React, { useState, useRef, useEffect } from 'react';
import { generateProjectSynopsis, generateVivaQuestions, generateSlideDeck, generateInterviewPrep, generateCitations } from '../services/geminiService';
import { Bot, FileText, Loader2, BookOpen, AlertCircle, Mic, Square, Play, Download, Presentation, Users, Quote, Clock, X, ChevronRight, ChevronLeft, Printer } from 'lucide-react';
import { PROJECTS } from '../services/mockData';

const VivaHub = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0].id);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'synopsis' | 'questions' | 'slides' | 'interview' | 'citations'>('synopsis');

  // Practice Mode State
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceTime, setPracticeTime] = useState(0);
  const [practiceInterval, setPracticeInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [currentPracticeQuestion, setCurrentPracticeQuestion] = useState(0);
  const [practiceQuestions, setPracticeQuestions] = useState<string[]>([]);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId);

  // --- Content Generators ---
  const handleGenerate = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    setGeneratedContent('');
    
    let result = '';
    switch(activeTab) {
        case 'synopsis': result = await generateProjectSynopsis(selectedProject.title, selectedProject.department); break;
        case 'questions': result = await generateVivaQuestions(selectedProject.title); break;
        case 'slides': result = await generateSlideDeck(selectedProject.title); break;
        case 'interview': result = await generateInterviewPrep(selectedProject.title); break;
        case 'citations': result = await generateCitations(selectedProject.title); break;
    }
    
    setGeneratedContent(result);
    setLoading(false);
  };

  // --- Voice Recorder Functions ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // --- Practice Mode Functions ---
  const startPractice = async () => {
    if (!generatedContent && activeTab === 'questions') {
        // Auto-generate if empty
        await handleGenerate();
    }
    
    // Parse questions from markdown content (simple heuristic)
    const lines = generatedContent.split('\n').filter(line => line.includes('?') || line.match(/^\d+\./));
    const questions = lines.length > 0 ? lines : ["Tell me about your project.", "What are the limitations?", "Explain the system architecture."];
    
    setPracticeQuestions(questions);
    setCurrentPracticeQuestion(0);
    setPracticeTime(0);
    setIsPracticeMode(true);
    
    const interval = setInterval(() => {
        setPracticeTime(prev => prev + 1);
    }, 1000);
    setPracticeInterval(interval);
  };

  const endPractice = () => {
    setIsPracticeMode(false);
    if (practiceInterval) clearInterval(practiceInterval);
    setPracticeInterval(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrint = () => {
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>${selectedProject?.title} - ${activeTab.toUpperCase()}</title>
                <style>
                  body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
                  h1 { color: #ea580c; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
                  pre { white-space: pre-wrap; background: #f9f9f9; padding: 20px; border-radius: 8px; }
                </style>
              </head>
              <body>
                <h1>${selectedProject?.title}</h1>
                <h2>${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Material</h2>
                <div>${generatedContent.replace(/\n/g, '<br/>')}</div>
                <div style="margin-top: 50px; font-size: 12px; color: #888; text-align: center;">Generated by Pygenicarc Tech Viva Hub</div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Viva-Voce Prep Hub</h1>
        <p className="text-slate-500">AI-Powered tools to help you ace your project presentation.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
        
        {/* Sidebar Controls */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col flex-shrink-0">
           <div className="mb-6">
             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Select Project</label>
             <select 
                className="block w-full text-sm border-slate-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
             </select>
           </div>

           <nav className="space-y-1 flex-1">
              {[
                { id: 'synopsis', label: 'Synopsis Generator', icon: FileText },
                { id: 'questions', label: 'Viva Questions', icon: BookOpen },
                { id: 'slides', label: 'Slide Deck Builder', icon: Presentation },
                { id: 'interview', label: 'Interview Prep', icon: Users },
                { id: 'citations', label: 'Reference / Citations', icon: Quote },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setGeneratedContent(''); }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === item.id ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className={`w-4 h-4 mr-3 ${activeTab === item.id ? 'text-orange-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              ))}
           </nav>

           <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-2">Voice Practice</div>
                 {audioUrl ? (
                   <div className="space-y-2">
                     <audio src={audioUrl} controls className="w-full h-8" />
                     <button onClick={() => setAudioUrl(null)} className="text-xs text-red-500 hover:underline">Delete Recording</button>
                   </div>
                 ) : (
                   <button 
                     onClick={isRecording ? stopRecording : startRecording}
                     className={`w-full py-2 rounded-full flex items-center justify-center space-x-2 transition-colors ${
                       isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                     }`}
                   >
                     {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                     <span className="text-xs font-bold">{isRecording ? 'Stop Recording' : 'Record Answer'}</span>
                   </button>
                 )}
              </div>

              <button 
                onClick={startPractice}
                className="w-full py-3 bg-slate-900 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-slate-800 shadow-md"
              >
                <Play className="w-4 h-4" />
                <span className="font-bold text-sm">Start Mock Viva</span>
              </button>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 flex flex-col bg-white">
           <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                 {activeTab === 'synopsis' && <FileText className="w-6 h-6 mr-3 text-blue-500" />}
                 {activeTab === 'questions' && <BookOpen className="w-6 h-6 mr-3 text-green-500" />}
                 {activeTab === 'slides' && <Presentation className="w-6 h-6 mr-3 text-purple-500" />}
                 {activeTab === 'interview' && <Users className="w-6 h-6 mr-3 text-pink-500" />}
                 {activeTab === 'citations' && <Quote className="w-6 h-6 mr-3 text-yellow-500" />}
                 
                 {activeTab === 'synopsis' && 'Project Synopsis'}
                 {activeTab === 'questions' && 'Viva Questions'}
                 {activeTab === 'slides' && 'Presentation Slides'}
                 {activeTab === 'interview' && 'HR & Tech Interview'}
                 {activeTab === 'citations' && 'References'}
              </h2>
              
              {generatedContent && (
                <div className="flex space-x-2">
                  <button onClick={() => navigator.clipboard.writeText(generatedContent)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100" title="Copy Text">
                    <FileText className="w-5 h-5" />
                  </button>
                  <button onClick={handlePrint} className="flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-200">
                    <Printer className="w-4 h-4 mr-2" /> Print / PDF
                  </button>
                </div>
              )}
           </div>

           <div className="flex-1 overflow-auto">
             {generatedContent ? (
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {generatedContent}
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12">
                   {loading ? (
                     <div className="flex flex-col items-center animate-pulse">
                       <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                       <p className="text-slate-600 font-medium text-lg">AI Professor is drafting your {activeTab}...</p>
                       <p className="text-slate-400 text-sm mt-2">This may take a few seconds.</p>
                     </div>
                   ) : (
                     <div className="max-w-md">
                       <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                         <Bot className="w-10 h-10 text-slate-400" />
                       </div>
                       <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Generate</h3>
                       <p className="text-slate-500 mb-8">
                         Click the button below to generate professional {activeTab.replace('-', ' ')} tailored to your project.
                       </p>
                       
                       {!process.env.API_KEY && (
                         <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-center text-left border border-red-100">
                           <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                           <div>
                             <span className="font-bold block">API Key Missing</span>
                             Content generation requires a valid Gemini API key.
                           </div>
                         </div>
                       )}

                       <button 
                          onClick={handleGenerate}
                          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center mx-auto"
                       >
                         <Bot className="w-5 h-5 mr-2" />
                         Generate Content
                       </button>
                     </div>
                   )}
                </div>
             )}
           </div>
        </div>
      </div>

      {/* --- Full Screen Practice Mode --- */}
      {isPracticeMode && (
        <div className="fixed inset-0 z-[100] bg-slate-900 text-white flex flex-col items-center justify-center p-8">
           <button onClick={endPractice} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full">
             <X className="w-6 h-6 text-white" />
           </button>

           <div className="max-w-4xl w-full text-center space-y-12">
             <div className="flex items-center justify-center space-x-3 text-orange-400 bg-orange-400/10 py-2 px-6 rounded-full mx-auto w-fit">
               <Clock className="w-5 h-5 animate-pulse" />
               <span className="font-mono text-xl font-bold">{formatTime(practiceTime)}</span>
             </div>

             <div className="space-y-6">
                <span className="text-slate-400 text-sm uppercase tracking-widest">Question {currentPracticeQuestion + 1} of {practiceQuestions.length}</span>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  {practiceQuestions[currentPracticeQuestion]}
                </h2>
             </div>

             <div className="flex justify-center items-center space-x-6 pt-8">
                <button 
                  disabled={currentPracticeQuestion === 0}
                  onClick={() => setCurrentPracticeQuestion(prev => Math.max(0, prev - 1))}
                  className="p-4 rounded-full border border-slate-700 hover:bg-slate-800 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <div className="w-24 h-24 rounded-full bg-orange-600 flex items-center justify-center shadow-2xl shadow-orange-900/50 cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsRecording(!isRecording)}>
                   {isRecording ? <Square className="w-8 h-8 fill-current animate-pulse" /> : <Mic className="w-8 h-8" />}
                </div>

                <button 
                  disabled={currentPracticeQuestion === practiceQuestions.length - 1}
                  onClick={() => setCurrentPracticeQuestion(prev => Math.min(practiceQuestions.length - 1, prev + 1))}
                  className="p-4 rounded-full border border-slate-700 hover:bg-slate-800 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
             </div>
             
             <p className="text-slate-500 text-sm mt-8">
               {isRecording ? 'Recording your answer...' : 'Tap microphone to record answer'}
             </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default VivaHub;
