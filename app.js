// 1. Firebase Կարգավորումներ
const firebaseConfig = {
  apiKey: "AIzaSyAdiE2cdG0kSsV77d3RZRrw8BHsm_304nM",
  authDomain: "arm-tap-game.firebaseapp.com",
  databaseURL: "https://arm-tap-game-default-rtdb.firebaseio.com",
  projectId: "arm-tap-game",
  storageBucket: "arm-tap-game.firebasestorage.app",
  messagingSenderId: "980224531247",
  appId: "1:980224531247:web:856928918c23c778c19fda",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const ARM_JETTON_CONTRACT = "EQB7bzPDOh29TLaZn-GG6Gbtn0nggQIZ2EwZ4gH5W3HwCqAB";
const VIP_MIN_ARM_HOLD = 100000000;
const ADMIN_ID = 6316594244;

// 2. Telegram WebApp & Օգտատիրոջ տվյալներ
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
  tg.expand();
  tg.ready();
}

const user = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : {
  id: 999999,
  first_name: "Թեստային Օգտատեր",
  language_code: "hy"
};

let currentLang = user.language_code === 'ru' ? 'ru' : (user.language_code === 'en' ? 'en' : 'hy');

let userData = {
  balance: 0,
  energy: 1000,
  maxEnergy: 1000,
  tapPower: 1,
  isVip: false,
  walletAddress: "",
  lang: currentLang,
  completedTasks: {}
};

