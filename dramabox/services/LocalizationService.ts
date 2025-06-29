// Multilingual support system for Vshots app
// This provides translation keys and localization utilities

export type SupportedLanguage = 'en' | 'ko' | 'zh' | 'es' | 'hi' | 'ja' | 'fr' | 'de' | 'pt' | 'ar';

export interface Translation {
  // App Navigation
  home: string;
  explore: string;
  profile: string;
  rewards: string;
  settings: string;
  history: string;
  downloads: string;
  wallet: string;
  
  // Common Actions
  play: string;
  pause: string;
  stop: string;
  like: string;
  share: string;
  download: string;
  cancel: string;
  confirm: string;
  save: string;
  delete: string;
  edit: string;
  search: string;
  filter: string;
  sort: string;
  
  // Video Player
  fullscreen: string;
  exitFullscreen: string;
  mute: string;
  unmute: string;
  subtitles: string;
  quality: string;
  speed: string;
  nextEpisode: string;
  previousEpisode: string;
  
  // Categories
  whatsnew: string;
  favourite: string;
  genre: string;
  top1: string;
  top2: string;
  top3: string;
  
  // Genres
  drama: string;
  comedy: string;
  action: string;
  romance: string;
  thriller: string;
  horror: string;
  scifi: string;
  fantasy: string;
  documentary: string;
  animation: string;
  
  // User Interface
  login: string;
  register: string;
  logout: string;
  forgotPassword: string;
  resetPassword: string;
  account: string;
  subscription: string;
  premium: string;
  free: string;
  
  // Notifications
  notifications: string;
  newEpisode: string;
  dailyReward: string;
  watchReminder: string;
  subscriptionExpiry: string;
  
  // Rewards & Coins
  coins: string;
  earnCoins: string;
  dailyCheckIn: string;
  watchAds: string;
  inviteFriends: string;
  levelUp: string;
  achievement: string;
  
  // Time & Duration
  seconds: string;
  minutes: string;
  hours: string;
  days: string;
  weeks: string;
  months: string;
  years: string;
  
  // Status Messages
  loading: string;
  error: string;
  success: string;
  noConnection: string;
  tryAgain: string;
  
  // Subscription Tiers
  basicPlan: string;
  premiumPlan: string;
  vipPlan: string;
  
  // Watch History
  watchHistory: string;
  continueWatching: string;
  recentlyWatched: string;
  
  // Download States
  downloading: string;
  downloaded: string;
  downloadFailed: string;
  downloadPaused: string;
  
  // Error Messages
  videoNotFound: string;
  networkError: string;
  playbackError: string;
  subscriptionRequired: string;
  
  // Social Features
  watchParty: string;
  shareWithFriends: string;
  rateThisVideo: string;
  reportContent: string;
}

