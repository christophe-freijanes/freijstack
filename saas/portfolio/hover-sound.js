// Petit son de survol pour les boutons vert, jaune, rouge
// Placez ce fichier dans le dossier saas/portfolio/ et ajoutez votre son (ex: hover.mp3) dans le même dossier.


// Sélectionne tous les liens, boutons, et icônes dynamiques
const hoverElements = document.querySelectorAll('a, button, .social-icon, .fa, .fab, .fas');


// Prépare le son (remplacez 'hover.mp3' par le nom de votre fichier audio dans le dossier sound)

let hoverSound;
let audioLoadError = false;
try {
  hoverSound = new Audio('sound/hover.mp3');
  hoverSound.addEventListener('error', () => {
    audioLoadError = true;
    // Suppression de la redirection 403
  });
} catch (e) {
  audioLoadError = true;
  // Suppression de la redirection 403
}

let isPlaying = false;


function playHoverSound() {
  if (!hoverSound || audioLoadError) {
    return;
  }
  if (isPlaying) return;
  try {
    hoverSound.currentTime = 0;
    const playPromise = hoverSound.play();
    isPlaying = true;
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        audioLoadError = true;
        // Suppression de la redirection 403
      });
      playPromise.finally(() => { isPlaying = false; });
    } else {
      isPlaying = false;
    }
  } catch (e) {
    audioLoadError = true;
    // Suppression de la redirection 403
    isPlaying = false;
  }
}

hoverElements.forEach(el => {
  el.addEventListener('mouseenter', playHoverSound);
});
