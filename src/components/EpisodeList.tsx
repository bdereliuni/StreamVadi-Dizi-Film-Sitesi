import React from 'react';
import { Play } from 'lucide-react';
import { Episode } from '../types/tmdb';

interface EpisodeListProps {
  episodes: Episode[];
  onPlayEpisode: (episodeNumber: number) => void;
}

export const EpisodeList: React.FC<EpisodeListProps> = React.memo(({
  episodes,
  onPlayEpisode,
}) => {
  return (
    <div className="space-y-3">
      {episodes.map((episode) => (
        <div
          key={episode.id}
          className="flex flex-col sm:flex-row gap-4 p-4 bg-white/5 rounded-lg 
                   hover:bg-white/10 transition-colors duration-200 cursor-pointer group"
          onClick={() => onPlayEpisode(episode.episode_number)}
        >
          <div className="relative sm:w-48 h-32 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
            {episode.still_path ? (
              <>
                <img
                  src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                  alt={episode.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                             transition-opacity duration-200 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" fill="white" />
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <span className="text-white/40">Önizleme Yok</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-medium text-white group-hover:text-indigo-400 
                           transition-colors duration-200 truncate">
                  {episode.episode_number}. Bölüm: {episode.name}
                </h3>
                <p className="text-sm text-white/60 line-clamp-2 mt-1.5">
                  {episode.overview || "Bu bölüm için açıklama bulunmuyor."}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayEpisode(episode.episode_number);
                }}
                className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-600 p-2.5 rounded-full 
                         text-white transition-colors duration-200 shadow-md"
              >
                <Play className="w-4 h-4" fill="white" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-white/60">
              {episode.runtime && (
                <span>{episode.runtime} dk</span>
              )}
              {episode.vote_average > 0 && (
                <span className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  {episode.vote_average.toFixed(1)}
                </span>
              )}
              {episode.air_date && (
                <span>{new Date(episode.air_date).toLocaleDateString('tr-TR')}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

EpisodeList.displayName = 'EpisodeList';