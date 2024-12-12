import React from 'react';
import { Play, Info, Star } from 'lucide-react';
import { Movie, TVShow } from '../types/tmdb';

interface MediaCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
  onPlay: (id: number, type: 'movie' | 'tv') => void;
  onDetails: (item: Movie | TVShow, type: 'movie' | 'tv') => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, type, onPlay, onDetails }) => {
  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;

  return (
    <div 
      className="relative group cursor-pointer" 
      onClick={() => onDetails(item, type)}
    >
      <div className="relative overflow-hidden rounded-xl aspect-[2/3] shadow-lg 
                    shadow-black/20 group-hover:shadow-indigo-500/20 transition-shadow duration-300">
        <img
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full 
                       group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex gap-2 mb-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(item.id, type);
                }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-2.5 
                         transform hover:scale-110 transition-all duration-300
                         shadow-lg shadow-indigo-500/50"
              >
                <Play className="w-5 h-5" fill="white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDetails(item, type);
                }}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5
                         transform hover:scale-110 transition-all duration-300
                         backdrop-blur-sm"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-white font-medium truncate group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-400">{new Date(releaseDate).getFullYear()}</p>
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span>{item.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};