export const translations: Record<SupportedLanguage, Translation> = {
  en: {
    // App Navigation
    home: 'Home',
    explore: 'Explore',
    profile: 'Profile',
    rewards: 'Rewards',
    settings: 'Settings',
    history: 'History',
    downloads: 'Downloads',
    wallet: 'Wallet',
    
    // Common Actions
    play: 'Play',
    pause: 'Pause',
    stop: 'Stop',
    like: 'Like',
    share: 'Share',
    download: 'Download',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    
    // Video Player
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    mute: 'Mute',
    unmute: 'Unmute',
    subtitles: 'Subtitles',
    quality: 'Quality',
    speed: 'Speed',
    nextEpisode: 'Next Episode',
    previousEpisode: 'Previous Episode',
    
    // Categories
    whatsnew: "What's New",
    favourite: 'Favourite',
    genre: 'Genre',
    top1: 'Top 1',
    top2: 'Top 2',
    top3: 'Top 3',
    
    // Genres
    drama: 'Drama',
    comedy: 'Comedy',
    action: 'Action',
    romance: 'Romance',
    thriller: 'Thriller',
    horror: 'Horror',
    scifi: 'Sci-Fi',
    fantasy: 'Fantasy',
    documentary: 'Documentary',
    animation: 'Animation',
    
    // User Interface
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',
    account: 'Account',
    subscription: 'Subscription',
    premium: 'Premium',
    free: 'Free',
    
    // Notifications
    notifications: 'Notifications',
    newEpisode: 'New Episode',
    dailyReward: 'Daily Reward',
    watchReminder: 'Watch Reminder',
    subscriptionExpiry: 'Subscription Expiry',
    
    // Rewards & Coins
    coins: 'Coins',
    earnCoins: 'Earn Coins',
    dailyCheckIn: 'Daily Check-in',
    watchAds: 'Watch Ads',
    inviteFriends: 'Invite Friends',
    levelUp: 'Level Up',
    achievement: 'Achievement',
    
    // Time & Duration
    seconds: 'seconds',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    weeks: 'weeks',
    months: 'months',
    years: 'years',
    
    // Status Messages
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    noConnection: 'No internet connection',
    tryAgain: 'Try Again',
    
    // Subscription Tiers
    basicPlan: 'Basic Plan',
    premiumPlan: 'Premium Plan',
    vipPlan: 'VIP Plan',
    
    // Watch History
    watchHistory: 'Watch History',
    continueWatching: 'Continue Watching',
    recentlyWatched: 'Recently Watched',
    
    // Download States
    downloading: 'Downloading',
    downloaded: 'Downloaded',
    downloadFailed: 'Download Failed',
    downloadPaused: 'Download Paused',
    
    // Error Messages
    videoNotFound: 'Video not found',
    networkError: 'Network error',
    playbackError: 'Playback error',
    subscriptionRequired: 'Subscription required',
    
    // Social Features
    watchParty: 'Watch Party',
    shareWithFriends: 'Share with Friends',
    rateThisVideo: 'Rate this Video',
    reportContent: 'Report Content',
  },
  
  ko: {
    // App Navigation
    home: '홈',
    explore: '탐색',
    profile: '프로필',
    rewards: '리워드',
    settings: '설정',
    history: '기록',
    downloads: '다운로드',
    wallet: '지갑',
    
    // Common Actions
    play: '재생',
    pause: '일시정지',
    stop: '정지',
    like: '좋아요',
    share: '공유',
    download: '다운로드',
    cancel: '취소',
    confirm: '확인',
    save: '저장',
    delete: '삭제',
    edit: '편집',
    search: '검색',
    filter: '필터',
    sort: '정렬',
    
    // Video Player
    fullscreen: '전체화면',
    exitFullscreen: '전체화면 종료',
    mute: '음소거',
    unmute: '음소거 해제',
    subtitles: '자막',
    quality: '화질',
    speed: '속도',
    nextEpisode: '다음 에피소드',
    previousEpisode: '이전 에피소드',
    
    // Categories
    whatsnew: '새로운 콘텐츠',
    favourite: '즐겨찾기',
    genre: '장르',
    top1: '탑 1',
    top2: '탑 2',
    top3: '탑 3',
    
    // Genres
    drama: '드라마',
    comedy: '코미디',
    action: '액션',
    romance: '로맨스',
    thriller: '스릴러',
    horror: '호러',
    scifi: 'SF',
    fantasy: '판타지',
    documentary: '다큐멘터리',
    animation: '애니메이션',
    
    // User Interface
    login: '로그인',
    register: '회원가입',
    logout: '로그아웃',
    forgotPassword: '비밀번호 찾기',
    resetPassword: '비밀번호 재설정',
    account: '계정',
    subscription: '구독',
    premium: '프리미엄',
    free: '무료',
    
    // Notifications
    notifications: '알림',
    newEpisode: '새 에피소드',
    dailyReward: '일일 리워드',
    watchReminder: '시청 알림',
    subscriptionExpiry: '구독 만료',
    
    // Rewards & Coins
    coins: '코인',
    earnCoins: '코인 적립',
    dailyCheckIn: '일일 체크인',
    watchAds: '광고 시청',
    inviteFriends: '친구 초대',
    levelUp: '레벨업',
    achievement: '성취',
    
    // Time & Duration
    seconds: '초',
    minutes: '분',
    hours: '시간',
    days: '일',
    weeks: '주',
    months: '월',
    years: '년',
    
    // Status Messages
    loading: '로딩 중...',
    error: '오류',
    success: '성공',
    noConnection: '인터넷 연결 없음',
    tryAgain: '다시 시도',
    
    // Subscription Tiers
    basicPlan: '기본 플랜',
    premiumPlan: '프리미엄 플랜',
    vipPlan: 'VIP 플랜',
    
    // Watch History
    watchHistory: '시청 기록',
    continueWatching: '계속 시청',
    recentlyWatched: '최근 시청',
    
    // Download States
    downloading: '다운로드 중',
    downloaded: '다운로드 완료',
    downloadFailed: '다운로드 실패',
    downloadPaused: '다운로드 일시정지',
    
    // Error Messages
    videoNotFound: '비디오를 찾을 수 없음',
    networkError: '네트워크 오류',
    playbackError: '재생 오류',
    subscriptionRequired: '구독 필요',
    
    // Social Features
    watchParty: '워치 파티',
    shareWithFriends: '친구와 공유',
    rateThisVideo: '이 비디오 평가',
    reportContent: '콘텐츠 신고',
  },
  
  zh: {
    // App Navigation
    home: '首页',
    explore: '探索',
    profile: '个人资料',
    rewards: '奖励',
    settings: '设置',
    history: '历史记录',
    downloads: '下载',
    wallet: '钱包',
    
    // Common Actions
    play: '播放',
    pause: '暂停',
    stop: '停止',
    like: '点赞',
    share: '分享',
    download: '下载',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    
    // Video Player
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    mute: '静音',
    unmute: '取消静音',
    subtitles: '字幕',
    quality: '画质',
    speed: '速度',
    nextEpisode: '下一集',
    previousEpisode: '上一集',
    
    // Categories
    whatsnew: '最新内容',
    favourite: '收藏',
    genre: '类型',
    top1: '热门1',
    top2: '热门2',
    top3: '热门3',
    
    // Genres
    drama: '剧情',
    comedy: '喜剧',
    action: '动作',
    romance: '爱情',
    thriller: '惊悚',
    horror: '恐怖',
    scifi: '科幻',
    fantasy: '奇幻',
    documentary: '纪录片',
    animation: '动画',
    
    // User Interface
    login: '登录',
    register: '注册',
    logout: '退出登录',
    forgotPassword: '忘记密码',
    resetPassword: '重置密码',
    account: '账户',
    subscription: '订阅',
    premium: '高级',
    free: '免费',
    
    // Notifications
    notifications: '通知',
    newEpisode: '新剧集',
    dailyReward: '每日奖励',
    watchReminder: '观看提醒',
    subscriptionExpiry: '订阅到期',
    
    // Rewards & Coins
    coins: '金币',
    earnCoins: '赚取金币',
    dailyCheckIn: '每日签到',
    watchAds: '观看广告',
    inviteFriends: '邀请好友',
    levelUp: '升级',
    achievement: '成就',
    
    // Time & Duration
    seconds: '秒',
    minutes: '分钟',
    hours: '小时',
    days: '天',
    weeks: '周',
    months: '月',
    years: '年',
    
    // Status Messages
    loading: '加载中...',
    error: '错误',
    success: '成功',
    noConnection: '无网络连接',
    tryAgain: '重试',
    
    // Subscription Tiers
    basicPlan: '基础套餐',
    premiumPlan: '高级套餐',
    vipPlan: 'VIP套餐',
    
    // Watch History
    watchHistory: '观看历史',
    continueWatching: '继续观看',
    recentlyWatched: '最近观看',
    
    // Download States
    downloading: '下载中',
    downloaded: '已下载',
    downloadFailed: '下载失败',
    downloadPaused: '下载暂停',
    
    // Error Messages
    videoNotFound: '未找到视频',
    networkError: '网络错误',
    playbackError: '播放错误',
    subscriptionRequired: '需要订阅',
    
    // Social Features
    watchParty: '观影派对',
    shareWithFriends: '与朋友分享',
    rateThisVideo: '为此视频评分',
    reportContent: '举报内容',
  },
  
  // Add more languages as needed
  es: {
    home: 'Inicio',
    explore: 'Explorar',
    profile: 'Perfil',
    rewards: 'Recompensas',
    settings: 'Configuración',
    history: 'Historial',
    downloads: 'Descargas',
    wallet: 'Billetera',
    play: 'Reproducir',
    pause: 'Pausar',
    stop: 'Detener',
    like: 'Me gusta',
    share: 'Compartir',
    download: 'Descargar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    fullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    mute: 'Silenciar',
    unmute: 'Activar sonido',
    subtitles: 'Subtítulos',
    quality: 'Calidad',
    speed: 'Velocidad',
    nextEpisode: 'Siguiente episodio',
    previousEpisode: 'Episodio anterior',
    whatsnew: 'Novedades',
    favourite: 'Favoritos',
    genre: 'Género',
    top1: 'Top 1',
    top2: 'Top 2',
    top3: 'Top 3',
    drama: 'Drama',
    comedy: 'Comedia',
    action: 'Acción',
    romance: 'Romance',
    thriller: 'Thriller',
    horror: 'Terror',
    scifi: 'Ciencia ficción',
    fantasy: 'Fantasía',
    documentary: 'Documental',
    animation: 'Animación',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    logout: 'Cerrar sesión',
    forgotPassword: 'Olvidé mi contraseña',
    resetPassword: 'Restablecer contraseña',
    account: 'Cuenta',
    subscription: 'Suscripción',
    premium: 'Premium',
    free: 'Gratis',
    notifications: 'Notificaciones',
    newEpisode: 'Nuevo episodio',
    dailyReward: 'Recompensa diaria',
    watchReminder: 'Recordatorio de visualización',
    subscriptionExpiry: 'Vencimiento de suscripción',
    coins: 'Monedas',
    earnCoins: 'Ganar monedas',
    dailyCheckIn: 'Check-in diario',
    watchAds: 'Ver anuncios',
    inviteFriends: 'Invitar amigos',
    levelUp: 'Subir de nivel',
    achievement: 'Logro',
    seconds: 'segundos',
    minutes: 'minutos',
    hours: 'horas',
    days: 'días',
    weeks: 'semanas',
    months: 'meses',
    years: 'años',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    noConnection: 'Sin conexión a internet',
    tryAgain: 'Intentar de nuevo',
    basicPlan: 'Plan básico',
    premiumPlan: 'Plan premium',
    vipPlan: 'Plan VIP',
    watchHistory: 'Historial de visualización',
    continueWatching: 'Continuar viendo',
    recentlyWatched: 'Visto recientemente',
    downloading: 'Descargando',
    downloaded: 'Descargado',
    downloadFailed: 'Error de descarga',
    downloadPaused: 'Descarga pausada',
    videoNotFound: 'Video no encontrado',
    networkError: 'Error de red',
    playbackError: 'Error de reproducción',
    subscriptionRequired: 'Suscripción requerida',
    watchParty: 'Fiesta de visualización',
    shareWithFriends: 'Compartir con amigos',
    rateThisVideo: 'Calificar este video',
    reportContent: 'Reportar contenido',
  },
  
  // Add placeholder translations for other languages
  hi: {} as Translation,
  ja: {} as Translation,
  fr: {} as Translation,
  de: {} as Translation,
  pt: {} as Translation,
  ar: {} as Translation,
};

