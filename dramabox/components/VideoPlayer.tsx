import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
  ScrollView,
  Animated,
  PanResponder,
  Share,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    description: string;
    duration: number;
    category: string;
    thumbnail: string;
    videoUrl: string;
    likes: number;
    views: number;
    genre?: string;
    episode?: number;
    totalEpisodes?: number;
    isLocked?: boolean;
    isPremium?: boolean;
  };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showEpisodesModal, setShowEpisodesModal] = useState(false);
  const [showWatchPartyModal, setShowWatchPartyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [heartAnimation] = useState(new Animated.Value(0));
  const [comments, setComments] = useState([
    { id: '1', user: 'Sarah Kim', text: 'This is amazing! 😍', time: '2 min ago', likes: 12 },
    { id: '2', user: 'John Lee', text: 'Love this series!', time: '5 min ago', likes: 8 },
    { id: '3', user: 'Maria Garcia', text: 'Can\'t wait for the next episode!', time: '10 min ago', likes: 15 },
  ]);
  const [newComment, setNewComment] = useState('');
  const videoRef = useRef<Video>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showControls) {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [showControls]);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleScreenPress = () => {
    setShowControls(!showControls);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Animate Korean heart
    Animated.sequence([
      Animated.timing(heartAnimation, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(heartAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this video: ${video.title}`,
        url: `vshots://video/${video.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderEpisodesModal = () => (
    <Modal
      visible={showEpisodesModal}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => setShowEpisodesModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Episodes</Text>
          <TouchableOpacity onPress={() => setShowEpisodesModal(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.episodesList}>
          {Array.from({ length: video.totalEpisodes || 12 }, (_, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.episodeItem,
                (video.episode || 1) === i + 1 && styles.currentEpisode,
              ]}
            >
              <Text style={styles.episodeNumber}>Episode {i + 1}</Text>
              <Text style={styles.episodeTitle}>
                {video.title} - Part {i + 1}
              </Text>
              {i + 1 > (video.episode || 1) && (
                <Ionicons name="lock-closed" size={16} color="#666" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderWatchPartyModal = () => (
    <Modal
      visible={showWatchPartyModal}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => setShowWatchPartyModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Watch Party</Text>
          <TouchableOpacity onPress={() => setShowWatchPartyModal(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.watchPartyContent}>
          <Ionicons name="people" size={48} color="#666" />
          <Text style={styles.watchPartyTitle}>Create Watch Party</Text>
          <Text style={styles.watchPartySubtitle}>
            Watch together with friends in real-time
          </Text>
          <TouchableOpacity style={styles.createPartyButton}>
            <Text style={styles.createPartyButtonText}>Create Party</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderMoreModal = () => (
    <Modal
      visible={showMoreModal}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => setShowMoreModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>More Options</Text>
          <TouchableOpacity onPress={() => setShowMoreModal(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.moreOptions}>
          <TouchableOpacity style={styles.moreOption}>
            <Ionicons name="download-outline" size={24} color="#fff" />
            <Text style={styles.moreOptionText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreOption}>
            <Ionicons name="bookmark-outline" size={24} color="#fff" />
            <Text style={styles.moreOptionText}>Add to Watchlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreOption}>
            <Ionicons name="flag-outline" size={24} color="#fff" />
            <Text style={styles.moreOptionText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreOption}>
            <Ionicons name="information-circle-outline" size={24} color="#fff" />
            <Text style={styles.moreOptionText}>Video Info</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        user: 'You',
        text: newComment.trim(),
        time: 'now',
        likes: 0,
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const renderCommentsModal = () => (
    <Modal
      visible={showCommentsModal}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => setShowCommentsModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Comments ({comments.length})</Text>
          <TouchableOpacity onPress={() => setShowCommentsModal(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <KeyboardAvoidingView 
          style={styles.commentsContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.commentsList}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{comment.user}</Text>
                  <Text style={styles.commentTime}>{comment.time}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity style={styles.commentAction}>
                    <Ionicons name="heart-outline" size={16} color="#999" />
                    <Text style={styles.commentActionText}>{comment.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.commentAction}>
                    <Ionicons name="chatbubble-outline" size={16} color="#999" />
                    <Text style={styles.commentActionText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#666"
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, { opacity: newComment.trim() ? 1 : 0.5 }]}
              onPress={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Ionicons name="send" size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={handleScreenPress}
        activeOpacity={1}
      >
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: video.videoUrl }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isPlaying}
          isLooping
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) {
              setCurrentTime(status.positionMillis / 1000);
              if (status.durationMillis) {
                setDuration(status.durationMillis / 1000);
              }
            }
          }}
        />

        {/* Controls Overlay */}
        {showControls && (
          <View style={styles.controlsOverlay}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={togglePlayPause}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={48}
                color="#fff"
              />
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progress,
                    { width: `${(currentTime / duration) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Side Controls */}
      <View style={styles.sideControls}>
        <TouchableOpacity style={styles.sideButton} onPress={handleLike}>
          <Animated.View
            style={[
              styles.heartContainer,
              { transform: [{ scale: heartAnimation }] },
            ]}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={isLiked ? '#FF6B6B' : '#fff'}
            />
          </Animated.View>
          <Text style={styles.sideButtonText}>
            {(video.likes + (isLiked ? 1 : 0)).toLocaleString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={28} color="#fff" />
          <Text style={styles.sideButtonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton} onPress={() => setShowCommentsModal(true)}>
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
          <Text style={styles.sideButtonText}>{comments.length}</Text>
        </TouchableOpacity>

        {video.totalEpisodes && (
          <TouchableOpacity
            style={styles.sideButton}
            onPress={() => setShowEpisodesModal(true)}
          >
            <Ionicons name="list-outline" size={28} color="#fff" />
            <Text style={styles.sideButtonText}>
              {video.episode || 1}/{video.totalEpisodes}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => setShowWatchPartyModal(true)}
        >
          <Ionicons name="people-outline" size={28} color="#fff" />
          <Text style={styles.sideButtonText}>Party</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => setShowMoreModal(true)}
        >
          <Ionicons name="ellipsis-horizontal" size={28} color="#fff" />
          <Text style={styles.sideButtonText}>More</Text>
        </TouchableOpacity>
      </View>

      {/* Video Info */}
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        <Text style={styles.videoDescription} numberOfLines={3}>
          {video.description}
        </Text>
        <View style={styles.videoMeta}>
          <Text style={styles.metaText}>
            {video.views.toLocaleString()} views
          </Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{video.category}</Text>
          {video.genre && (
            <>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>{video.genre}</Text>
            </>
          )}
        </View>
      </View>

      {/* Modals */}
      {renderEpisodesModal()}
      {renderWatchPartyModal()}
      {renderMoreModal()}
      {renderCommentsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
  },
  playPauseButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
    padding: 16,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  sideControls: {
    position: 'absolute',
    right: 16,
    top: height * 0.4,
    alignItems: 'center',
  },
  sideButton: {
    alignItems: 'center',
    marginVertical: 16,
  },
  heartContainer: {
    marginBottom: 4,
  },
  sideButtonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 80,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  videoDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#999',
    fontSize: 12,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  episodesList: {
    flex: 1,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  currentEpisode: {
    backgroundColor: '#8B5CF6',
  },
  episodeNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  episodeTitle: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  watchPartyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  watchPartyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  watchPartySubtitle: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  createPartyButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createPartyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  moreOptions: {
    flex: 1,
  },
  moreOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  moreOptionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 16,
  },
  // Comments Modal Styles
  commentsContainer: {
    flex: 1,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentUser: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    color: '#999',
    fontSize: 12,
  },
  commentText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  commentActionText: {
    color: '#999',
    fontSize: 12,
    marginLeft: 4,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#111',
  },
  commentInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});
