import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Play, Search, X, Info, Star } from 'lucide-react';
import {
  getTrendingMovies,
  getTrendingSeries,
  getPopularMovies,
  getPopularSeries,
  getTopRatedMovies,
  getTopRatedSeries,
  getMediaDetails,
  searchMedia,
  getRandomFeaturedContent,
} from './services/api';
import { MediaSection } from './components/MediaSection';
import { VideoModal } from './components/VideoModal';
import { DetailsModal } from './components/DetailsModal';
import { Movie, TVShow } from './types/tmdb';
import { useDebounce } from './hooks/useDebounce';
import { useWatchHistory } from './hooks/useWatchHistory';

function App() {
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean;
    mediaId: number;
    type: 'movie' | 'tv';
    season?: number;
    episode?: number;
  }>({
    isOpen: false,
    mediaId: 0,
    type: 'movie',
  });

  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    item: Movie | TVShow | null;
    type: 'movie' | 'tv';
  }>({
    isOpen: false,
    item: null,
    type: 'movie',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { data: searchResults, isLoading: isSearching } = useQuery(
    ['search', debouncedSearch],
    () => searchMedia(debouncedSearch),
    {
      enabled: debouncedSearch.length > 2,
    }
  );

  const { data: trendingMovies } = useQuery('trendingMovies', getTrendingMovies);
  const { data: trendingSeries } = useQuery('trendingSeries', getTrendingSeries);
  const { data: popularMovies } = useQuery('popularMovies', getPopularMovies);
  const { data: popularSeries } = useQuery('popularSeries', getPopularSeries);
  const { data: topRatedMovies } = useQuery('topRatedMovies', getTopRatedMovies);
  const { data: topRatedSeries } = useQuery('topRatedSeries', getTopRatedSeries);

  const { data: featuredContent } = useQuery('featuredContent', getRandomFeaturedContent, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const { watchHistory, addToHistory } = useWatchHistory();

  const { data: watchHistoryDetails, isLoading: isLoadingHistory } = useQuery(
    ['watchHistoryDetails', watchHistory],
    async () => {
      if (!watchHistory.length) return [];
      
      const details = await Promise.all(
        watchHistory.map(async (item) => {
          const details = await getMediaDetails(item.id, item.type);
          return {
            ...details,
            type: item.type,
            season: item.season,
            episode: item.episode,
          };
        })
      );
      return details;
    },
    {
      enabled: watchHistory.length > 0,
      staleTime: 1000 * 60 * 5, // 5 dakika
    }
  );

  const handlePlay = (id: number, type: 'movie' | 'tv', season?: number, episode?: number) => {
    setVideoModal({ isOpen: true, mediaId: id, type, season, episode });

    const item = type === 'movie'
      ? trendingMovies?.find(m => m.id === id) || popularMovies?.find(m => m.id === id) || topRatedMovies?.find(m => m.id === id)
      : trendingSeries?.find(s => s.id === id) || popularSeries?.find(s => s.id === id) || topRatedSeries?.find(s => s.id === id);

    if (item) {
      addToHistory({
        id,
        type,
        title: 'title' in item ? item.title : item.name,
        poster_path: item.poster_path,
        timestamp: Date.now(),
        ...(type === 'tv' && { season, episode }),
      });
    }
  };

  const handleDetails = async (item: Movie | TVShow, type: 'movie' | 'tv') => {
    const details = await getMediaDetails(item.id, type);
    setDetailsModal({ isOpen: true, item: details, type });
  };

  const handleLogoClick = () => {
    setSearchQuery(''); // Aramayı temizle
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sayfayı yukarı kaydır
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0A0F1C] to-transparent z-30 pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 py-4 z-40">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto px-8">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
          >
            <div className="bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 p-2.5 rounded-xl
                         shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/50
                         group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500
                         transition-all duration-300">
              <Play className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-white to-white/70 
                         bg-clip-text text-transparent group-hover:to-white transition-all duration-300">
              SinemaVadi
            </span>
          </button>
          
          <div className="relative w-full max-w-xl ml-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 
                               group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Film veya dizi ara..."
                className="w-full bg-white/[0.07] text-white pl-12 pr-4 py-3.5 rounded-full 
                         border border-white/10 focus:border-indigo-500 focus:outline-none 
                         focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300
                         placeholder:text-gray-400 hover:bg-white/[0.12]
                         backdrop-blur-xl shadow-lg shadow-black/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                           hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Ana içerik */}
        {debouncedSearch.length <= 2 && (
          <div>
            {/* Featured Section */}
            {featuredContent && (
              <section className="relative w-full h-[85vh] group overflow-hidden">
                {/* Arkaplan */}
                <div className="absolute inset-0">
                  <img
                    src={`https://image.tmdb.org/t/p/original${featuredContent.item.backdrop_path}`}
                    alt={('title' in featuredContent.item) ? featuredContent.item.title : featuredContent.item.name}
                    className="w-full h-full object-cover brightness-[0.6] scale-105 
                             transition-transform duration-[1.5s]"
                    style={{ objectPosition: 'center 15%' }}
                  />
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1C] via-[#0A0F1C]/40 to-transparent" />
                </div>

                {/* İçerik */}
                <div className="absolute inset-x-0 bottom-0 pb-20">
                  <div className="max-w-[1800px] mx-auto px-8">
                    <div className="max-w-3xl space-y-6 opacity-100 translate-y-0">
                      {/* Başlık */}
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
                        {('title' in featuredContent.item) ? featuredContent.item.title : featuredContent.item.name}
                      </h1>

                      {/* Meta Bilgiler */}
                      <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm sm:text-base">
                        <span>{new Date(('release_date' in featuredContent.item) ? 
                          featuredContent.item.release_date : 
                          featuredContent.item.first_air_date).getFullYear()}</span>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1.5" />
                          <span>{featuredContent.item.vote_average.toFixed(1)}</span>
                        </div>
                        {'runtime' in featuredContent.item && featuredContent.item.runtime && (
                          <span>{Math.floor(featuredContent.item.runtime / 60)}s {featuredContent.item.runtime % 60}dk</span>
                        )}
                        {featuredContent.item.genres && (
                          <div className="flex flex-wrap gap-2">
                            {featuredContent.item.genres.slice(0, 2).map(genre => (
                              <span key={genre.id} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm">
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Açıklama */}
                      <p className="text-white/90 text-base sm:text-lg max-w-2xl line-clamp-3">
                        {featuredContent.item.overview}
                      </p>

                      {/* Butonlar */}
                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={() => handlePlay(featuredContent.item.id, featuredContent.type)}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600
                                  hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold 
                                  transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/25
                                  hover:shadow-indigo-500/50"
                        >
                          <Play className="w-5 h-5" fill="white" /> Oynat
                        </button>
                        <button
                          onClick={() => handleDetails(featuredContent.item, featuredContent.type)}
                          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 
                                  text-white rounded-xl font-semibold transition-all duration-300
                                  backdrop-blur-sm transform hover:scale-105 border border-white/10
                                  hover:border-white/20"
                        >
                          <Info className="w-5 h-5" /> Detaylar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* İzleme Geçmişi */}
            {watchHistory.length > 0 && (
              <div className="relative bg-[#0A0F1C] z-10">
                <div className="space-y-12 py-12 px-8 max-w-[1800px] mx-auto">
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
                    </div>
                  ) : watchHistoryDetails && (
                    <MediaSection
                      title="İzlemeye Devam Edin"
                      items={watchHistoryDetails}
                      type="mixed"
                      onPlay={(id) => {
                        const historyItem = watchHistory.find(item => item.id === id);
                        if (historyItem) {
                          handlePlay(id, historyItem.type, historyItem.season, historyItem.episode);
                        }
                      }}
                      onDetails={async (item) => {
                        const historyItem = watchHistory.find(h => h.id === item.id);
                        if (historyItem) {
                          setDetailsModal({ isOpen: true, item, type: historyItem.type });
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Kategoriler */}
            <div className="relative bg-[#0A0F1C] z-10">
              <div className="space-y-12 py-12 px-8 max-w-[1800px] mx-auto">
                {trendingMovies && (
                  <MediaSection
                    title="Haftanın Trend Filmleri"
                    items={trendingMovies}
                    type="movie"
                    onPlay={handlePlay}
                    onDetails={handleDetails}
                  />
                )}
                {trendingSeries && (
                  <MediaSection
                    title="Haftanın Trend Dizileri"
                    items={trendingSeries}
                    type="tv"
                    onPlay={handlePlay}
                    onDetails={handleDetails}
                  />
                )}
                {popularMovies && (
                  <MediaSection
                    title="Popüler Filmler"
                    items={popularMovies}
                    type="movie"
                    onPlay={handlePlay}
                    onDetails={handleDetails}
                  />
                )}
                {popularSeries && (
                  <MediaSection
                    title="Popüler Diziler"
                    items={popularSeries}
                    type="tv"
                    onPlay={handlePlay}
                    onDetails={handleDetails}
                  />
                )}
                {topRatedMovies && (
                  <MediaSection
                    title="En İyi Filmler"
                    items={topRatedMovies}
                    type="movie"
                    onPlay={handlePlay}
                    onDetails={handleDetails}
                  />
                )}
                {topRatedSeries && (
                  <MediaSection
                    title="En İyi Diziler"
                    items={topRatedSeries}
                    type="tv"
                    onPlay={handlePlay}
                    onDetails={handleDetails}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Arama Sonuçları */}
        {debouncedSearch.length > 2 && (
          <div className="pt-24 px-8 max-w-[1800px] mx-auto">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent"></div>
                <p className="text-white/60 mt-4">Aranıyor...</p>
              </div>
            ) : (
              <>
                {searchResults?.movies.length > 0 && (
                  <MediaSection
                    title="Film Sonuçları"
                    items={searchResults.movies}
                    type="movie"
                    onPlay={handlePlay}
                    onDetails={handleDetails}
                  />
                )}
                {searchResults?.tvShows.length > 0 && (
                  <MediaSection
                    title="Dizi Sonuçları"
                    items={searchResults.tvShows}
                    type="tv"
                    onPlay={handlePlay}
                    onDetails={handleDetails}
                  />
                )}
                {searchResults?.movies.length === 0 && searchResults?.tvShows.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-white/80 text-lg">Sonuç bulunamadı</div>
                    <p className="text-white/60 mt-2">Farklı anahtar kelimeler deneyebilirsiniz</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0F1C]/90 border-t border-white/5 py-8 mt-16">
        <div className="max-w-[1800px] mx-auto px-8 text-center">
          <p className="text-white/60">
            © 2024 SinemaVadi. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>

      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ ...videoModal, isOpen: false })}
        mediaId={videoModal.mediaId}
        type={videoModal.type}
        season={videoModal.season}
        episode={videoModal.episode}
      />

      <DetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ ...detailsModal, isOpen: false })}
        item={detailsModal.item}
        type={detailsModal.type}
        onPlay={handlePlay}
      />
    </div>
  );
}

export default App;