import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { rewards } from '../data/videos';

const { width } = Dimensions.get('window');

interface DailyCheckIn {
  day: number;
  coins: number;
  bonus: boolean;
  claimed: boolean;
  date?: string;
}

interface UserRewards {
  totalCoins: number;
  dailyStreak: number;
  lastCheckIn: string | null;
  totalAdsWatched: number;
  dailyAdsWatched: number;
  checkInHistory: DailyCheckIn[];
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  unlocked: boolean;
  progress: number;
  target: number;
  category: 'daily' | 'watching' | 'social' | 'spending';
}

export default function RewardsScreen() {
  const router = useRouter();
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [coinAnimation] = useState(new Animated.Value(0));
  const [selectedTab, setSelectedTab] = useState<'checkin' | 'achievements' | 'history'>('checkin');
  
  const [userRewards, setUserRewards] = useState<UserRewards>({
    totalCoins: 1250,
    dailyStreak: 5,
    lastCheckIn: '2024-06-27', // Yesterday
    totalAdsWatched: 45,
    dailyAdsWatched: 2,
    checkInHistory: rewards.dailyCheckIn.map((day, index) => ({
      ...day,
      claimed: index < 5, // First 5 days claimed
      date: index < 5 ? `2024-06-${23 + index}` : undefined,
    })),
    achievements: [
      {
        id: 'first_checkin',
        title: 'First Check-in',
        description: 'Complete your first daily check-in',
        icon: 'calendar',
        reward: 50,
        unlocked: true,
        progress: 1,
        target: 1,
        category: 'daily',
      },
      {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Check in for 7 consecutive days',
        icon: 'flame',
        reward: 100,
        unlocked: false,
        progress: 5,
        target: 7,
        category: 'daily',
      },
      {
        id: 'watch_10_ads',
        title: 'Ad Watcher',
        description: 'Watch 10 ads to earn coins',
        icon: 'tv',
        reward: 75,
        unlocked: false,
        progress: 8,
        target: 10,
        category: 'watching',
      },
      {
        id: 'spend_1000_coins',
        title: 'Big Spender',
        description: 'Spend 1000 coins on content',
        icon: 'card',
        reward: 200,
        unlocked: false,
        progress: 650,
        target: 1000,
        category: 'spending',
      },
      {
        id: 'share_video',
        title: 'Social Butterfly',
        description: 'Share your first video',
        icon: 'share',
        reward: 25,
        unlocked: false,
        progress: 0,
        target: 1,
        category: 'social',
      },
    ],
  });

  const canCheckInToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return userRewards.lastCheckIn !== today;
  };

  const getCurrentCheckInDay = () => {
    if (!canCheckInToday()) return null;
    
    const lastCheckIn = new Date(userRewards.lastCheckIn || '2024-01-01');
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastCheckIn.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      return Math.min(userRewards.dailyStreak + 1, 7);
    } else if (daysDiff > 1) {
      // Streak broken, start over
      return 1;
    }
    return null;
  };

  const handleCheckIn = () => {
    const checkInDay = getCurrentCheckInDay();
    if (!checkInDay) return;

    const todayReward = rewards.dailyCheckIn[checkInDay - 1];
    const today = new Date().toISOString().split('T')[0];

    // Animate coins
    Animated.sequence([
      Animated.timing(coinAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(coinAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Update user rewards
    setUserRewards(prev => ({
      ...prev,
      totalCoins: prev.totalCoins + todayReward.coins,
      dailyStreak: checkInDay,
      lastCheckIn: today,
      checkInHistory: prev.checkInHistory.map((day, index) => 
        index === checkInDay - 1 
          ? { ...day, claimed: true, date: today }
          : day
      ),
    }));

    Alert.alert(
      'Check-in Successful!',
      `You earned ${todayReward.coins} coins! ${todayReward.bonus ? '🎉 Bonus day!' : ''}`,
      [{ text: 'Awesome!', onPress: () => setShowCheckInModal(false) }]
    );
  };

  const watchAdForCoins = () => {
    if (userRewards.dailyAdsWatched >= 10) {
      Alert.alert('Daily Limit Reached', 'You have watched the maximum number of ads today. Come back tomorrow!');
      return;
    }

    Alert.alert(
      'Watch Ad',
      'Watch a short ad to earn 9 coins?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Watch Ad',
          onPress: () => {
            // Simulate ad watching
            setTimeout(() => {
              setUserRewards(prev => ({
                ...prev,
                totalCoins: prev.totalCoins + 9,
                dailyAdsWatched: prev.dailyAdsWatched + 1,
                totalAdsWatched: prev.totalAdsWatched + 1,
              }));
              Alert.alert('Reward Earned!', 'You earned 9 coins for watching the ad!');
            }, 2000);
          },
        },
      ]
    );
  };

  const renderCheckInCalendar = () => (
    <View style={styles.checkInCalendar}>
      <Text style={styles.sectionTitle}>Daily Check-in</Text>
      <Text style={styles.streakText}>Current Streak: {userRewards.dailyStreak} days</Text>
      
      <View style={styles.calendarGrid}>
        {userRewards.checkInHistory.map((day, index) => (
          <View key={day.day} style={styles.calendarDay}>
            <View style={[
              styles.dayContainer,
              day.claimed && styles.dayContainerClaimed,
              day.bonus && styles.dayContainerBonus,
              getCurrentCheckInDay() === day.day && styles.dayContainerToday,
            ]}>
              <Text style={[
                styles.dayNumber,
                day.claimed && styles.dayNumberClaimed,
              ]}>
                {day.day}
              </Text>
              {day.bonus && (
                <View style={styles.bonusBadge}>
                  <Text style={styles.bonusText}>BONUS</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.dayCoins,
              day.claimed && styles.dayCoinsActive,
            ]}>
              {day.coins} coins
            </Text>
            {day.claimed && (
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            )}
          </View>
        ))}
      </View>

      {canCheckInToday() && (
        <TouchableOpacity 
          style={styles.checkInButton}
          onPress={handleCheckIn}
        >
          <Ionicons name="gift" size={20} color="white" />
          <Text style={styles.checkInButtonText}>Check In Today</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsContainer}>
      <Text style={styles.sectionTitle}>Achievements</Text>
      
      {userRewards.achievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementItem}>
          <View style={[
            styles.achievementIcon,
            achievement.unlocked && styles.achievementIconUnlocked,
          ]}>
            <Ionicons 
              name={achievement.icon as any} 
              size={24} 
              color={achievement.unlocked ? '#FFD700' : '#666'} 
            />
          </View>
          
          <View style={styles.achievementContent}>
            <View style={styles.achievementHeader}>
              <Text style={[
                styles.achievementTitle,
                achievement.unlocked && styles.achievementTitleUnlocked,
              ]}>
                {achievement.title}
              </Text>
              <Text style={styles.achievementReward}>+{achievement.reward} coins</Text>
            </View>
            
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill,
                  { width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }
                ]} />
              </View>
              <Text style={styles.progressText}>
                {achievement.progress}/{achievement.target}
              </Text>
            </View>
          </View>
          
          {achievement.unlocked && (
            <View style={styles.unlockedBadge}>
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderHistory = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.sectionTitle}>Rewards History</Text>
      
      <View style={styles.historyStats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userRewards.totalCoins}</Text>
          <Text style={styles.statLabel}>Total Coins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userRewards.totalAdsWatched}</Text>
          <Text style={styles.statLabel}>Ads Watched</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userRewards.dailyStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>

      <View style={styles.historyList}>
        {userRewards.checkInHistory
          .filter(day => day.claimed)
          .reverse()
          .map((day) => (
            <View key={`${day.day}-${day.date}`} style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Ionicons name="gift" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>Daily Check-in Day {day.day}</Text>
                <Text style={styles.historyDate}>{day.date}</Text>
              </View>
              <Text style={styles.historyReward}>+{day.coins} coins</Text>
            </View>
          ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={styles.coinsContainer}>
          <Ionicons name="diamond" size={16} color="#FFD700" />
          <Text style={styles.coinsText}>{userRewards.totalCoins}</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'checkin' && styles.tabActive]}
          onPress={() => setSelectedTab('checkin')}
        >
          <Text style={[styles.tabText, selectedTab === 'checkin' && styles.tabTextActive]}>
            Check-in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'achievements' && styles.tabActive]}
          onPress={() => setSelectedTab('achievements')}
        >
          <Text style={[styles.tabText, selectedTab === 'achievements' && styles.tabTextActive]}>
            Achievements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'history' && styles.tabActive]}
          onPress={() => setSelectedTab('history')}
        >
          <Text style={[styles.tabText, selectedTab === 'history' && styles.tabTextActive]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={watchAdForCoins}>
            <MaterialIcons name="play-circle-filled" size={24} color="#8B5CF6" />
            <Text style={styles.actionText}>Watch Ad</Text>
            <Text style={styles.actionSubtext}>+9 coins</Text>
            <Text style={styles.actionLimit}>
              {userRewards.dailyAdsWatched}/10 today
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share" size={24} color="#8B5CF6" />
            <Text style={styles.actionText}>Share App</Text>
            <Text style={styles.actionSubtext}>+50 coins</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="people" size={24} color="#8B5CF6" />
            <Text style={styles.actionText}>Invite Friends</Text>
            <Text style={styles.actionSubtext}>+100 coins</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'checkin' && renderCheckInCalendar()}
        {selectedTab === 'achievements' && renderAchievements()}
        {selectedTab === 'history' && renderHistory()}
      </ScrollView>

      {/* Coin Animation */}
      <Animated.View style={[
        styles.coinAnimation,
        {
          opacity: coinAnimation,
          transform: [{
            translateY: coinAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -100],
            }),
          }],
        },
      ]}>
        <Ionicons name="diamond" size={30} color="#FFD700" />
        <Text style={styles.coinAnimationText}>
          +{getCurrentCheckInDay() ? rewards.dailyCheckIn[getCurrentCheckInDay()! - 1]?.coins || 0 : 0}
        </Text>
      </Animated.View>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  coinsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  tabText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  actionSubtext: {
    color: '#8B5CF6',
    fontSize: 10,
    marginTop: 2,
  },
  actionLimit: {
    color: '#999',
    fontSize: 9,
    marginTop: 4,
  },
  checkInCalendar: {
    padding: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  streakText: {
    color: '#8B5CF6',
    fontSize: 14,
    marginBottom: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calendarDay: {
    width: '13%',
    alignItems: 'center',
    marginBottom: 15,
  },
  dayContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    position: 'relative',
  },
  dayContainerClaimed: {
    backgroundColor: '#8B5CF6',
  },
  dayContainerBonus: {
    backgroundColor: '#FF6B35',
  },
  dayContainerToday: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  dayNumber: {
    color: '#999',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayNumberClaimed: {
    color: 'white',
  },
  bonusBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },
  bonusText: {
    color: 'black',
    fontSize: 6,
    fontWeight: 'bold',
  },
  dayCoins: {
    color: '#999',
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 2,
  },
  dayCoinsActive: {
    color: '#8B5CF6',
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
  },
  checkInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  achievementsContainer: {
    padding: 20,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    position: 'relative',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  achievementIconUnlocked: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  achievementTitle: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  achievementTitleUnlocked: {
    color: 'white',
  },
  achievementReward: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  achievementDescription: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  progressText: {
    color: '#999',
    fontSize: 10,
  },
  unlockedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 4,
  },
  historyContainer: {
    padding: 20,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
  },
  historyList: {
    marginTop: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  historyDate: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  historyReward: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  coinAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    alignItems: 'center',
    zIndex: 1000,
  },
  coinAnimationText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
