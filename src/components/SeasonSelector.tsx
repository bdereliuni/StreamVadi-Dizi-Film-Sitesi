import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Season } from '../types/tmdb';
import { cn } from '../utils/cn';

interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeason: number;
  onSelectSeason: (seasonNumber: number) => void;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  seasons,
  selectedSeason,
  onSelectSeason,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
      >
        <span>Sezon {selectedSeason}</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1D29] border border-white/10 rounded-lg overflow-hidden z-10">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => {
                onSelectSeason(season.season_number);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2 text-left hover:bg-white/10 transition-colors",
                selectedSeason === season.season_number ? "bg-white/20 text-white" : "text-white/80"
              )}
            >
              Season {season.season_number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};