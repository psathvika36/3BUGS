document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    if (!user) {
      window.location.href = '/login/login.html';
      return;
    }
  
    document.getElementById('firstName').textContent = user.first_name;
    document.getElementById('lastName').textContent = user.last_name;
    document.getElementById('email').textContent = user.email;
  
    document.getElementById('editProfile').addEventListener('click', () => {
      window.location.href = '/profile/settings.html';
    });
  });
  