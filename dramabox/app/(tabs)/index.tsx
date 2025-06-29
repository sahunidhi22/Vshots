import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sampleVideos, categories, topCategories, genres } from '../../data/videos';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('whatsNew');
  const [searchText, setSearchText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const router = useRouter();

  const filteredVideos = sampleVideos.filter(video => {
    if (activeCategory === 'whatsNew') {
      return video.isNew;
    } else if (activeCategory === 'favourite') {
      return video.isFavorite;
    } else if (activeCategory === 'genre') {
      return selectedGenre === 'All' || video.genre === selectedGenre;
    } else if (activeCategory === 'watchHistory') {
      // Show recently watched videos (mock data for now)
      return video.isNew || video.isFavorite; // Show some videos as "watched"
    } else if (activeCategory === 'myList') {
      // Show videos in user's list (mock data for now)
      return video.isFavorite; // Show favorite videos as "in list"
    }
    return true;
  });

  const renderVideoItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.videoItem}
      onPress={() => router.push(`/video/${item.id}`)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
      <View style={styles.playButton}>
        <Ionicons name="play" size={24} color="white" />
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderTopCategory = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.topCategoryItem}>
      <Image source={{ uri: item.image }} style={styles.topCategoryImage} />
      <Text style={styles.topCategoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderCategoryTab = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        activeCategory === item.id && styles.categoryTabActive
      ]}
      onPress={() => {
        if (item.id === 'watchHistory') {
          // Navigate to history tab
          router.navigate('/(tabs)/history' as any);
        } else if (item.id === 'myList') {
          // Navigate to mylist tab
          router.navigate('/(tabs)/mylist' as any);
        } else {
          setActiveCategory(item.id);
        }
      }}
    >
      <Text style={[
        styles.categoryTabText,
        activeCategory === item.id && styles.categoryTabTextActive
      ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderGenreItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.genreItem,
        selectedGenre === item && styles.genreItemActive
      ]}
      onPress={() => setSelectedGenre(item)}
    >
      <Text style={[
        styles.genreText,
        selectedGenre === item && styles.genreTextActive
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.logo}>
          <Text style={styles.logoText}>Vshots</Text>
        </View>
        
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Top Categories */}
      <View style={styles.topCategoriesContainer}>
        <FlatList
          data={topCategories}
          renderItem={renderTopCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topCategoriesList}
        />
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        <FlatList
          data={categories}
          renderItem={renderCategoryTab}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsList}
        />
      </View>

      {/* Genre Filter (only show when Genre tab is active) */}
      {activeCategory === 'genre' && (
        <View style={styles.genreContainer}>
          <FlatList
            data={genres}
            renderItem={renderGenreItem}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genreList}
          />
        </View>
      )}

      {/* Videos Grid */}
      <FlatList
        data={filteredVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.videosList}
        showsVerticalScrollIndicator={false}
      />
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000',
  },
  logo: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  logoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topCategoriesContainer: {
    paddingVertical: 20,
  },
  topCategoriesList: {
    paddingHorizontal: 20,
  },
  topCategoryItem: {
    alignItems: 'center',
    marginRight: 40,
  },
  topCategoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  topCategoryTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTabs: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryTabsList: {
    paddingHorizontal: 0,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  categoryTabActive: {
    backgroundColor: '#FF6B35',
  },
  categoryTabText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  genreContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  genreList: {
    paddingRight: 20,
  },
  genreItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 15,
    backgroundColor: '#1a1a1a',
  },
  genreItemActive: {
    backgroundColor: '#8B5CF6',
  },
  genreText: {
    color: '#999',
    fontSize: 12,
  },
  genreTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  videosList: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  videoItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 10,
  },
  videoTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
