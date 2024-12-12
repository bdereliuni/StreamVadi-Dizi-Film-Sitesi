import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaCard } from './MediaCard';
import { Movie, TVShow } from '../types/tmdb';

interface MediaSectionProps {
  title: string;
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv' | 'mixed';
  onPlay: (id: number, type: 'movie' | 'tv') => void;
  onDetails: (item: Movie | TVShow, type: 'movie' | 'tv') => void;
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  title,
  items,
  type,
  onPlay,
  onDetails,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative group py-4">
      <h2 className="text-2xl font-bold mb-8">
        <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      
      <div className="relative -mx-8">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-8 z-10 px-8 
                   bg-gradient-to-r from-[#0A0F1C] to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   flex items-center justify-start"
        >
          <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm
                       hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 px-8 pb-8 scroll-smooth hide-scrollbar"
        >
          {items.map((item) => (
            <div key={item.id} className="flex-none w-[240px] first:ml-0 last:mr-0">
              <MediaCard
                item={item}
                type={type}
                onPlay={onPlay}
                onDetails={onDetails}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-8 z-10 px-8
                   bg-gradient-to-l from-[#0A0F1C] to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   flex items-center justify-end"
        >
          <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm
                       hover:bg-white/20 transition-colors">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </button>
      </div>
    </section>
  );
};