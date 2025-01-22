document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
  
    if (!user) {
      window.location.href = '/login/login.html';
      return;
    }
  
    document.getElementById('firstName').value = user.first_name;
    document.getElementById('lastName').value = user.last_name;
    document.getElementById('email').value = user.email;
  
    document.getElementById('settingsForm').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const updatedUser = {
        first_name: document.getElementById('firstName').value.trim(),
        last_name: document.getElementById('lastName').value.trim(),
      };
  
      try {
        const response = await fetch('/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, ...updatedUser }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert('Profile updated successfully!');
          sessionStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
          window.location.href = '/profile/details.html';
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
  