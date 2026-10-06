// 1. Firebase Կարգավորումներ (Տեղադրիր քո Firebase տվյալները)
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

// 2. Telegram WebApp & Օգտատիրոջ տվյալներ
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) tg.expand();

const ADMIN_ID = 123456789; // Փոխարինիր քո Telegram ID-ով

const user = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : {
  id: 999999,
  first_name: "Թեստային Օգտատեր"
};

let userData = {
  balance: 0,
  energy: 1000,
  maxEnergy: 1000,
  tapPower: 1,
  completedTasks: {}
};

const userRef = db.ref('users/' + user.id);

// 3. Բեռնում ենք տվյալները Firebase-ից
userRef.on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    userData = Object.assign(userData, data);
  } else {
    userRef.set({
      name: user.first_name,
      balance: 0,
      energy: 1000,
      maxEnergy: 1000,
      tapPower: 1
    });
  }
  updateUI();
});

function updateUI() {
  document.getElementById('balance-display').innerText = userData.balance.toLocaleString();
  document.getElementById('energy-current').innerText = userData.energy;
  document.getElementById('energy-max').innerText = userData.maxEnergy;
  
  const energyPercent = (userData.energy / userData.maxEnergy) * 100;
  document.getElementById('energy-bar').style.width = energyPercent + '%';

  document.getElementById('profile-name').innerText = "Անուն: " + user.first_name;
  document.getElementById('profile-id').innerText = "ID: " + user.id;

  // Եթե ադմին է, ցույց տալ ադմին կոճակը
  if (user.id === ADMIN_ID) {
    document.getElementById('screen-admin').classList.add('admin-enabled');
  }
}

// 4. Tap (Թափ) Տրամաբանություն
document.getElementById('tap-btn').addEventListener('click', () => {
  if (userData.energy >= userData.tapPower) {
    userData.balance += userData.tapPower;
    userData.energy -= userData.tapPower;
    
    updateUI();

    // Պահպանում Firebase-ում
    userRef.update({
      balance: userData.balance,
      energy: userData.energy
    });
  }
});

// Էներգիայի վերականգնում ամեն վայրկյան
setInterval(() => {
  if (userData.energy < userData.maxEnergy) {
    userData.energy = Math.min(userData.maxEnergy, userData.energy + 1);
    updateUI();
    userRef.child('energy').set(userData.energy);
  }
}, 1000);

// 5. Նավիգացիա Էկրանների միջև
function switchTab(screenId, element) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  document.getElementById(screenId).classList.add('active');
  element.classList.add('active');
}

// 6. TON Connect Միացում
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: 'https://arm-tap-game.vercel.app/tonconnect-manifest.json',
  buttonRootId: 'ton-connect-button'
});

// 7. Ադմին Ֆունկցիա
function adminAddTokens() {
  const targetId = document.getElementById('admin-user-id').value;
  const amount = parseInt(document.getElementById('admin-amount').value);
  
  if (targetId && amount) {
    db.ref('users/' + targetId + '/balance').transaction((curr) => (curr || 0) + amount);
    alert('ARM տոկենները ավելացվեցին:');
  }
}
