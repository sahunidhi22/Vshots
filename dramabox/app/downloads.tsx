import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  RefreshControl,
  ProgressBarAndroid,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { sampleVideos } from '../data/videos';

interface DownloadItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
  fileSize: number; // in MB
  downloadedAt: number;
  progress: number; // 0-1 for downloading, 1 for completed
  status: 'downloading' | 'completed' | 'paused' | 'failed';
  localPath?: string;
  category: string;
  quality: '480p' | '720p' | '1080p';
}

export default function DownloadsScreen() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'size'>('recent');
  const [filter, setFilter] = useState<'all' | 'downloading' | 'completed'>('all');

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = () => {
    // Mock downloads data
    const mockDownloads: DownloadItem[] = sampleVideos.slice(0, 8).map((video: any, index: number) => ({
      id: `download_${index}`,
      videoId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.duration,
      fileSize: Math.floor(Math.random() * 500) + 100, // 100-600 MB
      downloadedAt: Date.now() - (index * 3600000),
      progress: index < 2 ? Math.random() * 0.8 + 0.2 : 1, // First 2 are downloading
      status: index < 2 ? 'downloading' : 'completed',
      category: video.category,
      quality: ['480p', '720p', '1080p'][Math.floor(Math.random() * 3)] as any,
      localPath: index >= 2 ? `downloads/${video.id}.mp4` : undefined,
    }));

    setDownloads(mockDownloads);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadDownloads();
      setRefreshing(false);
    }, 1000);
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} GB`;
    }
    return `${sizeInMB} MB`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
    }
    return `${minutes}:00`;
  };

  const getTotalSize = () => {
    return downloads
      .filter(item => item.status === 'completed')
      .reduce((total, item) => total + item.fileSize, 0);
  };

  const getFilteredDownloads = () => {
    let filtered = downloads;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(item => 
        filter === 'downloading' 
          ? item.status === 'downloading' || item.status === 'paused'
          : item.status === 'completed'
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'size':
        return filtered.sort((a, b) => b.fileSize - a.fileSize);
      default:
        return filtered.sort((a, b) => b.downloadedAt - a.downloadedAt);
    }
  };

  const pauseDownload = (id: string) => {
    setDownloads(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'paused' as const } : item
    ));
  };

  const resumeDownload = (id: string) => {
    setDownloads(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'downloading' as const } : item
    ));
  };

  const cancelDownload = (id: string) => {
    Alert.alert(
      'Cancel Download',
      'Are you sure you want to cancel this download?',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => {
            setDownloads(prev => prev.filter(item => item.id !== id));
          },
        },
      ]
    );
  };

  const deleteDownload = (id: string) => {
    Alert.alert(
      'Delete Download',
      'This will delete the downloaded video from your device.',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDownloads(prev => prev.filter(item => item.id !== id));
          },
        },
      ]
    );
  };

  const clearCompleted = () => {
    Alert.alert(
      'Clear Completed Downloads',
      'This will remove all completed downloads from your device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setDownloads(prev => prev.filter(item => item.status !== 'completed'));
          },
        },
      ]
    );
  };

  const playVideo = (item: DownloadItem) => {
    if (item.status === 'completed') {
      router.push(`/video/${item.videoId}`);
    }
  };

  const renderProgressBar = (progress: number) => {
    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    );
  };

  const renderDownloadItem = ({ item }: { item: DownloadItem }) => (
    <TouchableOpacity
      style={styles.downloadItem}
      onPress={() => playVideo(item)}
      disabled={item.status !== 'completed'}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <View style={styles.itemMeta}>
          <Text style={styles.metaText}>
            {formatDuration(item.duration)} • {item.quality} • {formatFileSize(item.fileSize)}
          </Text>
        </View>

        {item.status === 'downloading' && (
          <View style={styles.downloadProgress}>
            {renderProgressBar(item.progress)}
            <Text style={styles.progressText}>
              {Math.floor(item.progress * 100)}%
            </Text>
          </View>
        )}

        {item.status === 'paused' && (
          <Text style={styles.pausedText}>Download Paused</Text>
        )}

        {item.status === 'failed' && (
          <Text style={styles.failedText}>Download Failed</Text>
        )}
      </View>

      <View style={styles.itemActions}>
        {item.status === 'downloading' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => pauseDownload(item.id)}
          >
            <Ionicons name="pause" size={20} color="#FF6B35" />
          </TouchableOpacity>
        )}

        {item.status === 'paused' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => resumeDownload(item.id)}
          >
            <Ionicons name="play" size={20} color="#8B5CF6" />
          </TouchableOpacity>
        )}

        {(item.status === 'downloading' || item.status === 'paused') && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => cancelDownload(item.id)}
          >
            <Ionicons name="close" size={20} color="#FF4444" />
          </TouchableOpacity>
        )}

        {item.status === 'completed' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteDownload(item.id)}
          >
            <Ionicons name="trash" size={20} color="#FF4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const filteredDownloads = getFilteredDownloads();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Downloads</Text>
        <TouchableOpacity onPress={clearCompleted}>
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Ionicons name="download" size={20} color="#8B5CF6" />
          <Text style={styles.statText}>
            {downloads.filter(d => d.status === 'completed').length} Downloaded
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="archive" size={20} color="#FF6B35" />
          <Text style={styles.statText}>
            {formatFileSize(getTotalSize())} Used
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time" size={20} color="#999" />
          <Text style={styles.statText}>
            {downloads.filter(d => d.status === 'downloading').length} Active
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'downloading', 'completed'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                filter === f && styles.activeFilterButton,
              ]}
              onPress={() => setFilter(f as any)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === f && styles.activeFilterButtonText,
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            Alert.alert(
              'Sort By',
              'Choose sorting option',
              [
                { text: 'Most Recent', onPress: () => setSortBy('recent') },
                { text: 'Name', onPress: () => setSortBy('name') },
                { text: 'File Size', onPress: () => setSortBy('size') },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
        >
          <Ionicons name="funnel" size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {filteredDownloads.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="download-outline" size={64} color="#666" />
          <Text style={styles.emptyTitle}>No Downloads</Text>
          <Text style={styles.emptySubtitle}>
            Downloaded videos will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredDownloads}
          renderItem={renderDownloadItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8B5CF6"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  clearButton: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statItem: {
    alignItems: 'center',
  },
  statText: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#8B5CF6',
  },
  filterButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  sortButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  content: {
    padding: 16,
  },
  downloadItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 12,
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#333',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemMeta: {
    marginBottom: 8,
  },
  metaText: {
    color: '#999',
    fontSize: 12,
  },
  downloadProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  progressBar: {
    flex: 1,
    marginRight: 8,
  },
  progressText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 30,
  },
  pausedText: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '600',
  },
  failedText: {
    color: '#FF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
