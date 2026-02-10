
import React, { useState, useMemo, useEffect } from 'react';
import { Department, ProjectTier, Project, Difficulty } from '../types';
import { DataManager } from '../services/dataManager';
import { Eye, ChevronRight, Zap, Star, ArrowUpRight, Search, X, Clock, Trophy, Instagram, Users, ExternalLink, Heart, ImageOff } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { FilterDropdown } from '../components/FilterDropdown';
import { FilterChips } from '../components/FilterChips';

const getDifficultyColor = (diff: Difficulty) => {
  switch (diff) {
    case Difficulty.EASY: return 'bg-green-100 text-green-800';
    case Difficulty.MODERATE: return 'bg-yellow-100 text-yellow-800';
    case Difficulty.HARD: return 'bg-red-100 text-red-800';
  }
};

const ProjectSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col animate-pulse">
    <div className="h-48 bg-slate-200 w-full relative">
       <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <div className="h-5 w-20 bg-slate-300 rounded"></div>
       </div>
    </div>
    <div className="p-5 flex-1 space-y-4">
       <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
       </div>
       <div className="h-16 bg-slate-100 rounded"></div>
       <div className="flex justify-between items-center pt-2">
          <div className="h-5 w-20 bg-slate-200 rounded"></div>
          <div className="h-8 w-24 bg-slate-200 rounded"></div>
       </div>
    </div>
  </div>
);

