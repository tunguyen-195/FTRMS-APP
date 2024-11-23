document.addEventListener('DOMContentLoaded', function () {
  const toggleLangCheckbox = document.getElementById('toggleLang');
  if (toggleLangCheckbox) {
    toggleLangCheckbox.addEventListener('change', function () {
      const selectedLang = this.checked ? 'vi' : 'en';
      // console.log(`Switching language to: ${selectedLang}`);
      window.location.href = `/change-lang/${selectedLang}`;
    });
  } else {
    // console.error('Toggle language checkbox not found');
  }
});
