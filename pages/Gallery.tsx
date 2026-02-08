
import React, { useState, useMemo } from 'react';
import { Department, ProjectTier, Project, Difficulty } from '../types';
import { PROJECTS } from '../services/mockData';
import { Filter, Eye, ChevronRight, Zap, Code, HardDrive, Star, ArrowUpRight, Search, X, Clock, Trophy, Instagram, Users, ExternalLink } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const getDifficultyColor = (diff: Difficulty) => {
  switch (diff) {
    case Difficulty.EASY: return 'bg-green-100 text-green-800';
    case Difficulty.MODERATE: return 'bg-yellow-100 text-yellow-800';
    case Difficulty.HARD: return 'bg-red-100 text-red-800';
  }
};

interface ProjectCardProps {
  project: Project;
  showBadge?: boolean;
  onQuickView: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, showBadge = false, onQuickView }) => {
  // Generate a mock "students bought" count based on review count
  const studentsBought = useMemo(() => Math.floor(project.reviewCount * (2 + Math.random())), [project.reviewCount]);

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden h-full">
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        <img src={project.imageUrl} alt={project.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {project.isPreOrder && <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center"><Clock className="w-3 h-3 mr-1" /> Pre-Order</span>}
          {showBadge && !project.isPreOrder && <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center"><Star className="w-3 h-3 mr-1 fill-current" /> Trending</span>}
          <div className="flex space-x-1">
            <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-medium">{project.department}</span>
            <span className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(project.difficulty)}`}>{project.difficulty}</span>
          </div>
        </div>

        {!project.inStock && !project.isPreOrder && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform -rotate-6">Out of Stock</span>
            </div>
        )}

        <button 
          onClick={() => onQuickView(project)}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur hover:bg-white text-slate-800 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
          title="Quick View"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">{project.title}</h3>
          </div>
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-bold text-slate-800">{project.rating || 'New'}</span>
                <span className="text-xs text-slate-400">({project.reviewCount})</span>
             </div>
             {/* Social Proof Counter */}
             <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full" title={`${studentsBought} students have purchased this project`}>
                <Users className="w-3 h-3 mr-1 text-blue-500" /> {studentsBought} bought
             </div>
          </div>
          <p className="text-sm text-slate-500 line-clamp-2">{project.description}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold">Base Price</span>
            <div className="text-lg font-bold text-orange-600">₹{project.priceDigital}</div>
          </div>
          <Link 
            to={`/project/${project.id}`}
            className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {project.isPreOrder ? 'Pre-Order' : 'Details'} <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const CompetitionBanner = () => (
  <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-2xl p-8 mb-12 relative overflow-hidden text-white shadow-xl">
    <div className="absolute top-0 right-0 p-8 opacity-10">
      <Trophy className="w-64 h-64 text-yellow-300 transform rotate-12" />
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
    
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="space-y-4">
        <div className="inline-flex items-center bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-400/30">
          <Zap className="w-3 h-3 mr-2 animate-pulse" /> Monthly Innovation Challenge
        </div>
        <h2 className="text-3xl font-bold">Build the Best "Green Energy" Project</h2>
        <p className="text-slate-300 max-w-xl">
          Compete with students across India. Submit your project video by <strong>November 30th</strong>. 
          Winners get <span className="text-white font-bold">₹10,000 Cash Prize</span> + Internship opportunities.
        </p>
        <div className="flex gap-4 pt-2">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-6 py-2.5 rounded-lg font-bold transition-colors">
            Register Now
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg font-medium transition-colors border border-white/20">
            View Leaderboard
          </button>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center max-w-xs">
           <div className="text-4xl font-black text-yellow-400 mb-1">₹10k</div>
           <div className="text-sm font-medium text-slate-300 uppercase tracking-wide">Grand Prize</div>
           <div className="w-full h-px bg-white/20 my-3"></div>
           <div className="text-xs text-slate-400">128 Students Registered</div>
           <div className="flex -space-x-2 justify-center mt-2">
              {[1,2,3,4].map(i => <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700`}></div>)}
              <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-800 text-xs flex items-center justify-center font-bold text-white">+124</div>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const InstagramFeed = () => (
  <section className="mb-12">
     <div className="flex items-center justify-between mb-6">
       <h2 className="text-xl font-bold text-slate-900 flex items-center">
         <Instagram className="w-5 h-5 mr-2 text-pink-500" /> Featured Student Projects
       </h2>
       <a href="#" className="text-sm text-slate-500 hover:text-pink-600 flex items-center font-medium">
         Follow @pygenicarc <ExternalLink className="w-3 h-3 ml-1" />
       </a>
     </div>
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
       {[
         'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=400&q=80',
         'https://images.unsplash.com/photo-1563770095-39d468f95742?auto=format&fit=crop&w=400&q=80',
         'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
         'https://images.unsplash.com/photo-1517420704952-d9f39714c720?auto=format&fit=crop&w=400&q=80'
       ].map((img, i) => (
         <div key={i} className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer">
           <img src={img} alt="Student Project" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <span className="text-white text-xs font-bold mb-1">@student_{100+i}</span>
              <p className="text-white/80 text-[10px] line-clamp-2">Built this amazing project using the Pygenicarc kit! #engineering #diy</p>
           </div>
           <div className="absolute top-3 right-3 bg-black/20 backdrop-blur p-1.5 rounded-full">
             <Instagram className="w-4 h-4 text-white" />
           </div>
         </div>
       ))}
     </div>
  </section>
);