// Translations Object
const translations = {
  hy: {
    levelTitle: "Մաստեր (Մակարդակ 4)",
    welcomeText: "Ողջույն! Թափ արա և հավաքիր ARM",
    vipBadge: "👑 VIP HOLDER (+2x Tap Power)",
    energyHeader: "⚡ ԷՆԵՐԳԻԱ",
    dailyReward: "🎁 Օրական պարգև",
    day: "Օր",
    boostsTitle: "⚡ Բուստերներ & VIP",
    buyStonTitle: "👑 Buy ARM on STON.fi",
    buyStonDesc: "Գնիր 100M+ ARM DEX-ում և ստացիր **2x Tap Power** + VIP Status անմիջապես!",
    buyStonBtn: "🛒 Գնել STON.fi-ում",
    multitapDesc: "+1 միավոր ամեն թափի համար",
    energyDesc: "+500 առավելագույն էներգիա",
    upgradeBtn: "Բարձրացնել",
    tasksTitle: "🎯 Առաջադրանքներ",
    vipTaskTitle: "💎 VIP Holder Task",
    vipTaskDesc: "Պահիր 100,000,000 ARM քո TON դրամապանակում",
    checkBalBtn: "Ստուգել հաշվեկշիռը",
    tgChannelTitle: "📢 Միացիր Telegram ալիքին",
    tgChannelDesc: "Պարգև՝ +5,000 ARM",
    doTaskBtn: "Կատարել",
    walletTitle: "💎 Քսակ (TON Connect)",
    walletDesc: "Միացրու քո TON քսակը ARM Jetton-ների հաշվեկշիռը ստուգելու համար։",
    onchainTitle: "💼 On-Chain ARM Հաշվեկշիռ",
    stdHolder: "Ստանդարտ Հոլդեր",
    rankTitle: "🏆 Լավագույն խաղացողներ",
    loading: "Բեռնվում է...",
    profileTitle: "👤 Պրոֆիլ",
    selectLang: "⚙️ Լեզու / Язык / Language",
    navTap: "Թափ",
    navBoosts: "Բուստեր",
    navTasks: "Առաջադրանք",
    navWallet: "Քսակ",
    navRank: "Ռանգ",
    navProfile: "Պրոֆիլ",
    profileName: "Անուն: ",
    profileVip: "VIP Կարգավիճակ: ",
    vipYes: "✅ Ակտիվ (2x Boost)",
    vipNo: "❌ Ոչ"
  },
  ru: {
    levelTitle: "Мастер (Уровень 4)",
    welcomeText: "Привет! Тапай и собирай ARM",
    vipBadge: "👑 VIP HOLDER (+2x Тап)",
    energyHeader: "⚡ ЭНЕРГИЯ",
    dailyReward: "🎁 Ежедневная награда",
    day: "День",
    boostsTitle: "⚡ Бусты и VIP",
    buyStonTitle: "👑 Купить ARM на STON.fi",
    buyStonDesc: "Купи 100M+ ARM на DEX и получи **2x Тап** + VIP Статус!",
    buyStonBtn: "🛒 Купить на STON.fi",
    multitapDesc: "+1 к силе тапа",
    energyDesc: "+500 к максимальной энергии",
    upgradeBtn: "Прокачать",
    tasksTitle: "🎯 Задания",
    vipTaskTitle: "💎 VIP Холдер Задание",
    vipTaskDesc: "Держи 100,000,000 ARM на TON кошельке",
    checkBalBtn: "Проверить баланс",
    tgChannelTitle: "📢 Подпишись на Telegram канал",
    tgChannelDesc: "Награда: +5,000 ARM",
    doTaskBtn: "Выполнить",
    walletTitle: "💎 Кошелек (TON Connect)",
    walletDesc: "Подключи TON кошелек для проверки ARM баланса.",
    onchainTitle: "💼 On-Chain ARM Баланс",
    stdHolder: "Стандартный Холдер",
    rankTitle: "🏆 Топ игроков",
    loading: "Загрузка...",
    profileTitle: "👤 Профиль",
    selectLang: "⚙️ Язык / Language",
    navTap: "Тап",
    navBoosts: "Бусты",
    navTasks: "Задания",
    navWallet: "Кошелек",
    navRank: "Ранг",
    navProfile: "Профиль",
    profileName: "Имя: ",
    profileVip: "VIP Статус: ",
    vipYes: "✅ Активен (2x Буст)",
    vipNo: "❌ Нет"
  },
  en: {
    levelTitle: "Master (Level 4)",
    welcomeText: "Welcome! Tap and earn ARM",
    vipBadge: "👑 VIP HOLDER (+2x Tap Power)",
    energyHeader: "⚡ ENERGY",
    dailyReward: "🎁 Daily Reward",
    day: "Day",
    boostsTitle: "⚡ Boosts & VIP",
    buyStonTitle: "👑 Buy ARM on STON.fi",
    buyStonDesc: "Buy 100M+ ARM on DEX and get **2x Tap Power** + VIP Status!",
    buyStonBtn: "🛒 Buy on STON.fi",
    multitapDesc: "+1 point per tap",
    energyDesc: "+500 max energy limit",
    upgradeBtn: "Upgrade",
    tasksTitle: "🎯 Tasks",
    vipTaskTitle: "💎 VIP Holder Task",
    vipTaskDesc: "Hold 100,000,000 ARM in your TON wallet",
    checkBalBtn: "Check Balance",
    tgChannelTitle: "📢 Join Telegram Channel",
    tgChannelDesc: "Reward: +5,000 ARM",
    doTaskBtn: "Complete",
    walletTitle: "💎 Wallet (TON Connect)",
    walletDesc: "Connect your TON wallet to verify ARM Jetton balance.",
    onchainTitle: "💼 On-Chain ARM Balance",
    stdHolder: "Standard Holder",
    rankTitle: "🏆 Leaderboard",
    loading: "Loading...",
    profileTitle: "👤 Profile",
    selectLang: "⚙️ Language",
    navTap: "Tap",
    navBoosts: "Boosts",
    navTasks: "Tasks",
    navWallet: "Wallet",
    navRank: "Rank",
    navProfile: "Profile",
    profileName: "Name: ",
    profileVip: "VIP Status: ",
    vipYes: "✅ Active (2x Boost)",
    vipNo: "❌ No"
  }
};

const userRef = db.ref('users/' + user.id);

// 3. Բեռնում ենք տվյալները Firebase-ից
userRef.on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    userData = Object.assign(userData, data);
    if (userData.lang) currentLang = userData.lang;
  } else {
    userRef.set({
      name: user.first_name,
      balance: 0,
      energy: 1000,
      maxEnergy: 1000,
      tapPower: 1,
      isVip: false,
      lang: currentLang
    });
  }
  applyTranslations();
  updateUI();
});

function changeLanguage(langKey) {
  if (translations[langKey]) {
    currentLang = langKey;
    userData.lang = langKey;
    userRef.update({ lang: langKey });
    applyTranslations();
    updateUI();
  }
}

