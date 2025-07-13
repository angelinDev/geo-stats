// Test du fonctionnement du thème
// Exécuter ce script dans la console du navigateur pour vérifier le thème

function testTheme() {
  console.log('🔍 Test du thème en cours...');
  
  // Vérifier la classe sur l'élément HTML
  const htmlElement = document.documentElement;
  const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
  
  console.log('🎨 Thème actuel:', currentTheme);
  console.log('📋 Classes sur <html>:', htmlElement.className);
  
  // Vérifier le localStorage
  const savedTheme = localStorage.getItem('theme');
  console.log('💾 Thème sauvegardé:', savedTheme);
  
  // Vérifier le bouton de thème
  const themeButton = document.querySelector('button[aria-label*="Basculer"]');
  if (themeButton) {
    console.log('🔘 Bouton de thème trouvé:', themeButton);
  } else {
    console.log('❌ Bouton de thème non trouvé');
  }
  
  // Vérifier les styles appliqués
  const body = document.body;
  const computedStyle = window.getComputedStyle(body);
  console.log('🎨 Background du body:', computedStyle.backgroundColor);
  console.log('📝 Couleur du texte:', computedStyle.color);
  
  return {
    currentTheme,
    savedTheme,
    hasThemeButton: !!themeButton,
    bodyBg: computedStyle.backgroundColor,
    textColor: computedStyle.color
  };
}

// Fonction pour basculer le thème
function toggleTheme() {
  const themeButton = document.querySelector('button[aria-label*="Basculer"]');
  if (themeButton) {
    themeButton.click();
    console.log('🔄 Thème basculé');
    setTimeout(() => {
      testTheme();
    }, 100);
  } else {
    console.log('❌ Impossible de basculer le thème - bouton non trouvé');
  }
}

console.log('📋 Instructions:');
console.log('- Exécuter testTheme() pour voir l\'état actuel');
console.log('- Exécuter toggleTheme() pour basculer entre les thèmes');
console.log('- Le thème devrait persister après rechargement de la page');
