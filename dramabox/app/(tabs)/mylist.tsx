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

interface MyListItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  category: string;
  genre?: string;
  addedAt: number;
  isLocked: boolean;
  rating: number;
  duration: string;
}

export default function MyListScreen() {
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'added' | 'title' | 'rating'>('added');

  useEffect(() => {
    loadMyList();
  }, []);

  const loadMyList = () => {
    // Mock my list data based on available videos
    const mockMyList: MyListItem[] = sampleVideos.slice(0, 10).map((video: any, index: number) => ({
      id: `mylist_${index}`,
      videoId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      category: video.category,
      genre: video.genre,
      addedAt: Date.now() - (index * 24 * 60 * 60 * 1000), // Different days
      isLocked: video.isLocked || false,
      rating: 4.2 + Math.random() * 0.8,
      duration: video.duration || '45 min',
    }));
    setMyList(mockMyList);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadMyList();
      setRefreshing(false);
    }, 1000);
  };

  const removeFromList = (itemId: string) => {
    Alert.alert(
      'Remove from My List',
      'Are you sure you want to remove this from your list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setMyList(myList.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const sortedList = [...myList].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'rating':
        return b.rating - a.rating;
      case 'added':
      default:
        return b.addedAt - a.addedAt;
    }
  });

  const renderListItem = ({ item }: { item: MyListItem }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => router.push(`/video/${item.videoId}`)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.listThumbnail} />
      <View style={styles.listInfo}>
        <Text style={styles.listTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.listMeta}>
          <Text style={styles.metaText}>{item.category}</Text>
          {item.genre && (
            <>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>{item.genre}</Text>
            </>
          )}
        </View>
        <View style={styles.listStats}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.duration}>{item.duration}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromList(item.id)}
      >
        <Ionicons name="close" size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item }: { item: MyListItem }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => router.push(`/video/${item.videoId}`)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.gridThumbnail} />
      <TouchableOpacity
        style={styles.gridRemoveButton}
        onPress={() => removeFromList(item.id)}
      >
        <Ionicons name="close" size={16} color="#fff" />
      </TouchableOpacity>
      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.gridStats}>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.gridRatingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My List</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setSortBy(sortBy === 'added' ? 'title' : sortBy === 'title' ? 'rating' : 'added')}
          >
            <Ionicons name="funnel" size={20} color="#8B5CF6" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            <Ionicons
              name={viewMode === 'list' ? 'grid' : 'list'}
              size={20}
              color="#8B5CF6"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sortInfo}>
        <Text style={styles.sortText}>
          Sorted by: {sortBy === 'added' ? 'Recently Added' : sortBy === 'title' ? 'Title' : 'Rating'}
        </Text>
        <Text style={styles.countText}>{myList.length} items</Text>
      </View>

      {myList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={64} color="#666" />
          <Text style={styles.emptyTitle}>Your list is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add videos to your list to watch them later
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Text style={styles.browseButtonText}>Browse Videos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sortedList}
          renderItem={viewMode === 'list' ? renderListItem : renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Forces re-render when view mode changes
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  sortInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111',
  },
  sortText: {
    color: '#999',
    fontSize: 14,
  },
  countText: {
    color: '#999',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  // List View Styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  listThumbnail: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    color: '#999',
    fontSize: 12,
    marginRight: 8,
  },
  listStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  duration: {
    color: '#999',
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
  },
  // Grid View Styles
  gridItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#111',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridThumbnail: {
    width: '100%',
    height: 120,
  },
  gridRemoveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  gridInfo: {
    padding: 12,
  },
  gridTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  gridStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridRatingText: {
    color: '#fff',
    fontSize: 11,
    marginLeft: 4,
  },
  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