function applyTranslations() {
  const langObj = translations[currentLang] || translations.hy;

  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (langObj[key]) {
      elem.innerText = langObj[key];
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('lang-' + currentLang);
  if (activeBtn) activeBtn.classList.add('active');
}

function updateUI() {
  const langObj = translations[currentLang] || translations.hy;

  document.getElementById('balance-display').innerText = userData.balance.toLocaleString();
  document.getElementById('energy-current').innerText = userData.energy;
  document.getElementById('energy-max').innerText = userData.maxEnergy;
  
  const energyPercent = (userData.energy / userData.maxEnergy) * 100;
  document.getElementById('energy-bar').style.width = energyPercent + '%';

  document.getElementById('profile-name').innerText = langObj.profileName + user.first_name;
  document.getElementById('profile-id').innerText = "ID: " + user.id;
  document.getElementById('profile-vip').innerText = langObj.profileVip + (userData.isVip ? langObj.vipYes : langObj.vipNo);

  const vipBadge = document.getElementById('vip-badge');
  if (userData.isVip) {
    vipBadge.style.display = 'block';
  } else {
    vipBadge.style.display = 'none';
  }

  // Ադմին Կոճակի ցուցադրում
  if (user.id === ADMIN_ID) {
    document.getElementById('admin-nav-item').style.display = 'flex';
  }
}

// 4. Tap Տրամաբանություն
document.getElementById('tap-btn').addEventListener('click', () => {
  const effectivePower = userData.isVip ? userData.tapPower * 2 : userData.tapPower;

  if (userData.energy >= effectivePower) {
    userData.balance += effectivePower;
    userData.energy -= effectivePower;
    
    updateUI();

    userRef.update({
      balance: userData.balance,
      energy: userData.energy
    });
  }
});

// Էներգիայի վերականգնում
setInterval(() => {
  if (userData.energy < userData.maxEnergy) {
    userData.energy = Math.min(userData.maxEnergy, userData.energy + 1);
    updateUI();
    userRef.child('energy').set(userData.energy);
  }
}, 1000);

// 5. Նավիգացիա
function switchTab(screenId, element) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
  if (element) element.classList.add('active');
}

// 6. TON Connect Միացում
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: window.location.origin + '/tonconnect-manifest.json',
  buttonRootId: 'ton-connect-button'
});

tonConnectUI.onStatusChange(async (wallet) => {
  if (wallet) {
    userData.walletAddress = wallet.account.address;
    userRef.update({ walletAddress: userData.walletAddress });
    await checkWalletArmBalance();
  } else {
    userData.walletAddress = "";
    userData.isVip = false;
    userRef.update({ walletAddress: "", isVip: false });
    document.getElementById('wallet-arm-info').style.display = 'none';
    updateUI();
  }
});

// 7. TON API Ստուգում
async function checkWalletArmBalance() {
  if (!userData.walletAddress) {
    alert(currentLang === 'ru' ? "Сначала подключите TON кошелек" : "Խնդրում ենք նախ միացնել TON դրամապանակը:");
    return;
  }

  try {
    const response = await fetch(`https://tonapi.io/v2/accounts/${userData.walletAddress}/jettons`);
    const data = await response.json();
    
    let armBalance = 0;

    if (data && data.balances) {
      const armJetton = data.balances.find(j => j.jetton.address === ARM_JETTON_CONTRACT);
      if (armJetton) {
        armBalance = parseInt(armJetton.balance) / Math.pow(10, armJetton.jetton.decimals || 9);
      }
    }

    document.getElementById('wallet-arm-info').style.display = 'block';
    document.getElementById('onchain-arm-balance').innerText = armBalance.toLocaleString() + " ARM";

    if (armBalance >= VIP_MIN_ARM_HOLD) {
      userData.isVip = true;
      document.getElementById('holder-status-text').innerText = "👑 VIP HOLDER (2x Boost)";
      document.getElementById('holder-status-text').style.color = "#f59e0b";
      alert("Շնորհավորում ենք! Դուք ունեք 100M+ ARM և ստացաք VIP Status + 2x Tap!");
    } else {
      userData.isVip = false;
      document.getElementById('holder-status-text').innerText = translations[currentLang].stdHolder;
    }

    userRef.update({ isVip: userData.isVip });
    updateUI();

  } catch (error) {
    console.error("Error fetching ARM balance:", error);
  }
}

// 8. Ադմին Ֆունկցիա
function adminAddTokens() {
  const targetId = document.getElementById('admin-user-id').value;
  const amount = parseInt(document.getElementById('admin-amount').value);
  
  if (targetId && amount) {
    db.ref('users/' + targetId + '/balance').transaction((curr) => (curr || 0) + amount);
    alert('ARM տոկենները ավելացվեցին:');
  }
}
