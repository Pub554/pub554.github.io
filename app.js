// Gestion commune points / niveaux et stockage local

const LEVELS = [
  { name: "Débutant", minPoints: 0, bonus: "Accès de base" },
  { name: "Apprenti", minPoints: 100, bonus: "Bonus +5% points" },
  { name: "Intermédiaire", minPoints: 300, bonus: "Bonus +10% points" },
  { name: "Avancé", minPoints: 700, bonus: "Bonus +15% points" },
  { name: "Expert", minPoints: 1200, bonus: "Bonus +20% points" },
  { name: "Maître", minPoints: 2000, bonus: "Bonus +30% points" }
];

function getPoints() {
  return Number(localStorage.getItem('points')) || 0;
}

function setPoints(val) {
  localStorage.setItem('points', val);
}

function getVideosWatched() {
  return Number(localStorage.getItem('videosWatched')) || 0;
}

function setVideosWatched(val) {
  localStorage.setItem('videosWatched', val);
}

function getLevel(points) {
  let currentLevel = LEVELS[0];
  for(let i=LEVELS.length-1; i>=0; i--) {
    if(points >= LEVELS[i].minPoints) {
      currentLevel = LEVELS[i];
      break;
    }
  }
  return currentLevel;
}

function calculateBonusMultiplier(level) {
  // Bonus en % de points supplémentaires
  switch(level.name) {
    case "Apprenti": return 1.05;
    case "Intermédiaire": return 1.10;
    case "Avancé": return 1.15;
    case "Expert": return 1.20;
    case "Maître": return 1.30;
    default: return 1.0;
  }
}

// Exporté pour pages spécifiques
window.WatchEarn = {
  getPoints,
  setPoints,
  getVideosWatched,
  setVideosWatched,
  getLevel,
  calculateBonusMultiplier,
  LEVELS
};