interface ProjectCardProps {
  project: Project;
  showBadge?: boolean;
  onQuickView: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, showBadge = false, onQuickView }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(project.id);
  const studentsBought = useMemo(() => Math.floor(project.reviewCount * (2 + Math.random())), [project.reviewCount]);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden h-full relative">
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        {imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                <ImageOff className="w-8 h-8 mb-2" />
                <span className="text-xs">Image unavailable</span>
            </div>
        ) : (
            <img 
                src={project.imageUrl} 
                alt={project.title} 
                loading="lazy" 
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
        )}
        
        <button 
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleWishlist(project.id); }}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-white/90 backdrop-blur shadow-sm hover:scale-110 active:scale-95 transition-transform"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-red-500 animate-pop' : 'text-slate-400 hover:text-red-500'}`} aria-hidden="true" />
        </button>

        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start pointer-events-none">
          {project.isPreOrder && <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center"><Clock className="w-3 h-3 mr-1" aria-hidden="true" /> Pre-Order</span>}
          {showBadge && !project.isPreOrder && <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center"><Star className="w-3 h-3 mr-1 fill-current" aria-hidden="true" /> Trending</span>}
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
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur hover:bg-white text-slate-800 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110 active:scale-95"
          title="Quick View"
          aria-label={`Quick view ${project.title}`}
        >
          <Eye className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">{project.title}</h3>
          </div>
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" aria-hidden="true" />
                <span className="text-sm font-bold text-slate-800">{project.rating || 'New'}</span>
                <span className="text-xs text-slate-500">({project.reviewCount})</span>
             </div>
             <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full" title={`${studentsBought} students have purchased this project`}>
                <Users className="w-3 h-3 mr-1 text-blue-500" aria-hidden="true" /> {studentsBought} bought
             </div>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{project.description}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold">Base Price</span>
            <div className="text-lg font-bold text-orange-600">₹{project.priceDigital}</div>
          </div>
          <Link 
            to={`/project/${project.id}`}
            className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow"
            aria-label={`View details for ${project.title}`}
          >
            {project.isPreOrder ? 'Pre-Order' : 'Details'} <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const CompetitionBanner = () => (
  <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-2xl p-8 mb-12 relative overflow-hidden text-white shadow-xl animate-fadeIn">
    <div className="absolute top-0 right-0 p-8 opacity-10">
      <Trophy className="w-64 h-64 text-yellow-300 transform rotate-12" aria-hidden="true" />
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
    
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="space-y-4">
        <div className="inline-flex items-center bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-400/30">
          <Zap className="w-3 h-3 mr-2 animate-pulse" aria-hidden="true" /> Monthly Innovation Challenge
        </div>
        <h2 className="text-3xl font-bold">Build the Best "Green Energy" Project</h2>
        <p className="text-slate-300 max-w-xl">
          Compete with students across India. Submit your project video by <strong>November 30th</strong>. 
          Winners get <span className="text-white font-bold">₹10,000 Cash Prize</span> + Internship opportunities.
        </p>
        <div className="flex gap-4 pt-2">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-6 py-2.5 rounded-lg font-bold transition-colors transform hover:-translate-y-0.5 active:translate-y-0">
            Register Now
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg font-medium transition-colors border border-white/20">
            View Leaderboard
          </button>
        </div>
      </div>
      <div className="hidden md:block" aria-hidden="true">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center max-w-xs transform hover:scale-105 transition-transform duration-300">
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
         <Instagram className="w-5 h-5 mr-2 text-pink-500" aria-hidden="true" /> Featured Student Projects
       </h2>
       <a href="#" className="text-sm text-slate-500 hover:text-pink-600 flex items-center font-medium">
         Follow @pygenicarc <ExternalLink className="w-3 h-3 ml-1" aria-hidden="true" />
       </a>
     </div>
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
       {[
         'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=400&q=80',
         'https://images.unsplash.com/photo-1563770095-39d468f95742?auto=format&fit=crop&w=400&q=80',
         'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
         'https://images.unsplash.com/photo-1517420704952-d9f39714c720?auto=format&fit=crop&w=400&q=80'
       ].map((img, i) => (
         <div key={i} className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md">
           <img src={img} alt={`Student Project Feature ${i+1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <span className="text-white text-xs font-bold mb-1">@student_{100+i}</span>
              <p className="text-white/80 text-[10px] line-clamp-2">Built this amazing project using the Pygenicarc kit! #engineering #diy</p>
           </div>
           <div className="absolute top-3 right-3 bg-black/20 backdrop-blur p-1.5 rounded-full">
             <Instagram className="w-4 h-4 text-white" aria-hidden="true" />
           </div>
         </div>
       ))}
     </div>
  </section>
);

const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Advanced Filter States
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  // We removed Tier filter from UI for compactness but keep logic if needed, or remove. 
  // Keeping it simple as per request for "Amazon like".
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  
  const [priceRange, setPriceRange] = useState<number>(15000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('popularity');

  // Quick View State
  const [quickViewProject, setQuickViewProject] = useState<Project | null>(null);

  // Constants & Computed
  const maxPriceLimit = 15000;

  // Load Data
  useEffect(() => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
        setProjects(DataManager.getProjects());
        setIsLoading(false);
    }, 800);
  }, []);

  // Load preferences from local storage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('pygenicarc_filters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        if (parsed.depts) setSelectedDepts(parsed.depts);
        if (parsed.diffs) setSelectedDifficulties(parsed.diffs);
        if (parsed.price) setPriceRange(parsed.price);
        if (parsed.rating) setMinRating(parsed.rating);
        if (parsed.stock) setInStockOnly(parsed.stock);
      } catch (e) {
        console.error("Failed to parse filters", e);
      }
    }
  }, []);

  // Save preferences
  useEffect(() => {
    const filters = {
      depts: selectedDepts,
      diffs: selectedDifficulties,
      price: priceRange,
      rating: minRating,
      stock: inStockOnly
    };
    localStorage.setItem('pygenicarc_filters', JSON.stringify(filters));
  }, [selectedDepts, selectedDifficulties, priceRange, minRating, inStockOnly]);

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Search Text Filter
      const searchContent = `${p.title} ${p.description} ${p.components.join(' ')}`.toLowerCase();
      const matchesSearch = !searchQuery || searchContent.includes(searchQuery.toLowerCase());

      // Multi-select Filters
      const matchesDept = selectedDepts.length === 0 || selectedDepts.includes(p.department);
      const matchesDiff = selectedDifficulties.length === 0 || selectedDifficulties.includes(p.difficulty);
      
      // Advanced Filters
      const matchesPrice = p.priceDigital <= priceRange;
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
  }, [projects, searchQuery, selectedDepts, selectedDifficulties, priceRange, minRating, inStockOnly, sortBy]);

  // View state check
  const isDefaultView = !searchQuery && 
    selectedDepts.length === 0 && 
    selectedDifficulties.length === 0 &&
    priceRange === maxPriceLimit && 
    minRating === 0 && 
    !inStockOnly &&
    sortBy === 'popularity';
  
  const trendingProjects = useMemo(() => [...projects].sort((a, b) => b.popularity - a.popularity).slice(0, 4), [projects]);
  const recommendedProjects = useMemo(() => projects.filter(p => p.department === Department.CSE || p.department === Department.ECE).slice(0, 4), [projects]);

  const clearFilters = () => {
    setSelectedDepts([]);
    setSelectedDifficulties([]);
    setPriceRange(maxPriceLimit);
    setMinRating(0);
    setInStockOnly(false);
    setSearchParams({});
    setSortBy('popularity');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Main Content */}
      <main className="w-full">
        
        {/* Monthly Competition Banner (Top of Gallery) */}
        {isDefaultView && <CompetitionBanner />}

        {/* Header with Search, Sort, and FilterDropdown */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
            {searchQuery ? (
              <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                 Search Results for "<span className="text-orange-600">{searchQuery}</span>"
                 <span className="text-sm font-normal text-slate-500 ml-2">({filteredProjects.length} found)</span>
              </h1>
            ) : (
              <>
                 <h1 className="text-2xl font-bold text-slate-900">Project Gallery</h1>
                 <p className="text-sm text-slate-500">Showing {filteredProjects.length} engineering projects</p>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
             <div className="relative">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-lg py-2 pl-3 pr-8 focus:ring-orange-500 focus:border-orange-500 cursor-pointer font-medium hover:bg-slate-50 transition-colors"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
             </div>

             <FilterDropdown 
                selectedDepts={selectedDepts} setSelectedDepts={setSelectedDepts}
                selectedDifficulties={selectedDifficulties} setSelectedDifficulties={setSelectedDifficulties}
                priceRange={priceRange} setPriceRange={setPriceRange}
                minRating={minRating} setMinRating={setMinRating}
                inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
                maxPriceLimit={maxPriceLimit}
                onClearAll={clearFilters}
             />
          </div>
        </div>

        {/* Filter Chips Active State */}
        <FilterChips 
            selectedDepts={selectedDepts} setSelectedDepts={setSelectedDepts}
            selectedDifficulties={selectedDifficulties} setSelectedDifficulties={setSelectedDifficulties}
            priceRange={priceRange} setPriceRange={setPriceRange}
            minRating={minRating} setMinRating={setMinRating}
            inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
            maxPriceLimit={maxPriceLimit}
            onClearAll={clearFilters}
        />

        {/* Discovery Sections */}
        {isDefaultView && !isLoading && (
          <div className="space-y-10 mb-10 animate-slideUp">
             {/* Trending */}
             <section>
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-slate-900 flex items-center">
                   <Zap className="w-5 h-5 text-yellow-500 mr-2 fill-current" aria-hidden="true" /> Trending Projects
                 </h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {trendingProjects.map(p => <ProjectCard key={p.id} project={p} showBadge={true} onQuickView={setQuickViewProject} />)}
               </div>
             </section>

             {/* Instagram Feed Integration */}
             <InstagramFeed />

             {/* Recommended */}
             <section>
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-slate-900 flex items-center">
                   <Star className="w-5 h-5 text-orange-500 mr-2" aria-hidden="true" /> Recommended for You
                 </h2>
                 <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Based on ECE/CSE Interest</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {recommendedProjects.map(p => <ProjectCard key={p.id} project={p} onQuickView={setQuickViewProject} />)}
               </div>
             </section>

             <div className="border-t border-slate-200 my-8"></div>
             <h2 className="text-xl font-bold text-slate-900 mb-6">Browse All Projects</h2>
          </div>
        )}

        {/* Main Grid */}
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => <ProjectSkeleton key={i} />)}
            </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onQuickView={setQuickViewProject} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300 animate-fadeIn">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="w-10 h-10 text-slate-300" aria-hidden="true" />
             </div>
             <h3 className="text-xl font-bold text-slate-900">No projects found</h3>
             <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">
               We couldn't find any projects matching your search or filters. Try adjusting your criteria.
             </p>
             <button onClick={clearFilters} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
               Clear All Filters
             </button>
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      {quickViewProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={() => setQuickViewProject(null)} role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative animate-pop" onClick={e => e.stopPropagation()}>
             <button onClick={() => setQuickViewProject(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full z-10 hover:bg-slate-200 transition-colors" aria-label="Close modal">
               <X className="w-5 h-5" />
             </button>
             
             <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-5/12 bg-slate-100 relative h-64 md:h-auto">
                  <img src={quickViewProject.imageUrl} alt={quickViewProject.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                     <div className="flex items-center text-white">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" aria-hidden="true" />
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
                    <h2 id="quick-view-title" className="text-xl font-bold text-slate-900 mb-2 leading-tight">{quickViewProject.title}</h2>
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
                       className={`px-6 py-2.5 font-medium rounded-lg shadow-lg transition-all flex items-center transform hover:-translate-y-0.5 ${quickViewProject.isPreOrder ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200 text-white' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200 text-white'}`}
                     >
                       {quickViewProject.isPreOrder ? 'Pre-Order' : 'Configure'} <ArrowUpRight className="w-4 h-4 ml-1" aria-hidden="true" />
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
