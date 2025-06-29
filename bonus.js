// Gestion de la page bonus

window.addEventListener('DOMContentLoaded', () => {
  const bonusList = document.getElementById('bonusList');
  const points = window.WatchEarn.getPoints();
  const level = window.WatchEarn.getLevel(points);

  const bonuses = window.WatchEarn.LEVELS.map(lvl => {
    const isActive = lvl.minPoints <= points;
    return `<div style="opacity:${isActive ? 1 : 0.4};">
      <strong>${lvl.name}</strong> : ${lvl.bonus}
    </div>`;
  }).join("");

  bonusList.innerHTML = `<p>Ton niveau actuel : <strong>${level.name}</strong></p>
                         <div>${bonuses}</div>`;
});
