import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Modal,
  Switch,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sampleVideos, genres, languages } from '../../data/videos';

const { width } = Dimensions.get('window');

interface FilterState {
  genre: string;
  language: string;
  sortBy: 'newest' | 'popular' | 'rating' | 'az';
  showLocked: boolean;
  showCompleted: boolean;
  showFavorites: boolean;
  ratingFilter: number;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
}

export default function ExploreScreen() {
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState(['Drama', 'Romance', 'K-Drama', 'Action', 'Comedy']);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    genre: 'All',
    language: 'All',
    sortBy: 'newest',
    showLocked: true,
    showCompleted: true,
    showFavorites: false,
    ratingFilter: 0,
    dateRange: 'all',
  });

  const router = useRouter();

  // Search suggestions based on current input
  const searchSuggestions = sampleVideos
    .filter(video => 
      video.title.toLowerCase().includes(searchText.toLowerCase()) ||
      video.subtitle.toLowerCase().includes(searchText.toLowerCase()) ||
      video.genre.toLowerCase().includes(searchText.toLowerCase())
    )
    .slice(0, 5)
    .map(video => video.title);

  // Advanced filtering logic
  const filteredVideos = sampleVideos.filter(video => {
    const matchesSearch = !searchText || 
      video.title.toLowerCase().includes(searchText.toLowerCase()) ||
      video.subtitle.toLowerCase().includes(searchText.toLowerCase()) ||
      video.description.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesGenre = filters.genre === 'All' || video.genre === filters.genre;
    const matchesLanguage = filters.language === 'All' || video.language === filters.language;
    const matchesRating = video.rating >= filters.ratingFilter;
    const matchesLocked = filters.showLocked || !video.isLocked;
    const matchesFavorites = !filters.showFavorites || video.isFavorite;
    
    // Date range filtering
    let matchesDate = true;
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const releaseDate = new Date(video.releaseDate);
      const daysDiff = Math.floor((now.getTime() - releaseDate.getTime()) / (1000 * 3600 * 24));
      
      switch (filters.dateRange) {
        case 'today':
          matchesDate = daysDiff === 0;
          break;
        case 'week':
          matchesDate = daysDiff <= 7;
          break;
        case 'month':
          matchesDate = daysDiff <= 30;
          break;
        case 'year':
          matchesDate = daysDiff <= 365;
          break;
      }
    }

    return matchesSearch && matchesGenre && matchesLanguage && matchesRating && 
           matchesLocked && matchesFavorites && matchesDate;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      case 'popular':
        return b.views - a.views;
      case 'rating':
        return b.rating - a.rating;
      case 'az':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      setShowSearchSuggestions(true);
    } else {
      setShowSearchSuggestions(false);
    }
  };

  const performSearch = (query: string) => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches([query.trim(), ...recentSearches.slice(0, 9)]);
    }
    setSearchText(query);
    setShowSearchSuggestions(false);
  };

  const clearRecentSearches = () => {
    Alert.alert(
      'Clear Search History',
      'Are you sure you want to clear all recent searches?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => setRecentSearches([]) }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const resetFilters = () => {
    setFilters({
      genre: 'All',
      language: 'All',
      sortBy: 'newest',
      showLocked: true,
      showCompleted: true,
      showFavorites: false,
      ratingFilter: 0,
      dateRange: 'all',
    });
  };

  const renderVideoItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={viewMode === 'grid' ? styles.gridVideoItem : styles.videoItem}
      onPress={() => router.push(`/video/${item.id}`)}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: item.thumbnail }} 
          style={viewMode === 'grid' ? styles.gridVideoThumbnail : styles.videoThumbnail} 
        />
        {item.isLocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={16} color="white" />
          </View>
        )}
        {item.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {viewMode === 'list' && (
          <>
            <Text style={styles.videoSubtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
            <Text style={styles.videoGenre}>{item.genre} • {item.language}</Text>
            <View style={styles.videoMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="heart" size={12} color="#FF3B30" />
                <Text style={styles.metaText}>{item.likes}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="eye" size={12} color="#999" />
                <Text style={styles.metaText}>{item.views}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="play" size={12} color="#999" />
                <Text style={styles.metaText}>{item.totalEpisodes} eps</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSearchSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => performSearch(item)}
    >
      <Ionicons name="search" size={16} color="#999" />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderGenreItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.genreChip,
        filters.genre === item && styles.genreChipActive
      ]}
      onPress={() => setFilters(prev => ({ ...prev, genre: item }))}
    >
      <Text style={[
        styles.genreChipText,
        filters.genre === item && styles.genreChipTextActive
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const FilterModal = () => (
    <Modal visible={showFilters} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.fullScreenModal}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filters</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

          <ScrollView style={styles.filterContent}>
            {/* Sort By */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.sortOptions}>
                {[
                  { key: 'newest', label: 'Newest' },
                  { key: 'popular', label: 'Most Popular' },
                  { key: 'rating', label: 'Highest Rated' },
                  { key: 'az', label: 'A-Z' },
                ].map(option => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.sortOption,
                      filters.sortBy === option.key && styles.sortOptionActive
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, sortBy: option.key as any }))}
                  >
                    <Text style={[
                      styles.sortOptionText,
                      filters.sortBy === option.key && styles.sortOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Language Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Language</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.languageOptions}>
                  {languages.map(lang => (
                    <TouchableOpacity
                      key={lang}
                      style={[
                        styles.languageChip,
                        filters.language === lang && styles.languageChipActive
                      ]}
                      onPress={() => setFilters(prev => ({ ...prev, language: lang }))}
                    >
                      <Text style={[
                        styles.languageChipText,
                        filters.language === lang && styles.languageChipTextActive
                      ]}>
                        {lang}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
              <View style={styles.ratingFilter}>
                {[0, 1, 2, 3, 4, 5].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingOption,
                      filters.ratingFilter === rating && styles.ratingOptionActive
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, ratingFilter: rating }))}
                  >
                    <Text style={styles.ratingOptionText}>
                      {rating === 0 ? 'All' : `${rating}+`}
                    </Text>
                    {rating > 0 && <Ionicons name="star" size={12} color="#FFD700" />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Toggle Filters */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Show Content</Text>
              <View style={styles.toggleOptions}>
                <View style={styles.toggleOption}>
                  <Text style={styles.toggleText}>Locked Content</Text>
                  <Switch
                    value={filters.showLocked}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, showLocked: value }))}
                    trackColor={{ false: '#333', true: '#8B5CF6' }}
                    thumbColor={filters.showLocked ? '#fff' : '#f4f3f4'}
                  />
                </View>
                <View style={styles.toggleOption}>
                  <Text style={styles.toggleText}>Only Favorites</Text>
                  <Switch
                    value={filters.showFavorites}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, showFavorites: value }))}
                    trackColor={{ false: '#333', true: '#8B5CF6' }}
                    thumbColor={filters.showFavorites ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>
            </View>

            {/* Date Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Release Date</Text>
              <View style={styles.dateRangeOptions}>
                {[
                  { key: 'all', label: 'All Time' },
                  { key: 'today', label: 'Today' },
                  { key: 'week', label: 'This Week' },
                  { key: 'month', label: 'This Month' },
                  { key: 'year', label: 'This Year' },
                ].map(option => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.dateRangeOption,
                      filters.dateRange === option.key && styles.dateRangeOptionActive
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, dateRange: option.key as any }))}
                  >
                    <Text style={[
                      styles.dateRangeOptionText,
                      filters.dateRange === option.key && styles.dateRangeOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.viewModeButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Ionicons 
              name={viewMode === 'grid' ? 'list' : 'grid'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search videos, genres, actors..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={handleSearch}
            onFocus={() => setShowSearchSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <MaterialIcons name="tune" size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>

        {/* Search Suggestions */}
        {showSearchSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
          <View style={styles.suggestionsContainer}>
            {searchSuggestions.length > 0 && (
              <FlatList
                data={searchSuggestions}
                renderItem={renderSearchSuggestion}
                keyExtractor={(item, index) => `suggestion-${index}`}
                style={styles.suggestionsList}
              />
            )}
            
            {recentSearches.length > 0 && (
              <View style={styles.recentSearches}>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentItem}
                    onPress={() => performSearch(search)}
                  >
                    <Ionicons name="time" size={14} color="#999" />
                    <Text style={styles.recentText}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {trendingSearches.length > 0 && (
              <View style={styles.trendingSearches}>
                <Text style={styles.trendingTitle}>Trending</Text>
                <View style={styles.trendingTags}>
                  {trendingSearches.map((trend, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.trendingTag}
                      onPress={() => performSearch(trend)}
                    >
                      <Text style={styles.trendingTagText}>{trend}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Genre Filter */}
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

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredVideos.length} videos found
        </Text>
        <Text style={styles.sortText}>
          Sorted by: {filters.sortBy.charAt(0).toUpperCase() + filters.sortBy.slice(1)}
        </Text>
      </View>

      {/* Videos List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVideos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.videosList}
          showsVerticalScrollIndicator={false}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when view mode changes
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="film-outline" size={64} color="#333" />
              <Text style={styles.emptyTitle}>No videos found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your filters or search terms
              </Text>
            </View>
          }
        />
      )}

      <FilterModal />
    </SafeAreaView>
  );
}const styles = StyleSheet.create({
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
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewModeButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    position: 'relative',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  filterButton: {
    marginLeft: 10,
    padding: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    maxHeight: 300,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  suggestionsList: {
    maxHeight: 120,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  suggestionText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
  },
  recentSearches: {
    padding: 15,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  clearText: {
    color: '#8B5CF6',
    fontSize: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  recentText: {
    color: '#999',
    fontSize: 14,
    marginLeft: 8,
  },
  trendingSearches: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  trendingTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  trendingTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  trendingTag: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  trendingTagText: {
    color: '#8B5CF6',
    fontSize: 12,
  },
  genreContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  genreList: {
    paddingRight: 20,
  },
  genreChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 15,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  genreChipActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  genreChipText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
  },
  genreChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  resultsText: {
    color: '#999',
    fontSize: 14,
  },
  sortText: {
    color: '#8B5CF6',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  videosList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  videoItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    overflow: 'hidden',
  },
  gridVideoItem: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  videoThumbnail: {
    width: 120,
    height: 90,
    resizeMode: 'cover',
  },
  gridVideoThumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  lockOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 4,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2,
  },
  videoInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  videoTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  videoSubtitle: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  videoGenre: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  metaText: {
    color: '#999',
    fontSize: 11,
    marginLeft: 4,
  },
  // Filter Modal Styles
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterSectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  sortOptionActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  sortOptionText: {
    color: '#999',
    fontSize: 12,
  },
  sortOptionTextActive: {
    color: 'white',
  },
  languageOptions: {
    flexDirection: 'row',
  },
  languageChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: '#333',
  },
  languageChipActive: {
    backgroundColor: '#8B5CF6',
  },
  languageChipText: {
    color: '#999',
    fontSize: 12,
  },
  languageChipTextActive: {
    color: 'white',
  },
  ratingFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  ratingOptionActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  ratingOptionText: {
    color: '#999',
    fontSize: 12,
    marginRight: 4,
  },
  toggleOptions: {
    marginTop: 10,
  },
  toggleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  toggleText: {
    color: 'white',
    fontSize: 14,
  },
  dateRangeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateRangeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  dateRangeOptionActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  dateRangeOptionText: {
    color: '#999',
    fontSize: 12,
  },
  dateRangeOptionTextActive: {
    color: 'white',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    marginRight: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
