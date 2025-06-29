import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import VideoPlayer from '../../components/VideoPlayer';
import { sampleVideos } from '../../data/videos';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams();
  const video = sampleVideos.find(v => v.id === id);

  if (!video) {
    return null;
  }

  // Transform video data to match VideoPlayer interface
  const videoPlayerData = {
    id: video.id,
    title: video.title,
    description: video.subtitle || video.title,
    duration: 3600, // Default 1 hour
    category: video.category,
    thumbnail: video.thumbnail,
    videoUrl: video.videoUrl,
    likes: (video as any).likes || 0,
    views: (video as any).views || 0,
    genre: video.genre,
    episode: 1,
    totalEpisodes: video.episodes?.length || 1,
    isLocked: video.isLocked,
    isPremium: false,
  };

  return <VideoPlayer video={videoPlayerData} />;
}
