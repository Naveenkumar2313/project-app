
import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Move, RotateCw, Copy, Check } from 'lucide-react';

// --- 1. Syntax Highlighting Code Viewer ---
export const CodeViewer: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const highlightCode = (input: string) => {
    // Simple regex-based highlighting for demo purposes (Python/C++)
    let html = input
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\b(import|from|def|class|return|if|else|elif|for|while|in|try|except|print|void|int|float|string|include|using|namespace)\b/g, '<span class="text-purple-400 font-bold">$1</span>')
      .replace(/\b(True|False|None|null|this)\b/g, '<span class="text-orange-400">$1</span>')
      .replace(/(['"])(.*?)\1/g, '<span class="text-green-400">$1$2$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-blue-400">$1</span>')
      .replace(/(#|\/\/)(.*)/g, '<span class="text-slate-500 italic">$1$2</span>');
    return { __html: html };
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-slate-700 flex flex-col h-full">
      <div className="bg-[#252526] px-4 py-2 flex justify-between items-center border-b border-black">
        <span className="text-xs text-slate-400 font-mono uppercase">{language}</span>
        <button onClick={handleCopy} className="text-xs text-slate-400 hover:text-white flex items-center">
          {copied ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-4 overflow-auto flex-1 font-mono text-sm leading-relaxed text-slate-300">
        <pre dangerouslySetInnerHTML={highlightCode(code)} />
      </div>
    </div>
  );
};

// --- 2. Interactive Circuit Viewer (SVG) ---
export const CircuitViewer: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="bg-slate-50 h-full rounded-lg border border-slate-200 overflow-hidden relative select-none">
       {/* Controls */}
       <div className="absolute top-4 right-4 bg-white shadow-md rounded-lg p-1 flex flex-col z-10 border border-slate-200">
         <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-2 hover:bg-slate-100"><ZoomIn className="w-4 h-4 text-slate-600" /></button>
         <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2 hover:bg-slate-100"><ZoomOut className="w-4 h-4 text-slate-600" /></button>
         <button onClick={() => { setScale(1); setPosition({x:0, y:0}); }} className="p-2 hover:bg-slate-100"><RotateCw className="w-4 h-4 text-slate-600" /></button>
       </div>

       <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-500 border border-slate-200 pointer-events-none">
          Interactive Schematic
       </div>

       <div 
         className="w-full h-full flex items-center justify-center cursor-move"
         onMouseDown={handleMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}
       >
         <div style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transition: isDragging ? 'none' : 'transform 0.2s' }}>
            {/* Mock Circuit SVG */}
            <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
              {/* Board */}
              <rect x="50" y="50" width="500" height="300" rx="10" fill="#2d5a27" stroke="#1a3316" strokeWidth="5" />
              {/* ESP32 */}
              <rect x="100" y="100" width="120" height="200" fill="#111" />
              <text x="130" y="200" fill="#fff" fontFamily="monospace" fontSize="14">ESP32</text>
              {/* Relay */}
              <rect x="400" y="100" width="80" height="100" fill="#3366cc" />
              <text x="420" y="150" fill="#fff" fontFamily="monospace" fontSize="12">Relay</text>
              {/* Sensor */}
              <circle cx="300" cy="300" r="30" fill="#cc3333" />
              <text x="280" y="305" fill="#fff" fontFamily="monospace" fontSize="10">Sensor</text>
              {/* Wires */}
              <path d="M 220 150 L 300 150 L 300 150 L 400 150" stroke="#f0c420" strokeWidth="3" fill="none" />
              <path d="M 160 300 L 160 300 L 270 300" stroke="#f0c420" strokeWidth="3" fill="none" />
              <circle cx="220" cy="150" r="4" fill="#000" />
              <circle cx="400" cy="150" r="4" fill="#000" />
            </svg>
         </div>
       </div>
    </div>
  );
};

// --- 3. 3D Model Viewer (CSS Implementation) ---
export const ModelViewer3D: React.FC = () => {
  const [rotation, setRotation] = useState({ x: -20, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastPos.current.x;
    const deltaY = e.clientY - lastPos.current.y;
    setRotation(prev => ({ x: prev.x - deltaY * 0.5, y: prev.y + deltaX * 0.5 }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div className="bg-slate-900 h-full rounded-lg relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div className="absolute top-4 left-4 text-white/50 text-xs font-mono z-10 pointer-events-none">
        Drag to Rotate | 3D Preview
      </div>

      <div style={{ perspective: '1000px' }}>
        <div style={{ 
            width: '200px', height: '200px', position: 'relative', 
            transformStyle: 'preserve-3d', 
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}>
           {/* Mocking a 3D Cube/Part using CSS faces */}
           <div className="absolute w-full h-full border-2 border-orange-500/50 bg-orange-500/10 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl" style={{ transform: 'translateZ(100px)' }}>FRONT</div>
           <div className="absolute w-full h-full border-2 border-orange-500/50 bg-orange-500/10 backdrop-blur-sm" style={{ transform: 'rotateY(180deg) translateZ(100px)' }}></div>
           <div className="absolute w-full h-full border-2 border-orange-500/50 bg-orange-500/10 backdrop-blur-sm" style={{ transform: 'rotateY(90deg) translateZ(100px)' }}></div>
           <div className="absolute w-full h-full border-2 border-orange-500/50 bg-orange-500/10 backdrop-blur-sm" style={{ transform: 'rotateY(-90deg) translateZ(100px)' }}></div>
           <div className="absolute w-full h-full border-2 border-orange-500/50 bg-orange-500/10 backdrop-blur-sm" style={{ transform: 'rotateX(90deg) translateZ(100px)' }}></div>
           <div className="absolute w-full h-full border-2 border-orange-500/50 bg-orange-500/10 backdrop-blur-sm" style={{ transform: 'rotateX(-90deg) translateZ(100px)' }}></div>
           
           {/* Internal Axle */}
           <div className="absolute w-10 h-64 bg-slate-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotateX(90deg)' }}></div>
        </div>
      </div>
    </div>
  );
};
