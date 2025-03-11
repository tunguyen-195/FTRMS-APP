document.addEventListener('DOMContentLoaded', function () {
  const profileForm = document.getElementById('profileForm');

  profileForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(profileForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': data._csrf
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Thông tin cá nhân đã được cập nhật');
        location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
  });
}); 