class LocalizationService {
  private currentLanguage: SupportedLanguage = 'en';
  
  setLanguage(language: SupportedLanguage) {
    this.currentLanguage = language;
  }
  
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }
  
  translate(key: keyof Translation, fallback?: string): string {
    const translation = translations[this.currentLanguage]?.[key];
    if (translation) {
      return translation;
    }
    
    // Fallback to English if translation doesn't exist
    const englishTranslation = translations.en[key];
    if (englishTranslation) {
      return englishTranslation;
    }
    
    // Final fallback
    return fallback || key;
  }
  
  // Shorthand method
  t = (key: keyof Translation, fallback?: string) => this.translate(key, fallback);
  
  // Format time with localized units
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}${this.t('hours')[0]} ${minutes}${this.t('minutes')[0]}`;
    } else if (minutes > 0) {
      return `${minutes}${this.t('minutes')[0]} ${remainingSeconds}${this.t('seconds')[0]}`;
    } else {
      return `${remainingSeconds}${this.t('seconds')[0]}`;
    }
  }
  
  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} ${this.t('days')} ago`;
    } else if (hours > 0) {
      return `${hours} ${this.t('hours')} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${this.t('minutes')} ago`;
    } else {
      return `${seconds} ${this.t('seconds')} ago`;
    }
  }
  
  // Get language display name
  getLanguageDisplayName(code: SupportedLanguage): string {
    const languageNames: Record<SupportedLanguage, string> = {
      en: 'English',
      ko: '한국어',
      zh: '中文',
      es: 'Español',
      hi: 'हिंदी',
      ja: '日本語',
      fr: 'Français',
      de: 'Deutsch',
      pt: 'Português',
      ar: 'العربية',
    };
    
    return languageNames[code] || code;
  }
  
  // Get RTL languages
  isRTL(): boolean {
    return this.currentLanguage === 'ar';
  }
  
  // Get supported languages
  getSupportedLanguages(): Array<{ code: SupportedLanguage; name: string }> {
    return Object.keys(translations).map(code => ({
      code: code as SupportedLanguage,
      name: this.getLanguageDisplayName(code as SupportedLanguage),
    }));
  }
}

export const localizationService = new LocalizationService();
export const t = localizationService.translate.bind(localizationService);
