import axios from 'axios';
import { Movie, TVShow, Season } from '../types/tmdb';

const TMDB_API_KEY = 'ea021b3b0775c8531592713ab727f254';
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'tr-TR',
  },
});

export const getTrendingMovies = () => 
  api.get('/trending/movie/week').then(res => res.data.results);

export const getTrendingSeries = () => 
  api.get('/trending/tv/week').then(res => res.data.results);

export const getPopularMovies = () => 
  api.get('/movie/popular').then(res => res.data.results);

export const getPopularSeries = () => 
  api.get('/tv/popular').then(res => res.data.results);

export const getTopRatedMovies = () => 
  api.get('/movie/top_rated').then(res => res.data.results);

export const getTopRatedSeries = () => 
  api.get('/tv/top_rated').then(res => res.data.results);

export const getMediaDetails = async (id: number, type: 'movie' | 'tv'): Promise<Movie | TVShow> => {
  const response = await api.get(`/${type}/${id}`);
  if (type === 'tv') {
    const tvShow = response.data;
    // Fetch all seasons data
    const seasonsPromises = tvShow.seasons?.map(async (season: Season) => {
      const seasonResponse = await api.get(`/tv/${id}/season/${season.season_number}`);
      return seasonResponse.data;
    }) || [];
    const seasons = await Promise.all(seasonsPromises);
    return { ...tvShow, seasons };
  }
  return response.data;
};

export const searchMedia = async (query: string) => {
  const [movieResults, tvResults] = await Promise.all([
    api.get('/search/movie', { params: { query } }).then(res => res.data.results),
    api.get('/search/tv', { params: { query } }).then(res => res.data.results)
  ]);

  return {
    movies: movieResults,
    tvShows: tvResults
  };
};

export const getRandomFeaturedContent = async () => {
  try {
    // Popüler filmleri al
    const movies = await api.get('/movie/popular').then(res => res.data.results);
    
    // Türkçe açıklaması olan filmleri filtrele
    const moviesWithTurkishContent = movies.filter(movie => 
      movie.overview && movie.overview.trim() !== '' && 
      movie.title && movie.title.trim() !== ''
    );

    if (moviesWithTurkishContent.length === 0) {
      throw new Error('No movies with Turkish content found');
    }

    // İlk 10 filmden (veya daha az varsa tümünden) rastgele birini seç
    const numberOfMovies = Math.min(moviesWithTurkishContent.length, 10);
    const randomContent = moviesWithTurkishContent[Math.floor(Math.random() * numberOfMovies)];
    
    // Seçilen filmin detaylarını al
    const details = await getMediaDetails(randomContent.id, 'movie');

    // Detayları kontrol et
    if (!details.overview || details.overview.trim() === '') {
      throw new Error('Selected movie has no Turkish content');
    }
    
    return {
      item: details,
      type: 'movie' as const
    };
  } catch (error) {
    // Hata durumunda tekrar dene veya varsayılan bir film seç
    const movies = await api.get('/movie/popular').then(res => res.data.results);
    
    // İlk Türkçe içeriği olan filmi bul
    const firstMovieWithContent = movies.find(movie => 
      movie.overview && movie.overview.trim() !== '' && 
      movie.title && movie.title.trim() !== ''
    );

    if (!firstMovieWithContent) {
      throw new Error('No movies with Turkish content available');
    }

    const details = await getMediaDetails(firstMovieWithContent.id, 'movie');
    
    return {
      item: details,
      type: 'movie' as const
    };
  }
};