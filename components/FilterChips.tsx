
import React from 'react';
import { X } from 'lucide-react';

interface FilterChipsProps {
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

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedDepts, setSelectedDepts,
  selectedDifficulties, setSelectedDifficulties,
  priceRange, setPriceRange,
  minRating, setMinRating,
  inStockOnly, setInStockOnly,
  maxPriceLimit, onClearAll
}) => {
  const chips: { label: string; onRemove: () => void }[] = [
    ...selectedDepts.map(d => ({ label: d, onRemove: () => setSelectedDepts(selectedDepts.filter(i => i !== d)) })),
    ...selectedDifficulties.map(d => ({ label: d, onRemove: () => setSelectedDifficulties(selectedDifficulties.filter(i => i !== d)) })),
  ];

  if (priceRange < maxPriceLimit) {
    chips.push({ label: `< ₹${priceRange}`, onRemove: () => setPriceRange(maxPriceLimit) });
  }
  if (minRating > 0) {
    chips.push({ label: `${minRating}+ Stars`, onRemove: () => setMinRating(0) });
  }
  if (inStockOnly) {
    chips.push({ label: 'In Stock', onRemove: () => setInStockOnly(false) });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6 animate-fadeIn">
      <span className="text-xs font-semibold text-slate-500 mr-1">Active:</span>
      {chips.map((chip, idx) => (
        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors">
          {chip.label} 
          <button 
            onClick={chip.onRemove} 
            className="ml-1.5 p-0.5 hover:bg-slate-300 rounded-full transition-colors"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      
      {chips.length > 1 && (
        <button 
          onClick={onClearAll} 
          className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline ml-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
};
