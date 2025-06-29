// Gestion page paiement

window.addEventListener('DOMContentLoaded', () => {
  const pointsSpan = document.getElementById('points');
  const withdrawForm = document.getElementById('withdrawForm');
  const message = document.getElementById('message');

  function updatePoints() {
    pointsSpan.textContent = window.WatchEarn.getPoints();
  }

  updatePoints();

  withdrawForm.addEventListener('submit', e => {
    e.preventDefault();
    const amount = Number(document.getElementById('amount').value);
    const currentPoints = window.WatchEarn.getPoints();

    if(amount > currentPoints) {
      message.textContent = "Tu n'as pas assez de points pour ce retrait.";
      message.style.color = "red";
      return;
    }

    if(amount < 100) {
      message.textContent = "Le montant minimum de retrait est de 100 points.";
      message.style.color = "red";
      return;
    }

    // Simule la demande de retrait : on retire les points
    window.WatchEarn.setPoints(currentPoints - amount);
    updatePoints();
    message.style.color = "#0f9";
    message.textContent = `Demande de retrait de ${amount} points prise en compte.`;
    withdrawForm.reset();
  });
});
