import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { subscriptionPlans, coinPacks, payPerViewOptions } from '../data/videos';

export default function SubscriptionScreen() {
  const [activeTab, setActiveTab] = useState('subscription');
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedCoinPack, setSelectedCoinPack] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userCoins, setUserCoins] = useState(150);
  const [region, setRegion] = useState<'domestic' | 'international'>('domestic');
  const router = useRouter();

  const handleSubscribe = (plan: string) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleBuyCoins = (pack: any) => {
    setSelectedCoinPack(pack);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    setShowPaymentModal(false);
    if (activeTab === 'subscription') {
      Alert.alert('Success', 'Subscription activated successfully!');
    } else {
      Alert.alert('Success', `${selectedCoinPack?.coins} coins added to your wallet!`);
      setUserCoins(prev => prev + (selectedCoinPack?.coins || 0));
    }
  };

  const renderSubscriptionPlan = (plan: any, planKey: string) => (
    <TouchableOpacity
      key={planKey}
      style={[
        styles.planCard,
        selectedPlan === planKey && styles.selectedPlan
      ]}
      onPress={() => handleSubscribe(planKey)}
    >
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>
          {planKey.charAt(0).toUpperCase() + planKey.slice(1)} Plan
        </Text>
        {plan.comingSoon && (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.currency}>
          {region === 'domestic' ? '₹' : '$'}
        </Text>
        <Text style={styles.price}>{plan.price}</Text>
        <Text style={styles.duration}>/{plan.duration}</Text>
      </View>
      
      {region === 'domestic' && plan.gst && (
        <Text style={styles.gstText}>+ ₹{plan.gst} GST</Text>
      )}
      
      <View style={styles.benefits}>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Unlimited premium episodes</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>No ads</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>HD quality</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Download episodes</Text>
        </View>
        {planKey === 'monthly' && (
          <View style={styles.benefitItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.benefitText}>Early bird access (₹10/series)</Text>
          </View>
        )}
      </View>
      
      {!plan.comingSoon && (
        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={() => handleSubscribe(planKey)}
        >
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderCoinPack = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.coinCard,
        selectedCoinPack?.id === item.id && styles.selectedCoin
      ]}
      onPress={() => handleBuyCoins(item)}
    >
      <View style={styles.coinHeader}>
        <Ionicons name="diamond" size={24} color="#FFD700" />
        <Text style={styles.coinAmount}>{item.coins} Coins</Text>
      </View>
      
      <View style={styles.coinPricing}>
        <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
        <Text style={styles.discountPrice}>₹{item.price}</Text>
      </View>
      
      <View style={styles.savingsBadge}>
        <Text style={styles.savingsText}>Save ₹{item.discount}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.buyButton}
        onPress={() => handleBuyCoins(item)}
      >
        <Text style={styles.buyButtonText}>Buy Now</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPayPerViewOption = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.payPerViewCard}>
      <View style={styles.payPerViewInfo}>
        <Text style={styles.payPerViewTitle}>{item.description}</Text>
        <Text style={styles.payPerViewPrice}>₹{item.price}</Text>
        <Text style={styles.payPerViewDetails}>
          {item.episodes === 1 ? '1 Episode' : `${item.episodes} Episodes`}
        </Text>
      </View>
      <TouchableOpacity style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Select</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Premium Access</Text>
        <View style={styles.coinWallet}>
          <Ionicons name="diamond" size={20} color="#FFD700" />
          <Text style={styles.coinCount}>{userCoins}</Text>
        </View>
      </View>

      {/* Region Toggle */}
      <View style={styles.regionToggle}>
        <TouchableOpacity
          style={[
            styles.regionButton,
            region === 'domestic' && styles.activeRegion
          ]}
          onPress={() => setRegion('domestic')}
        >
          <Text style={[
            styles.regionText,
            region === 'domestic' && styles.activeRegionText
          ]}>
            India
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.regionButton,
            region === 'international' && styles.activeRegion
          ]}
          onPress={() => setRegion('international')}
        >
          <Text style={[
            styles.regionText,
            region === 'international' && styles.activeRegionText
          ]}>
            International
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'subscription' && styles.activeTab
          ]}
          onPress={() => setActiveTab('subscription')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'subscription' && styles.activeTabText
          ]}>
            Subscription
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'coins' && styles.activeTab
          ]}
          onPress={() => setActiveTab('coins')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'coins' && styles.activeTabText
          ]}>
            Buy Coins
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'payperView' && styles.activeTab
          ]}
          onPress={() => setActiveTab('payperView')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'payperView' && styles.activeTabText
          ]}>
            Pay Per View
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'subscription' && (
          <View style={styles.subscriptionContent}>
            <Text style={styles.sectionTitle}>Choose Your Plan</Text>
            <Text style={styles.sectionSubtitle}>
              Unlock unlimited access to premium content
            </Text>
            
            <View style={styles.plansContainer}>
              {Object.entries(subscriptionPlans[region] as any).map(([key, plan]: [string, any]) =>
                renderSubscriptionPlan(plan, key)
              )}
            </View>
          </View>
        )}

        {activeTab === 'coins' && (
          <View style={styles.coinsContent}>
            <Text style={styles.sectionTitle}>Buy V-Coins</Text>
            <Text style={styles.sectionSubtitle}>
              Unlock individual episodes with coins
            </Text>
            
            <FlatList
              data={coinPacks}
              renderItem={renderCoinPack}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.coinsList}
            />
            
            {/* Watch Ad for Coins */}
            <TouchableOpacity style={styles.watchAdCard}>
              <View style={styles.watchAdContent}>
                <Ionicons name="play-circle" size={32} color="#FF6B35" />
                <View style={styles.watchAdInfo}>
                  <Text style={styles.watchAdTitle}>Watch Ad & Earn Coins</Text>
                  <Text style={styles.watchAdSubtitle}>
                    Get 9 coins for each ad • Unlock 1 episode
                  </Text>
                </View>
              </View>
              <Text style={styles.watchAdButton}>Watch Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'payperView' && (
          <View style={styles.payPerViewContent}>
            <Text style={styles.sectionTitle}>Pay Per View</Text>
            <Text style={styles.sectionSubtitle}>
              Pay only for what you watch
            </Text>
            
            <FlatList
              data={payPerViewOptions}
              renderItem={renderPayPerViewOption}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.payPerViewList}
            />
          </View>
        )}
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.paymentModal}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentTitle}>Complete Payment</Text>
            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentContent}>
            {activeTab === 'subscription' ? (
              <View style={styles.paymentSummary}>
                <Text style={styles.paymentItem}>
                  {selectedPlan?.charAt(0).toUpperCase() + selectedPlan?.slice(1)} Plan
                </Text>
                <Text style={styles.paymentAmount}>
                  ₹{(subscriptionPlans[region] as any)[selectedPlan]?.price}
                </Text>
              </View>
            ) : (
              <View style={styles.paymentSummary}>
                <Text style={styles.paymentItem}>
                  {selectedCoinPack?.coins} V-Coins
                </Text>
                <Text style={styles.paymentAmount}>
                  ₹{selectedCoinPack?.price}
                </Text>
              </View>
            )}
            
            <View style={styles.paymentMethods}>
              <TouchableOpacity style={styles.paymentMethod}>
                <Ionicons name="card" size={24} color="white" />
                <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.paymentMethod}>
                <Ionicons name="phone-portrait" size={24} color="white" />
                <Text style={styles.paymentMethodText}>UPI</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.paymentMethod}>
                <Ionicons name="wallet" size={24} color="white" />
                <Text style={styles.paymentMethodText}>Net Banking</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.confirmPaymentButton} onPress={handlePayment}>
              <Text style={styles.confirmPaymentText}>Confirm Payment</Text>
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
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coinWallet: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  coinCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  regionToggle: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    padding: 4,
  },
  regionButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeRegion: {
    backgroundColor: '#8B5CF6',
  },
  regionText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  activeRegionText: {
    color: 'white',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#8B5CF6',
  },
  tabText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#999',
    fontSize: 16,
    marginBottom: 20,
  },
  subscriptionContent: {
    paddingBottom: 20,
  },
  plansContainer: {
    gap: 15,
  },
  planCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlan: {
    borderColor: '#8B5CF6',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  planTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  comingSoonBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  comingSoonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  currency: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  price: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  duration: {
    color: '#999',
    fontSize: 16,
    marginLeft: 4,
  },
  gstText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 15,
  },
  benefits: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  subscribeButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  coinsContent: {
    paddingBottom: 20,
  },
  coinsList: {
    paddingBottom: 20,
  },
  coinCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCoin: {
    borderColor: '#FFD700',
  },
  coinHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  coinAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  coinPricing: {
    alignItems: 'center',
    marginBottom: 10,
  },
  originalPrice: {
    color: '#999',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  savingsBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },
  savingsText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  buyButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  watchAdCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  watchAdContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  watchAdInfo: {
    marginLeft: 15,
    flex: 1,
  },
  watchAdTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  watchAdSubtitle: {
    color: '#999',
    fontSize: 12,
  },
  watchAdButton: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  payPerViewContent: {
    paddingBottom: 20,
  },
  payPerViewList: {
    gap: 15,
  },
  payPerViewCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payPerViewInfo: {
    flex: 1,
  },
  payPerViewTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  payPerViewPrice: {
    color: '#8B5CF6',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  payPerViewDetails: {
    color: '#999',
    fontSize: 12,
  },
  selectButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  paymentModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  paymentTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentContent: {
    flex: 1,
    padding: 20,
  },
  paymentSummary: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  paymentItem: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  paymentAmount: {
    color: '#8B5CF6',
    fontSize: 24,
    fontWeight: 'bold',
  },
  paymentMethods: {
    marginBottom: 30,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  paymentMethodText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  confirmPaymentButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmPaymentText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
