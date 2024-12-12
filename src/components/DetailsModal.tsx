import React, { useState } from 'react';
import { X, Play, Star } from 'lucide-react';
import { Movie, TVShow } from '../types/tmdb';
import { SeasonSelector } from './SeasonSelector';
import { EpisodeList } from './EpisodeList';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Movie | TVShow | null;
  type: 'movie' | 'tv';
  onPlay: (id: number, type: 'movie' | 'tv', season?: number, episode?: number) => void;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  item,
  type,
  onPlay,
}) => {
  const [selectedSeason, setSelectedSeason] = useState(1);

  if (!isOpen || !item) return null;

  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const currentSeason = 'seasons' in item ? 
    item.seasons?.find(s => s.season_number === selectedSeason) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-40 overflow-hidden">
      <div className="h-full overflow-y-auto">
        <div className="min-h-full flex items-start justify-center py-8 px-4">
          <div className="relative w-full max-w-4xl bg-[#1A1D29] rounded-lg shadow-xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative h-[300px] sm:h-[400px]">
              <img
                src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                alt={title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D29] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 sm:p-6">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">{title}</h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/80">
                  <span>{new Date(releaseDate).getFullYear()}</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{item.vote_average.toFixed(1)}</span>
                  </div>
                  {'runtime' in item && item.runtime && (
                    <span>{Math.floor(item.runtime / 60)}h {item.runtime % 60}m</span>
                  )}
                  {'number_of_seasons' in item && item.number_of_seasons && (
                    <span>{item.number_of_seasons} Season{item.number_of_seasons > 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {type === 'movie' ? (
                <button
                  onClick={() => onPlay(item.id, type)}
                  className="flex items-center justify-center gap-2 w-full bg-white text-black py-3 rounded-lg font-semibold mb-6 hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-5 h-5" /> Oynat
                </button>
              ) : null}

              <p className="text-white/80 mb-4 text-sm sm:text-base">{item.overview}</p>

              {item.genres && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {type === 'tv' && item.seasons && (
                <div className="space-y-6">
                  <SeasonSelector
                    seasons={item.seasons}
                    selectedSeason={selectedSeason}
                    onSelectSeason={setSelectedSeason}
                  />
                  
                  {currentSeason?.episodes && (
                    <EpisodeList
                      episodes={currentSeason.episodes}
                      onPlayEpisode={(episodeNumber) => {
                        onClose();
                        onPlay(item.id, type, selectedSeason, episodeNumber);
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};