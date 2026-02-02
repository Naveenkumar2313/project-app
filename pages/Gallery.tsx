import React, { useState } from 'react';
import { Department, ProjectTier, Project, Difficulty } from '../types';
import { PROJECTS } from '../services/mockData';
import { Filter, Eye, ChevronRight, Zap, Code, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';

const Gallery = () => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [quickViewProject, setQuickViewProject] = useState<Project | null>(null);

  const filteredProjects = PROJECTS.filter((p) => {
    const matchDept = selectedDept === 'All' || p.department === selectedDept;
    const matchTier = selectedTier === 'All' || p.tier === selectedTier;
    return matchDept && matchTier;
  });

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY: return 'bg-green-100 text-green-800';
      case Difficulty.MODERATE: return 'bg-yellow-100 text-yellow-800';
      case Difficulty.HARD: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Project Gallery</h1>
          <p className="text-slate-500 mt-1">Explore industry-standard engineering projects.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           {/* Dept Filter */}
           <div className="relative inline-block text-left">
            <select 
              className="appearance-none bg-white border border-slate-300 text-slate-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-orange-500"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All">All Departments</option>
              {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Tier Filter */}
          <div className="relative inline-block text-left">
            <select 
              className="appearance-none bg-white border border-slate-300 text-slate-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-orange-500"
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
            >
              <option value="All">All Tiers</option>
              {Object.values(ProjectTier).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
            <div className="relative h-48 bg-slate-200 overflow-hidden">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 flex space-x-2">
                <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-medium">
                  {project.department}
                </span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>
              </div>
              <button 
                onClick={() => setQuickViewProject(project)}
                className="absolute bottom-3 right-3 bg-white/90 backdrop-blur hover:bg-white text-slate-800 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                title="Quick View"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                   <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">{project.title}</h3>
                </div>
                <p className="text-sm text-slate-500 mt-2 line-clamp-3">{project.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                   {project.components.slice(0, 3).map((c, i) => (
                     <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">{c}</span>
                   ))}
                   {project.components.length > 3 && (
                     <span className="text-xs text-slate-400 px-1 py-1">+{project.components.length - 3} more</span>
                   )}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Starts at</span>
                  <div className="text-lg font-bold text-orange-600">₹{project.priceDigital}</div>
                </div>
                <Link 
                  to={`/project/${project.id}`}
                  className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Details <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      {quickViewProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setQuickViewProject(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative" onClick={e => e.stopPropagation()}>
             <button onClick={() => setQuickViewProject(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             
             <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/3 bg-slate-100">
                  <img src={quickViewProject.imageUrl} alt={quickViewProject.title} className="w-full h-48 md:h-full object-cover" />
                </div>
                <div className="w-full md:w-2/3 p-6 md:p-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2 py-1 rounded uppercase tracking-wider">{quickViewProject.tier} Project</span>
                    <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded">{quickViewProject.department}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">{quickViewProject.title}</h2>
                  <p className="text-slate-600 text-sm mb-6">{quickViewProject.description}</p>
                  
                  <h4 className="font-semibold text-slate-900 text-sm mb-3">Key Components:</h4>
                  <ul className="grid grid-cols-2 gap-2 mb-8">
                    {quickViewProject.components.map((c, idx) => (
                      <li key={idx} className="flex items-center text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                        {c}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between">
                     <div className="flex space-x-6">
                        <div className="text-center">
                          <Zap className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                          <span className="text-xs text-slate-500">Digital</span>
                        </div>
                        <div className="text-center">
                          <HardDrive className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                          <span className="text-xs text-slate-500">Kit</span>
                        </div>
                        <div className="text-center">
                          <Code className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                          <span className="text-xs text-slate-500">Build</span>
                        </div>
                     </div>
                     <Link to={`/project/${quickViewProject.id}`} className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg shadow-sm transition-all">
                       Configure
                     </Link>
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;