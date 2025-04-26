window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Musique Accueil
const music = document.getElementById('background-music');
const toggleButton = document.getElementById('toggle-music');

function toggleMusic() {
  if (music.paused) {
    music.play();
    toggleButton.textContent = "⏸ Pause musique";
  } else {
    music.pause();
    toggleButton.textContent = "▶ Musique";
  }
}

function setVolume(volume) {
  music.volume = volume;
}

// Musique Leaderboard
const leaderboardMusic = document.getElementById('leaderboard-music');
const toggleLeaderboardButton = document.getElementById('toggle-leaderboard-music');

function toggleLeaderboardMusic() {
  if (leaderboardMusic.paused) {
    leaderboardMusic.play();
    toggleLeaderboardButton.textContent = "⏸ Pause musique Leaderboard";
  } else {
    leaderboardMusic.pause();
    toggleLeaderboardButton.textContent = "▶ Musique Leaderboard";
  }
}

function setLeaderboardVolume(volume) {
  leaderboardMusic.volume = volume;
}

// Timer jusqu'à 19h
let alertShown = false;

function updateTimer() {
  const now = new Date();
  const target = new Date();
  target.setHours(19, 0, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1);
    alertShown = false;
  }

  const diff = target - now;
  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

  document.getElementById("timer").textContent = `${hours}:${minutes}:${seconds}`;

  if (diff <= 0 && !alertShown) {
    alertShown = true;
    confettiExplosion();
  }
}

function confettiExplosion() {
  alert("TOTS TIME 🎉 !");
  // Tu peux ajouter une animation de confettis ici
}

updateTimer();
setInterval(updateTimer, 1000);

// Chargement des compteurs joueurs
async function loadCounters() {
  const response = await fetch('compteurs.json');
  const data = await response.json();
  document.getElementById('counter-skayy').textContent = data.skayy;
  document.getElementById('counter-nayloxx').textContent = data.nayloxx;
  document.getElementById('counter-zartex').textContent = data.zartex;

  // Trophées
  for (const player of ['skayy', 'nayloxx', 'zartex']) {
    const trophy = document.getElementById(`trophy-${player}`);
    if (data[player] > 0 && data[player] % 5 === 0) {
      trophy.style.display = 'block';
    } else {
      trophy.style.display = 'none';
    }
  }
}

// Chargement du leaderboard
async function loadLeaderboard() {
  const response = await fetch('compteurs.json');
  const data = await response.json();
  const players = [
    { name: 'Skayy', score: data.skayy },
    { name: 'Nayloxx', score: data.nayloxx },
    { name: 'Zartex', score: data.zartex }
  ];
  players.sort((a, b) => b.score - a.score);

  let html = '';
  players.forEach((player, index) => {
    let medal = '';
    if (index === 0) medal = '👑 1er';
    else if (index === 1) medal = '🥈 2e';
    else if (index === 2) medal = '🥉 3e';

    html += `
      <div class="leaderboard-entry">
        <div class="player-name">${medal} - ${player.name}</div>
        <div class="score">TOTS packés : ${player.score}</div>
      </div>
    `;
  });

  document.getElementById('leaderboard').innerHTML = html;
}

// Ajout TOTS manuellement (local uniquement)
const counters = { skayy: 0, nayloxx: 0, zartex: 0 };

function addTots(player) {
  counters[player]++;
  document.getElementById(`counter-${player}`).textContent = counters[player];

  if (counters[player] % 5 === 0) {
    document.getElementById(`trophy-${player}`).style.display = 'block';
  }
}

function resetAll() {
  for (const player in counters) {
    counters[player] = 0;
    document.getElementById(`counter-${player}`).textContent = counters[player];
    document.getElementById(`trophy-${player}`).style.display = 'none';
  }
}

// Chargement Collection TOTS
const cards = [
  // Liste des cartes (chemins des images) triée par note décroissante
  "25-151226387.png", // 97 Dembélé
  "25-84131777.png", // 96
  "25-134449160.png", // 95
  "25-84144524.png", // 95
  "25-67348244.png", // 94
  "25-50557511.png", // 94
  "25-100908024.png", // 94
  "25-100890612.png", // 93
  "25-100896958.png", // 93
  "25-117706410.png", // 93
  "25-67336214.png", // 93
  "25-117705164.png", // 92
  "25-67381698.png", // 92
  "25-84164299.png", // 91
  "25-84155573.png", // 91
  "25-67328547.png", // 90
  "25-134461358.png", // 90
  "25-100871161.png", // 90
  "25-67364117.png", // 89
  "25-84138225.png", // 89
  "25-50587844.png" // 89
];

const cardsContainer = document.getElementById('cards-container');
const packCounter = document.getElementById('pack-counter');

function loadCollection() {
  cards.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-item';
    const img = document.createElement('img');
    img.src = `cards/${card}`;
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `card-${index}`;

    if (localStorage.getItem(`card-${index}`) === "checked") {
      checkbox.checked = true;
      cardDiv.classList.add('card-packed');
    }

    checkbox.addEventListener('change', function() {
      if (checkbox.checked) {
        localStorage.setItem(`card-${index}`, "checked");
        cardDiv.classList.add('card-packed');
      } else {
        localStorage.removeItem(`card-${index}`);
        cardDiv.classList.remove('card-packed');
      }
      updatePackCounter();
    });

    checkboxContainer.appendChild(checkbox);
    cardDiv.appendChild(img);
    cardDiv.appendChild(checkboxContainer);
    cardsContainer.appendChild(cardDiv);
  });

  updatePackCounter();
}

function updatePackCounter() {
  const total = cards.length;
  const packed = document.querySelectorAll('.card-packed').length;
  packCounter.textContent = `${packed} / ${total} cartes packées`;
}

// Lancer les bons chargements selon la page
if (document.getElementById('timer')) {
  loadCounters();
  loadCollection();
} else if (document.getElementById('leaderboard')) {
  loadLeaderboard();
}
