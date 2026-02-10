
import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Department, Difficulty } from '../types';

interface FilterDropdownProps {
  selectedDepts: string[];
  setSelectedDepts: (val: string[]) => void;
  selectedDifficulties: string[];
  setSelectedDifficulties: (val: string[]) => void;
  priceRange: number;
  setPriceRange: (val: number) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  maxPriceLimit: number;
  onClearAll: () => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  selectedDepts, setSelectedDepts,
  selectedDifficulties, setSelectedDifficulties,
  priceRange, setPriceRange,
  minRating, setMinRating,
  inStockOnly, setInStockOnly,
  maxPriceLimit, onClearAll
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (item: string, current: string[], setter: (v: string[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const activeCount = 
    selectedDepts.length + 
    selectedDifficulties.length + 
    (priceRange < maxPriceLimit ? 1 : 0) + 
    (minRating > 0 ? 1 : 0) + 
    (inStockOnly ? 1 : 0);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
          isOpen || activeCount > 0
            ? 'bg-slate-900 text-white border-slate-900' 
            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Filters
        {activeCount > 0 && (
          <span className="ml-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-fadeIn max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <h3 className="font-bold text-slate-900">Filter Projects</h3>
            <div className="flex items-center gap-3">
                {activeCount > 0 && (
                    <button onClick={onClearAll} className="text-xs text-red-500 font-medium hover:underline">
                    Clear All
                    </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
                </button>
            </div>
          </div>

          <div className="p-5 space-y-6">
            {/* Departments */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Department</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(Department).map(d => (
                  <button
                    key={d}
                    onClick={() => toggleFilter(d, selectedDepts, setSelectedDepts)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                      selectedDepts.includes(d)
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Max Price</label>
                <span className="text-xs font-bold text-slate-900">₹{priceRange.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max={maxPriceLimit} 
                step="500" 
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
               <span>₹500</span>
               <span>₹{maxPriceLimit.toLocaleString()}+</span>
             </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(Difficulty).map(d => (
                  <button
                    key={d}
                    onClick={() => toggleFilter(d, selectedDifficulties, setSelectedDifficulties)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                      selectedDifficulties.includes(d)
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Minimum Rating</label>
              <div className="space-y-2">
                {[4, 3, 2, 0].map(r => (
                  <label key={r} className="flex items-center text-sm text-slate-600 cursor-pointer hover:bg-slate-50 p-1.5 rounded -mx-1.5">
                    <input 
                        type="radio" 
                        name="rating" 
                        checked={minRating === r}
                        onChange={() => setMinRating(r)}
                        className="mr-2 text-orange-600 focus:ring-orange-500"
                    />
                    {r === 0 ? 'Any Rating' : `${r}+ Stars`}
                  </label>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div>
               <label className="flex items-center text-sm font-medium text-slate-700 cursor-pointer bg-slate-50 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                 <input 
                    type="checkbox" 
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500 mr-3 w-4 h-4"
                 />
                 In Stock Only
               </label>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 sticky bottom-0 rounded-b-xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
