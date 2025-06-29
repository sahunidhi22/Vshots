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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { sampleVideos } from '../../data/videos';

const { width } = Dimensions.get('window');

interface WatchHistoryItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  duration: number;
  watchedAt: number;
  progress: number; // 0-1
  category: string;
  genre?: string;
  watchTime: number; // seconds watched
}

export default function HistoryScreen() {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    loadWatchHistory();
  }, []);

  const loadWatchHistory = () => {
    // Mock watch history data based on available videos
    const mockHistory: WatchHistoryItem[] = sampleVideos.slice(0, 15).map((video: any, index: number) => ({
      id: `history_${index}`,
      videoId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.duration,
      watchedAt: Date.now() - (index * 3600000), // Spread over hours
      progress: Math.random() * 0.8 + 0.1, // 10-90% watched
      category: video.category,
      genre: video.genre,
      watchTime: Math.floor(video.duration * (Math.random() * 0.8 + 0.1)),
    }));

    setWatchHistory(mockHistory);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadWatchHistory();
      setRefreshing(false);
    }, 1000);
  };

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Recently';
    }
  };

  const getFilteredHistory = () => {
    const now = Date.now();
    let cutoff = 0;

    switch (filterPeriod) {
      case 'today':
        cutoff = now - (24 * 60 * 60 * 1000);
        break;
      case 'week':
        cutoff = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoff = now - (30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return watchHistory;
    }

    return watchHistory.filter(item => item.watchedAt >= cutoff);
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear Watch History',
      'Are you sure you want to clear your entire watch history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setWatchHistory([]);
            Alert.alert('Success', 'Watch history cleared');
          },
        },
      ]
    );
  };

  const removeFromHistory = (itemId: string) => {
    setWatchHistory(prev => prev.filter(item => item.id !== itemId));
  };

  const playVideo = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  const renderListItem = ({ item }: { item: WatchHistoryItem }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => playVideo(item.videoId)}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${item.progress * 100}%` }]} />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatWatchTime(item.duration)}</Text>
        </View>
      </View>
      
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemTime}>
          Watched {formatWatchTime(item.watchTime)} • {formatTimeAgo(item.watchedAt)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromHistory(item.id)}
      >
        <Ionicons name="close" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item }: { item: WatchHistoryItem }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => playVideo(item.videoId)}
    >
      <View style={styles.gridThumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.gridThumbnail} />
        <View style={styles.gridProgressContainer}>
          <View style={[styles.progressBar, { width: `${item.progress * 100}%` }]} />
        </View>
        <View style={styles.gridDurationBadge}>
          <Text style={styles.durationText}>{formatWatchTime(item.duration)}</Text>
        </View>
        <TouchableOpacity
          style={styles.gridRemoveButton}
          onPress={() => removeFromHistory(item.id)}
        >
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.gridItemTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.gridItemTime}>
        {formatTimeAgo(item.watchedAt)}
      </Text>
    </TouchableOpacity>
  );

  const filteredHistory = getFilteredHistory();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Watch History</Text>
        <TouchableOpacity onPress={clearHistory}>
          <Ionicons name="trash-outline" size={24} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'today', 'week', 'month'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.filterButton,
                filterPeriod === period && styles.activeFilterButton,
              ]}
              onPress={() => setFilterPeriod(period as any)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterPeriod === period && styles.activeFilterButtonText,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'list' && styles.activeViewButton]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons 
              name="list" 
              size={20} 
              color={viewMode === 'list' ? '#8B5CF6' : '#666'} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewButton, viewMode === 'grid' && styles.activeViewButton]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons 
              name="grid" 
              size={20} 
              color={viewMode === 'grid' ? '#8B5CF6' : '#666'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {filteredHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color="#666" />
          <Text style={styles.emptyTitle}>No Watch History</Text>
          <Text style={styles.emptySubtitle}>
            {filterPeriod === 'all' 
              ? 'Start watching videos to see your history here'
              : `No videos watched ${filterPeriod === 'today' ? 'today' : `this ${filterPeriod}`}`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={viewMode === 'list' ? renderListItem : renderGridItem}
          keyExtractor={(item) => item.id}
          key={viewMode} // Force re-render on view mode change
          numColumns={viewMode === 'grid' ? 2 : 1}
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

      {/* Stats */}
      {filteredHistory.length > 0 && (
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            {filteredHistory.length} video{filteredHistory.length !== 1 ? 's' : ''} • 
            Total: {formatWatchTime(filteredHistory.reduce((acc, item) => acc + item.watchTime, 0))}
          </Text>
        </View>
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
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeViewButton: {
    backgroundColor: '#444',
  },
  content: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 12,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 12,
  },
  thumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: '#333',
    borderRadius: 1.5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 1.5,
  },
  durationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCategory: {
    color: '#8B5CF6',
    fontSize: 14,
    marginBottom: 4,
  },
  itemTime: {
    color: '#999',
    fontSize: 12,
  },
  removeButton: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  gridThumbnailContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  gridThumbnail: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  gridProgressContainer: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: '#333',
    borderRadius: 1,
  },
  gridDurationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  gridRemoveButton: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridItemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  gridItemTime: {
    color: '#999',
    fontSize: 12,
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
  stats: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  statsText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
});
