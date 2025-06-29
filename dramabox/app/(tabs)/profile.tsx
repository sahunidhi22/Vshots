import React, { useState } from 'react';
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
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  subscription: 'Free' | 'Premium' | 'VIP';
  coins: number;
  watchTime: string;
  favoriteGenres: string[];
  preferredLanguage: string;
  joinDate: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    avatar: 'https://picsum.photos/150/150?random=user',
    subscription: 'Premium',
    coins: 1250,
    watchTime: '127h 35m',
    favoriteGenres: ['Drama', 'Romance', 'Action'],
    preferredLanguage: 'English',
    joinDate: 'March 2024',
  });

  const [settings, setSettings] = useState({
    notifications: true,
    autoPlay: true,
    downloadQuality: 'HD',
    dataUsage: 'WiFi Only',
    parentalControl: false,
    darkMode: true,
    subtitles: true,
    autoSkipIntro: false,
    remindWatchList: true,
    allowDownloads: true,
  });

  const [tempProfile, setTempProfile] = useState(userProfile);

  const languages = ['English', 'Hindi', 'Korean', 'Spanish', 'French', 'Japanese', 'Thai'];
  const downloadQualities = ['HD', 'SD', 'Auto'];
  const dataUsageOptions = ['WiFi Only', 'WiFi + Cellular', 'Always'];

  const menuItems = [
    {
      id: 'favorites',
      title: 'My Favorites',
      icon: 'heart',
      subtitle: '24 videos saved',
      onPress: () => console.log('Navigate to favorites'),
    },
    {
      id: 'watchHistory',
      title: 'Watch History',
      icon: 'time',
      subtitle: 'Recently watched videos',
      onPress: () => console.log('Navigate to watch history'),
    },
    {
      id: 'downloads',
      title: 'Downloads',
      icon: 'download',
      subtitle: '8 videos downloaded',
      onPress: () => console.log('Navigate to downloads'),
    },
    {
      id: 'watchList',
      title: 'My Watch List',
      icon: 'bookmark',
      subtitle: '12 videos to watch',
      onPress: () => console.log('Navigate to watch list'),
    },
    {
      id: 'transactions',
      title: 'Transaction History',
      icon: 'card',
      subtitle: 'Purchase history & receipts',
      onPress: () => console.log('Navigate to transactions'),
    },
    {
      id: 'subscription',
      title: 'Subscription',
      icon: 'star',
      subtitle: 'Manage your plan',
      onPress: () => router.push('/subscription'),
    },
  ];

  const supportItems = [
    {
      id: 'help',
      title: 'Help Center',
      icon: 'help-circle',
      onPress: () => console.log('Navigate to help center'),
    },
    {
      id: 'contact',
      title: 'Contact Support',
      icon: 'mail',
      onPress: () => console.log('Navigate to contact support'),
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      icon: 'chatbubble',
      onPress: () => console.log('Navigate to feedback'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'shield-checkmark',
      onPress: () => console.log('Navigate to privacy policy'),
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      icon: 'document-text',
      onPress: () => console.log('Navigate to terms of service'),
    },
  ];

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Handle sign out logic
            router.push('/auth');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data, including watch history, favorites, and downloads will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            console.log('Account deletion requested');
          },
        },
      ]
    );
  };

  const saveProfile = () => {
    setUserProfile(tempProfile);
    setShowEditProfile(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'VIP': return '#FFD700';
      case 'Premium': return '#8B5CF6';
      default: return '#999';
    }
  };

  const EditProfileModal = () => (
    <Modal visible={showEditProfile} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.fullScreenModal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={() => setShowEditProfile(false)}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

          <ScrollView style={styles.editContent}>
            <View style={styles.avatarSection}>
              <Image source={{ uri: tempProfile.avatar }} style={styles.editAvatar} />
              <TouchableOpacity style={styles.changeAvatarBtn}>
                <Text style={styles.changeAvatarText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={tempProfile.name}
                onChangeText={(text) => setTempProfile(prev => ({ ...prev, name: text }))}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={tempProfile.email}
                onChangeText={(text) => setTempProfile(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.textInput}
                value={tempProfile.phone}
                onChangeText={(text) => setTempProfile(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={styles.languageSelector}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={styles.inputLabel}>Preferred Language</Text>
              <View style={styles.languageValue}>
                <Text style={styles.languageText}>{tempProfile.preferredLanguage}</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </View>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowEditProfile(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
    </Modal>
  );

  const LanguageModal = () => (
    <Modal visible={showLanguageModal} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.fullScreenModal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Language</Text>
          <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
          
          <ScrollView style={styles.languageList}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language}
                style={styles.languageOption}
                onPress={() => {
                  setTempProfile(prev => ({ ...prev, preferredLanguage: language }));
                  setShowLanguageModal(false);
                }}
              >
                <Text style={styles.languageOptionText}>{language}</Text>
                {tempProfile.preferredLanguage === language && (
                  <Ionicons name="checkmark" size={20} color="#8B5CF6" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
    </Modal>
  );

  const SettingsModal = () => (
    <Modal visible={showSettings} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.fullScreenModal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Settings</Text>
          <TouchableOpacity onPress={() => setShowSettings(false)}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

          <ScrollView style={styles.settingsContent}>
            {/* Playback Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Playback</Text>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Auto Play Next Episode</Text>
                <Switch
                  value={settings.autoPlay}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, autoPlay: value }))}
                  trackColor={{ false: '#333', true: '#8B5CF6' }}
                  thumbColor={settings.autoPlay ? '#fff' : '#f4f3f4'}
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Auto Skip Intro</Text>
                <Switch
                  value={settings.autoSkipIntro}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, autoSkipIntro: value }))}
                  trackColor={{ false: '#333', true: '#8B5CF6' }}
                  thumbColor={settings.autoSkipIntro ? '#fff' : '#f4f3f4'}
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Show Subtitles by Default</Text>
                <Switch
                  value={settings.subtitles}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, subtitles: value }))}
                  trackColor={{ false: '#333', true: '#8B5CF6' }}
                  thumbColor={settings.subtitles ? '#fff' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Download Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Downloads</Text>
              
              <TouchableOpacity style={styles.settingSelector}>
                <Text style={styles.settingLabel}>Download Quality</Text>
                <View style={styles.settingValue}>
                  <Text style={styles.settingValueText}>{settings.downloadQuality}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingSelector}>
                <Text style={styles.settingLabel}>Data Usage</Text>
                <View style={styles.settingValue}>
                  <Text style={styles.settingValueText}>{settings.dataUsage}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </View>
              </TouchableOpacity>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Allow Downloads</Text>
                <Switch
                  value={settings.allowDownloads}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, allowDownloads: value }))}
                  trackColor={{ false: '#333', true: '#8B5CF6' }}
                  thumbColor={settings.allowDownloads ? '#fff' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Notification Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Notifications</Text>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Switch
                  value={settings.notifications}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, notifications: value }))}
                  trackColor={{ false: '#333', true: '#8B5CF6' }}
                  thumbColor={settings.notifications ? '#fff' : '#f4f3f4'}
                />
              </View>

              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Watch List Reminders</Text>
                <Switch
                  value={settings.remindWatchList}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, remindWatchList: value }))}
                  trackColor={{ false: '#333', true: '#8B5CF6' }}
                  thumbColor={settings.remindWatchList ? '#fff' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Security Settings */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Security & Privacy</Text>
              
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Parental Control</Text>
                <Switch
                  value={settings.parentalControl}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, parentalControl: value }))}
                  trackColor={{ false: '#333', true: '#8B5CF6' }}
                  thumbColor={settings.parentalControl ? '#fff' : '#f4f3f4'}
                />
              </View>

              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            <View style={[styles.subscriptionBadge, { backgroundColor: getSubscriptionColor(userProfile.subscription) }]}>
              <Text style={styles.subscriptionText}>{userProfile.subscription}</Text>
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
            <Text style={styles.joinDate}>Member since {userProfile.joinDate}</Text>
          </View>

          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => {
              setTempProfile(userProfile);
              setShowEditProfile(true);
            }}
          >
            <Ionicons name="create-outline" size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.coins}</Text>
            <Text style={styles.statLabel}>Coins</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.watchTime}</Text>
            <Text style={styles.statLabel}>Watch Time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userProfile.favoriteGenres.length}</Text>
            <Text style={styles.statLabel}>Genres</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="gift" size={24} color="#8B5CF6" />
            <Text style={styles.quickActionText}>Daily Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="wallet" size={24} color="#8B5CF6" />
            <Text style={styles.quickActionText}>Buy Coins</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="share" size={24} color="#8B5CF6" />
            <Text style={styles.quickActionText}>Refer Friends</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>My Content</Text>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon as any} size={20} color="#8B5CF6" />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowSettings(true)}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="settings" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemTitle}>App Settings</Text>
                <Text style={styles.menuItemSubtitle}>Preferences & controls</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          {supportItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon as any} size={20} color="#8B5CF6" />
                </View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Account Actions */}
        <View style={styles.accountActions}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <EditProfileModal />
      <LanguageModal />
      <SettingsModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#8B5CF6',
  },
  subscriptionBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  subscriptionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#999',
    fontSize: 14,
    marginBottom: 2,
  },
  joinDate: {
    color: '#999',
    fontSize: 12,
  },
  editButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  menuSection: {
    marginTop: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemSubtitle: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  accountActions: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
  },
  bottomPadding: {
    height: 100,
  },
  // Modal Styles
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#1a1a1a',
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
  editContent: {
    flex: 1,
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  editAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#8B5CF6',
    marginBottom: 15,
  },
  changeAvatarBtn: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeAvatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: 'white',
    fontSize: 16,
  },
  languageSelector: {
    marginBottom: 20,
  },
  languageValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  languageText: {
    color: 'white',
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  languageList: {
    flex: 1,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  languageOptionText: {
    color: 'white',
    fontSize: 16,
  },
  settingsContent: {
    flex: 1,
    padding: 20,
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingsSectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingLabel: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  settingSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    color: '#999',
    fontSize: 14,
    marginRight: 8,
  },
});
