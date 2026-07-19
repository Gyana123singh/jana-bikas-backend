import React, { useState } from 'react';
import { X, Play, Calendar, MapPin, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { mockGallery } from '../data/ngoData';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'videos'
  const [selectedPhotoFilter, setSelectedPhotoFilter] = useState('All');
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const photoCategories = ['All', 'Education', 'Health Care', 'Environment', 'Agriculture', 'Empowerment'];

  const filteredPhotos = selectedPhotoFilter === 'All' 
    ? mockGallery.photos 
    : mockGallery.photos.filter(p => p.category === selectedPhotoFilter);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Header Banner */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80')` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent-400">Visual Journey</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">Activity Gallery</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            Glimpses of our active projects, plantation drives, distribution camps, and classrooms on the ground.
          </p>
        </div>
      </section>

      {/* 2. Tabs Selector & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Photos / Videos Toggle Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => { setActiveTab('photos'); setPlayingVideo(null); }}
              className={`flex items-center space-x-2 py-2.5 px-6 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'photos' 
                  ? 'bg-white text-primary-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Photos</span>
            </button>
            <button
              onClick={() => { setActiveTab('videos'); setLightboxPhoto(null); }}
              className={`flex items-center space-x-2 py-2.5 px-6 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'videos' 
                  ? 'bg-white text-primary-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <VideoIcon className="w-4 h-4" />
              <span>Videos</span>
            </button>
          </div>
        </div>

        {/* Categories Bar (Photos only) */}
        {activeTab === 'photos' && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {photoCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedPhotoFilter(category)}
                className={`py-1.5 px-4 rounded-full text-xs font-bold transition-all ${
                  selectedPhotoFilter === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* 3. Photos Grid */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo) => (
              <div 
                key={photo.id}
                onClick={() => setLightboxPhoto(photo)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-100 shadow-premium hover:shadow-premium-hover cursor-pointer transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <img 
                  src={photo.url} 
                  alt={photo.title}
                  className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Hover overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white text-left space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-accent-300">
                    {photo.category}
                  </span>
                  <h4 className="text-base font-bold leading-snug">{photo.title}</h4>
                  <div className="flex items-center space-x-4 text-[10px] text-slate-300 pt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{photo.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{photo.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Videos Grid */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockGallery.videos.map((video) => (
              <div 
                key={video.id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden flex flex-col h-full"
              >
                {/* Thumbnail / Embed Frame */}
                {playingVideo === video.id ? (
                  <div className="relative aspect-[16/9] w-full">
                    <iframe
                      src={`${video.embedUrl}?autoplay=1`}
                      title={video.title}
                      className="absolute inset-0 w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div 
                    onClick={() => setPlayingVideo(video.id)}
                    className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden cursor-pointer group"
                  >
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                    />
                    {/* Play Button Icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 group-hover:bg-slate-950/40 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-5 flex-grow flex flex-col justify-between">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{video.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-4 mt-2 border-t border-slate-50">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{video.date}</span>
                    </div>
                    {playingVideo === video.id && (
                      <button 
                        onClick={() => setPlayingVideo(null)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Close Video
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* 5. Lightbox Modal Overlay (Photos) */}
      {lightboxPhoto && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-4xl max-h-[70vh] w-full overflow-hidden rounded-2xl shadow-2xl bg-slate-900 flex items-center justify-center">
            <img 
              src={lightboxPhoto.url} 
              alt={lightboxPhoto.title} 
              className="object-contain max-w-full max-h-[70vh]"
            />
          </div>

          <div className="max-w-4xl w-full text-left text-white mt-6 space-y-2 px-4">
            <span className="text-xs uppercase font-bold tracking-widest text-accent-400">
              {lightboxPhoto.category}
            </span>
            <h3 className="text-xl font-display font-bold leading-tight">{lightboxPhoto.title}</h3>
            <div className="flex items-center space-x-6 text-xs text-slate-400 pt-1">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{lightboxPhoto.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{lightboxPhoto.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;
