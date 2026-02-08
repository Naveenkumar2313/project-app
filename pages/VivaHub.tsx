import React, { useState } from 'react';
import { generateProjectSynopsis, generateVivaQuestions } from '../services/geminiService';
import { Bot, FileText, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { PROJECTS } from '../services/mockData';

const VivaHub = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0].id);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'synopsis' | 'questions'>('synopsis');

  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId);

  const handleGenerate = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    setGeneratedContent('');
    
    let result = '';
    if (activeTab === 'synopsis') {
      result = await generateProjectSynopsis(selectedProject.title, selectedProject.department);
    } else {
      result = await generateVivaQuestions(selectedProject.title);
    }
    
    setGeneratedContent(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Viva-Voce Prep Hub</h1>
        <p className="text-slate-500">AI-Powered tools to help you ace your project presentation.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
             <div className="bg-orange-100 p-2 rounded-lg">
               <Bot className="w-6 h-6 text-orange-600" />
             </div>
             <div>
               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Select Your Project</label>
               <select 
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
               </select>
             </div>
          </div>
          
          <div className="flex space-x-2 bg-white p-1 rounded-lg border border-slate-200">
             <button 
               onClick={() => { setActiveTab('synopsis'); setGeneratedContent(''); }}
               className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'synopsis' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               Generate Synopsis
             </button>
             <button 
                onClick={() => { setActiveTab('questions'); setGeneratedContent(''); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'questions' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               Viva Questions
             </button>
          </div>
        </div>

        <div className="p-8 min-h-[400px] flex flex-col">
          {generatedContent ? (
            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                {activeTab === 'synopsis' ? <FileText className="w-5 h-5 mr-2" /> : <BookOpen className="w-5 h-5 mr-2" />}
                {activeTab === 'synopsis' ? 'Generated Project Synopsis' : 'Predicted Viva Questions'}
              </h3>
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 whitespace-pre-wrap text-slate-700 leading-relaxed font-serif">
                {generatedContent}
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                   onClick={() => setGeneratedContent('')}
                   className="text-sm text-slate-500 hover:text-slate-700 underline"
                >
                  Clear & Start Over
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
               {loading ? (
                 <div className="flex flex-col items-center animate-pulse">
                   <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                   <p className="text-slate-600 font-medium">Consulting the AI Professor...</p>
                 </div>
               ) : (
                 <div className="max-w-md">
                   <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Bot className="w-8 h-8 text-blue-600" />
                   </div>
                   <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to assist</h3>
                   <p className="text-slate-500 mb-6">
                     {activeTab === 'synopsis' 
                        ? 'I can write a structured 3-section synopsis (Intro, Proposed System, Conclusion) for your report.' 
                        : 'I can predict technical questions external examiners might ask about this specific project.'}
                   </p>
                   {!process.env.API_KEY && (
                     <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center text-left">
                       <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                       Gemini API Key missing. Content generation will fail.
                     </div>
                   )}
                   <button 
                      onClick={handleGenerate}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                   >
                     Generate {activeTab === 'synopsis' ? 'Synopsis' : 'Questions'}
                   </button>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VivaHub;