const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Filter States
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(15000); // Increased limit for kits
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('popularity');

  // Quick View State
  const [quickViewProject, setQuickViewProject] = useState<Project | null>(null);

  // Constants
  const maxPriceLimit = 15000;

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((p) => {
      // Search Text Filter
      const searchContent = `${p.title} ${p.description} ${p.components.join(' ')}`.toLowerCase();
      const matchesSearch = !searchQuery || searchContent.includes(searchQuery.toLowerCase());

      // Dropdown/Checkbox Filters
      const matchesDept = selectedDept === 'All' || p.department === selectedDept;
      const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
      
      // Advanced Filters
      const matchesPrice = p.priceDigital <= priceRange; // Filtering based on base price (Digital)
      const matchesRating = p.rating >= minRating;
      const matchesStock = !inStockOnly || p.inStock;

      return matchesSearch && matchesDept && matchesDiff && matchesPrice && matchesRating && matchesStock;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc': return a.priceDigital - b.priceDigital;
        case 'priceDesc': return b.priceDigital - a.priceDigital;
        case 'newest': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'popularity': default: return b.popularity - a.popularity;
      }
    });
  }, [searchQuery, selectedDept, selectedDifficulty, priceRange, minRating, inStockOnly, sortBy]);

  // Discovery Collections (Only show if no search/filters active)
  const isDefaultView = !searchQuery && selectedDept === 'All' && selectedDifficulty === 'All' && priceRange === maxPriceLimit && minRating === 0 && !inStockOnly;
  
  const trendingProjects = useMemo(() => [...PROJECTS].sort((a, b) => b.popularity - a.popularity).slice(0, 3), []);
  const recommendedProjects = useMemo(() => PROJECTS.filter(p => p.department === Department.CSE || p.department === Department.ECE).slice(0, 3), []);

  const clearFilters = () => {
    setSelectedDept('All');
    setSelectedDifficulty('All');
    setPriceRange(maxPriceLimit);
    setMinRating(0);
    setInStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-slate-900 flex items-center"><Filter className="w-4 h-4 mr-2" /> Filters</h3>
             {!isDefaultView && (
               <button onClick={clearFilters} className="text-xs text-orange-600 hover:underline">Clear All</button>
             )}
           </div>

           {/* Price Range */}
           <div className="mb-6">
             <label className="text-sm font-semibold text-slate-700 mb-2 block">Max Price: ₹{priceRange}</label>
             <input 
               type="range" 
               min="500" 
               max={maxPriceLimit} 
               step="500" 
               value={priceRange}
               onChange={(e) => setPriceRange(parseInt(e.target.value))}
               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
             />
             <div className="flex justify-between text-xs text-slate-500 mt-1">
               <span>₹500</span>
               <span>₹15k+</span>
             </div>
           </div>

           {/* Department */}
           <div className="mb-6">
             <label className="text-sm font-semibold text-slate-700 mb-2 block">Department</label>
             <select 
               className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-orange-500 focus:border-orange-500"
               value={selectedDept}
               onChange={(e) => setSelectedDept(e.target.value)}
             >
               <option value="All">All Departments</option>
               {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
             </select>
           </div>

           {/* Difficulty */}
           <div className="mb-6">
             <label className="text-sm font-semibold text-slate-700 mb-2 block">Difficulty</label>
             <div className="space-y-2">
               {['All', ...Object.values(Difficulty)].map(d => (
                 <label key={d} className="flex items-center text-sm text-slate-600 cursor-pointer">
                   <input 
                      type="radio" 
                      name="difficulty" 
                      checked={selectedDifficulty === d}
                      onChange={() => setSelectedDifficulty(d)}
                      className="mr-2 text-orange-600 focus:ring-orange-500"
                   />
                   {d}
                 </label>
               ))}
             </div>
           </div>

           {/* Rating */}
           <div className="mb-6">
             <label className="text-sm font-semibold text-slate-700 mb-2 block">Minimum Rating</label>
             <div className="space-y-1">
               {[4, 3, 2].map(r => (
                 <label key={r} className="flex items-center text-sm text-slate-600 cursor-pointer">
                   <input 
                      type="radio" 
                      name="rating" 
                      checked={minRating === r}
                      onChange={() => setMinRating(r)}
                      className="mr-2 text-orange-600 focus:ring-orange-500"
                   />
                   <div className="flex text-yellow-400">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} className={`w-3 h-3 ${i < r ? 'fill-current' : 'text-slate-300'}`} />
                     ))}
                   </div>
                   <span className="ml-1 text-xs">& Up</span>
                 </label>
               ))}
               <label className="flex items-center text-sm text-slate-600 cursor-pointer">
                   <input 
                      type="radio" 
                      name="rating" 
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                      className="mr-2 text-orange-600 focus:ring-orange-500"
                   />
                   Any Rating
               </label>
             </div>
           </div>

           {/* Availability */}
           <div>
             <label className="flex items-center text-sm font-semibold text-slate-700 cursor-pointer">
               <input 
                  type="checkbox" 
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 mr-2"
               />
               In Stock Only
             </label>
           </div>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Monthly Competition Banner (Top of Gallery) */}
        {isDefaultView && <CompetitionBanner />}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            {searchQuery ? (
              <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                 Search Results for "<span className="text-orange-600">{searchQuery}</span>"
                 {filteredProjects.length === 0 && <span className="text-sm font-normal text-slate-500 ml-2">(0 found)</span>}
              </h1>
            ) : (
              <>
                 <h1 className="text-2xl font-bold text-slate-900">Project Gallery</h1>
                 <p className="text-sm text-slate-500">Showing {filteredProjects.length} engineering projects</p>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
             <span className="text-sm text-slate-500">Sort by:</span>
             <select 
               value={sortBy} 
               onChange={(e) => setSortBy(e.target.value)}
               className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500"
             >
               <option value="popularity">Most Popular</option>
               <option value="priceAsc">Price: Low to High</option>
               <option value="priceDesc">Price: High to Low</option>
               <option value="newest">Newest Arrivals</option>
             </select>
          </div>
        </div>

        {/* Discovery Sections (Only visible if default view) */}
        {isDefaultView && (
          <div className="space-y-10 mb-10">
             {/* Trending */}
             <section>
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-slate-900 flex items-center">
                   <Zap className="w-5 h-5 text-yellow-500 mr-2 fill-current" /> Trending Projects
                 </h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {trendingProjects.map(p => <ProjectCard key={p.id} project={p} showBadge={true} onQuickView={setQuickViewProject} />)}
               </div>
             </section>

             {/* Instagram Feed Integration */}
             <InstagramFeed />

             {/* Recommended */}
             <section>
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-slate-900 flex items-center">
                   <Star className="w-5 h-5 text-orange-500 mr-2" /> Recommended for You
                 </h2>
                 <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Based on ECE/CSE Interest</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {recommendedProjects.map(p => <ProjectCard key={p.id} project={p} onQuickView={setQuickViewProject} />)}
               </div>
             </section>

             <div className="border-t border-slate-200 my-8"></div>
             <h2 className="text-xl font-bold text-slate-900 mb-6">Browse All Projects</h2>
          </div>
        )}

        {/* Main Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onQuickView={setQuickViewProject} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="w-8 h-8 text-slate-300" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">No projects found</h3>
             <p className="text-slate-500 max-w-sm mx-auto mt-2">
               We couldn't find any projects matching your search or filters. Try adjusting your criteria.
             </p>
             <button onClick={clearFilters} className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
               Clear All Filters
             </button>
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      {quickViewProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setQuickViewProject(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative animate-fadeIn" onClick={e => e.stopPropagation()}>
             <button onClick={() => setQuickViewProject(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full">
               <X className="w-5 h-5" />
             </button>
             
             <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-5/12 bg-slate-100 relative">
                  <img src={quickViewProject.imageUrl} alt={quickViewProject.title} loading="lazy" className="w-full h-48 md:h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                     <div className="flex items-center text-white">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-bold">{quickViewProject.rating}</span>
                        <span className="text-xs opacity-80 ml-1">({quickViewProject.reviewCount} reviews)</span>
                     </div>
                  </div>
                </div>
                <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded uppercase tracking-wider">{quickViewProject.tier}</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">{quickViewProject.department}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{quickViewProject.title}</h2>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{quickViewProject.description}</p>
                    
                    <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wide mb-3">Key Components</h4>
                    <ul className="grid grid-cols-2 gap-2 mb-6">
                      {quickViewProject.components.map((c, idx) => (
                        <li key={idx} className="flex items-center text-xs text-slate-600">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 flex-shrink-0"></div>
                          <span className="truncate">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                     <div>
                       <span className="text-xs text-slate-400 block">Starting from</span>
                       <span className="text-xl font-bold text-slate-900">₹{quickViewProject.priceDigital}</span>
                     </div>
                     <Link 
                       to={`/project/${quickViewProject.id}`} 
                       className={`px-6 py-2.5 font-medium rounded-lg shadow-lg transition-all flex items-center ${quickViewProject.isPreOrder ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200 text-white' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200 text-white'}`}
                     >
                       {quickViewProject.isPreOrder ? 'Pre-Order' : 'Configure'} <ArrowUpRight className="w-4 h-4 ml-1" />
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
