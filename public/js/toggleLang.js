document.addEventListener('DOMContentLoaded', function () {
  const toggleLangCheckbox = document.getElementById('toggleLang');
  if (toggleLangCheckbox) {
    toggleLangCheckbox.addEventListener('change', function () {
      const selectedLang = this.checked ? 'vi' : 'en';
      window.location.href = `/change-lang/${selectedLang}`;
    });
  } else {
    // console.error('Toggle language checkbox not found');
  }
});
