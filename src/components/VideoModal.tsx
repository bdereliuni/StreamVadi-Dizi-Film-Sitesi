import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  mediaId,
  type,
  season = 1,
  episode = 1,
}) => {
  if (!isOpen) return null;

  const embedUrl = type === 'movie'
    ? `https://vidlink.pro/movie/${mediaId}`
    : `https://vidlink.pro/tv/${mediaId}/${season}/${episode}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-5xl mx-4">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="relative pt-[56.25%]">
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};