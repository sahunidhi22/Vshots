import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Transaction {
  id: string;
  type: 'earned' | 'spent' | 'purchased' | 'refund';
  amount: number;
  description: string;
  timestamp: Date;
  episodeTitle?: string;
  videoTitle?: string;
  method?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface UserWallet {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  subscriptionExpiry?: Date;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  pointsToNextLevel: number;
}

export default function WalletScreen() {
  const [activeTab, setActiveTab] = useState<'balance' | 'transactions' | 'earn'>('balance');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'earned' | 'spent' | 'purchased'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const router = useRouter();

  // Mock user wallet data
  const [userWallet, setUserWallet] = useState<UserWallet>({
    balance: 245,
    totalEarned: 1280,
    totalSpent: 1035,
    subscriptionStatus: 'active',
    subscriptionExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    level: 'Silver',
    pointsToNextLevel: 150,
  });

  // Mock transaction history
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earned',
      amount: 50,
      description: 'Daily check-in bonus (7-day streak)',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
    },
    {
      id: '2',
      type: 'spent',
      amount: -20,
      description: 'Unlocked Episode 3',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      episodeTitle: 'Episode 3: The Truth',
      videoTitle: 'REEL REVENGE',
      status: 'completed',
    },
    {
      id: '3',
      type: 'earned',
      amount: 9,
      description: 'Watched advertisement',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      status: 'completed',
    },
    {
      id: '4',
      type: 'purchased',
      amount: 500,
      description: '500 Coins Pack',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      method: 'Google Pay',
      status: 'completed',
    },
    {
      id: '5',
      type: 'spent',
      amount: -15,
      description: 'Unlocked Episode 4',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      episodeTitle: 'Episode 4: Revelation',
      videoTitle: 'LOVER',
      status: 'completed',
    },
    {
      id: '6',
      type: 'earned',
      amount: 25,
      description: 'Referral bonus - Friend joined',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
    },
    {
      id: '7',
      type: 'refund',
      amount: 20,
      description: 'Refund for Episode 2',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      episodeTitle: 'Episode 2: Betrayal',
      videoTitle: 'MYSTERY NIGHT',
      status: 'completed',
    },
  ]);

  const coinPacks = [
    { id: 1, coins: 100, price: 0.99, originalPrice: 1.09, discount: 9 },
    { id: 2, coins: 500, price: 4.99, originalPrice: 5.49, discount: 9 },
    { id: 3, coins: 1000, price: 9.99, originalPrice: 10.99, discount: 9 },
    { id: 4, coins: 3000, price: 24.99, originalPrice: 29.99, discount: 17 },
  ];

  const earningMethods = [
    {
      id: 1,
      title: 'Daily Check-in',
      description: 'Earn up to 50 coins daily',
      icon: 'calendar' as const,
      coins: '10-50',
      action: () => router.push('/rewards'),
    },
    {
      id: 2,
      title: 'Watch Ads',
      description: 'Earn 9 coins per ad',
      icon: 'play-circle' as const,
      coins: '9',
      action: () => watchAd(),
    },
    {
      id: 3,
      title: 'Invite Friends',
      description: 'Earn 25 coins per referral',
      icon: 'people' as const,
      coins: '25',
      action: () => shareApp(),
    },
    {
      id: 4,
      title: 'Complete Profile',
      description: 'One-time bonus',
      icon: 'person' as const,
      coins: '100',
      action: () => router.push('/(tabs)/profile'),
    },
    {
      id: 5,
      title: 'Rate the App',
      description: 'One-time bonus',
      icon: 'star' as const,
      coins: '50',
      action: () => rateApp(),
    },
  ];

  useEffect(() => {
    // Auto-refresh wallet data
    const interval = setInterval(() => {
      // Simulate real-time updates
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const watchAd = () => {
    Alert.alert(
      'Watch Advertisement',
      'Watch a 30-second ad to earn 9 coins?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Watch',
          onPress: () => {
            // Simulate ad watching
            setTimeout(() => {
              setUserWallet(prev => ({ ...prev, balance: prev.balance + 9 }));
              const newTransaction: Transaction = {
                id: Date.now().toString(),
                type: 'earned',
                amount: 9,
                description: 'Watched advertisement',
                timestamp: new Date(),
                status: 'completed',
              };
              setTransactions(prev => [newTransaction, ...prev]);
              Alert.alert('Reward Earned!', '9 coins have been added to your wallet.');
            }, 3000);
          },
        },
      ]
    );
  };

  const shareApp = () => {
    // Implement share functionality
    Alert.alert('Share App', 'Share Vshots with friends to earn 25 coins per successful referral!');
  };

  const rateApp = () => {
    Alert.alert(
      'Rate Vshots',
      'Please rate us on the App Store to earn 50 coins!',
      [
        { text: 'Later', style: 'cancel' },
        {
          text: 'Rate Now',
          onPress: () => {
            setUserWallet(prev => ({ ...prev, balance: prev.balance + 50 }));
            Alert.alert('Thank You!', '50 coins have been added to your wallet.');
          },
        },
      ]
    );
  };

  const handleTopUp = (pack: any) => {
    Alert.alert(
      'Purchase Coins',
      `Buy ${pack.coins} coins for $${pack.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: () => {
            setUserWallet(prev => ({ ...prev, balance: prev.balance + pack.coins }));
            const newTransaction: Transaction = {
              id: Date.now().toString(),
              type: 'purchased',
              amount: pack.coins,
              description: `${pack.coins} Coins Pack`,
              timestamp: new Date(),
              method: 'Credit Card',
              status: 'completed',
            };
            setTransactions(prev => [newTransaction, ...prev]);
            setShowTopUpModal(false);
            Alert.alert('Purchase Successful!', `${pack.coins} coins have been added to your wallet.`);
          },
        },
      ]
    );
  };

  const getFilteredTransactions = () => {
    let filtered = transactions;

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();

      switch (timeFilter) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setDate(now.getDate() - 30);
          break;
      }

      filtered = filtered.filter(t => t.timestamp >= cutoff);
    }

    return filtered;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return 'add-circle';
      case 'spent': return 'remove-circle';
      case 'purchased': return 'card';
      case 'refund': return 'refresh-circle';
      default: return 'help-circle';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return '#4CAF50';
      case 'spent': return '#FF6B35';
      case 'purchased': return '#8B5CF6';
      case 'refund': return '#2196F3';
      default: return '#999';
    }
  };

  const getLevelProgress = () => {
    return ((userWallet.totalEarned % 500) / 500) * 100;
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(item.type) + '20' }]}>
          <Ionicons 
            name={getTransactionIcon(item.type)} 
            size={20} 
            color={getTransactionColor(item.type)} 
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          {item.videoTitle && (
            <Text style={styles.transactionSubtitle}>{item.videoTitle}</Text>
          )}
          {item.episodeTitle && (
            <Text style={styles.transactionSubtitle}>{item.episodeTitle}</Text>
          )}
          <Text style={styles.transactionTime}>{formatDate(item.timestamp)}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[
          styles.transactionAmount,
          { color: item.amount > 0 ? '#4CAF50' : '#FF6B35' }
        ]}>
          {item.amount > 0 ? '+' : ''}{item.amount}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? '#4CAF50' : '#FF6B35' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  const renderCoinPack = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.coinPack} 
      onPress={() => handleTopUp(item)}
    >
      <View style={styles.coinPackHeader}>
        <Text style={styles.coinAmount}>{item.coins}</Text>
        <Text style={styles.coinLabel}>COINS</Text>
      </View>
      <View style={styles.coinPackPricing}>
        <Text style={styles.coinPrice}>${item.price}</Text>
        {item.originalPrice > item.price && (
          <Text style={styles.coinOriginalPrice}>${item.originalPrice}</Text>
        )}
      </View>
      {item.discount > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}% OFF</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEarningMethod = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.earningMethod} onPress={item.action}>
      <View style={styles.earningIcon}>
        <Ionicons name={item.icon} size={24} color="#8B5CF6" />
      </View>
      <View style={styles.earningDetails}>
        <Text style={styles.earningTitle}>{item.title}</Text>
        <Text style={styles.earningDescription}>{item.description}</Text>
      </View>
      <View style={styles.earningReward}>
        <Text style={styles.earningCoins}>{item.coins}</Text>
        <Text style={styles.earningCoinsLabel}>coins</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  const renderBalanceTab = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Main Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <TouchableOpacity>
            <Ionicons name="eye-outline" size={20} color="#999" />
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceAmount}>{userWallet.balance}</Text>
        <Text style={styles.coinLabel}>COINS</Text>
        
        <View style={styles.balanceActions}>
          <TouchableOpacity 
            style={styles.balanceButton} 
            onPress={() => setShowTopUpModal(true)}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.balanceButtonText}>Top Up</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.balanceButton, styles.balanceButtonSecondary]} 
            onPress={() => setShowWithdrawModal(true)}
          >
            <Ionicons name="download-outline" size={20} color="#8B5CF6" />
            <Text style={[styles.balanceButtonText, { color: '#8B5CF6' }]}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userWallet.totalEarned}</Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userWallet.totalSpent}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
      </View>

      {/* Level Progress */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelTitle}>Level: {userWallet.level}</Text>
          <Text style={styles.levelProgress}>{userWallet.pointsToNextLevel} to Gold</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${getLevelProgress()}%` }]} />
        </View>
        <Text style={styles.levelBenefits}>Level up for exclusive benefits!</Text>
      </View>

      {/* Subscription Status */}
      <View style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <Text style={styles.subscriptionTitle}>Subscription Status</Text>
          <View style={[
            styles.subscriptionBadge,
            { backgroundColor: userWallet.subscriptionStatus === 'active' ? '#4CAF50' : '#FF6B35' }
          ]}>
            <Text style={styles.subscriptionBadgeText}>
              {userWallet.subscriptionStatus.toUpperCase()}
            </Text>
          </View>
        </View>
        {userWallet.subscriptionStatus === 'active' && userWallet.subscriptionExpiry && (
          <Text style={styles.subscriptionExpiry}>
            Expires: {userWallet.subscriptionExpiry.toLocaleDateString()}
          </Text>
        )}
        <TouchableOpacity 
          style={styles.subscriptionButton}
          onPress={() => router.push('/subscription')}
        >
          <Text style={styles.subscriptionButtonText}>
            {userWallet.subscriptionStatus === 'active' ? 'Manage' : 'Subscribe'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/rewards')}>
            <Ionicons name="gift" size={24} color="#8B5CF6" />
            <Text style={styles.actionText}>Daily Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={shareApp}>
            <Ionicons name="share-social" size={24} color="#8B5CF6" />
            <Text style={styles.actionText}>Invite Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="settings" size={24} color="#8B5CF6" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => setActiveTab('earn')}>
            <Ionicons name="trending-up" size={24} color="#8B5CF6" />
            <Text style={styles.actionText}>Earn More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderTransactionsTab = () => (
    <View style={styles.tabContent}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {['all', 'earned', 'spent', 'purchased'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, filterType === filter && styles.filterChipActive]}
              onPress={() => setFilterType(filter as any)}
            >
              <Text style={[
                styles.filterChipText,
                filterType === filter && styles.filterChipTextActive
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {['all', 'today', 'week', 'month'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, timeFilter === filter && styles.filterChipActive]}
              onPress={() => setTimeFilter(filter as any)}
            >
              <Text style={[
                styles.filterChipText,
                timeFilter === filter && styles.filterChipTextActive
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Transactions List */}
      <FlatList
        data={getFilteredTransactions()}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        style={styles.transactionsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#666" />
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>Your transaction history will appear here</Text>
          </View>
        }
      />
    </View>
  );

  const renderEarnTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Earn More Coins</Text>
      <Text style={styles.sectionSubtitle}>Complete these tasks to earn coins and unlock content</Text>
      
      <FlatList
        data={earningMethods}
        renderItem={renderEarningMethod}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />

      <View style={styles.earnTips}>
        <Text style={styles.earnTipsTitle}>💡 Pro Tips</Text>
        <Text style={styles.earnTip}>• Check in daily for streak bonuses</Text>
        <Text style={styles.earnTip}>• Watch ads when available for quick coins</Text>
        <Text style={styles.earnTip}>• Refer friends for the highest coin rewards</Text>
        <Text style={styles.earnTip}>• Complete your profile for a one-time bonus</Text>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        {[
          { key: 'balance', label: 'Balance', icon: 'wallet' as const },
          { key: 'transactions', label: 'History', icon: 'list' as const },
          { key: 'earn', label: 'Earn', icon: 'trending-up' as const },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={activeTab === tab.key ? '#8B5CF6' : '#999'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 'balance' && renderBalanceTab()}
      {activeTab === 'transactions' && renderTransactionsTab()}
      {activeTab === 'earn' && renderEarnTab()}

      {/* Top Up Modal */}
      <Modal
        visible={showTopUpModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTopUpModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Buy Coins</Text>
            <TouchableOpacity onPress={() => setShowTopUpModal(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Purchase coins to unlock premium content and episodes
            </Text>
            <FlatList
              data={coinPacks}
              renderItem={renderCoinPack}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.coinPackRow}
              scrollEnabled={false}
            />
          </ScrollView>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.withdrawModal}>
            <Text style={styles.modalTitle}>Withdraw Not Available</Text>
            <Text style={styles.modalDescription}>
              Coin withdrawal is not currently available. Coins can be used to unlock content within the app.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowWithdrawModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  tabText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#8B5CF6',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  balanceCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  balanceLabel: {
    color: '#999',
    fontSize: 16,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
  coinLabel: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 25,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 15,
  },
  balanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  balanceButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  balanceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#999',
    fontSize: 14,
  },
  levelCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelProgress: {
    color: '#8B5CF6',
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  levelBenefits: {
    color: '#999',
    fontSize: 12,
  },
  subscriptionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subscriptionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  subscriptionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  subscriptionExpiry: {
    color: '#999',
    fontSize: 14,
    marginBottom: 15,
  },
  subscriptionButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscriptionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: '#999',
    fontSize: 14,
    marginBottom: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  actionItem: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterScroll: {
    marginBottom: 10,
  },
  filterChip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#8B5CF6',
  },
  filterChipText: {
    color: '#999',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: 'white',
  },
  transactionsList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionSubtitle: {
    color: '#8B5CF6',
    fontSize: 12,
    marginBottom: 2,
  },
  transactionTime: {
    color: '#999',
    fontSize: 12,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    color: '#999',
    fontSize: 14,
  },
  earningMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    gap: 15,
  },
  earningIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningDetails: {
    flex: 1,
  },
  earningTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  earningDescription: {
    color: '#999',
    fontSize: 14,
  },
  earningReward: {
    alignItems: 'center',
  },
  earningCoins: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  earningCoinsLabel: {
    color: '#999',
    fontSize: 12,
  },
  earnTips: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  earnTipsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  earnTip: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
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
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 25,
    textAlign: 'center',
  },
  coinPackRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  coinPack: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  coinPackHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  coinAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  coinPackPricing: {
    alignItems: 'center',
    gap: 5,
  },
  coinPrice: {
    color: '#8B5CF6',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coinOriginalPrice: {
    color: '#999',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  withdrawModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 30,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
