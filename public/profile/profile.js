document.addEventListener('DOMContentLoaded', async () => {
  const profileIcon = document.getElementById('profileIcon');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const content = document.getElementById('content');
  const backArrow = document.getElementById('backArrow');
  let user = {};

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user', { credentials: 'include' });
      if (response.ok) {
        user = await response.json();
        renderProfile();
      } else {
        alert('Error fetching user data', response.statusText);
        window.location.href = '/login/login.html';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      window.location.href = '/login/login.html';
    }
  };

  const renderProfile = () => {
    content.innerHTML = `
      <h2>User Profile</h2>
      <p>Name: ${user.first_name} ${user.last_name}</p>
      <p>Email: ${user.email}</p>
    `;
  };

  const renderSettings = () => {
    content.innerHTML = `
      <h2>Edit Profile</h2>
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" value="${user.first_name}"><br><br>
      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" value="${user.last_name}"><br><br>
      <label for="email">Email:</label>
      <input type="email" id="email" value="${user.email}"><br><br>
      <button id="saveProfile">Save Changes</button>
    `;
    document.getElementById('saveProfile').addEventListener('click', async () => {
      user.first_name = document.getElementById('firstName').value;
      user.last_name = document.getElementById('lastName').value;
      user.email = document.getElementById('email').value;
      await saveProfileChanges();
      renderProfile();
      backArrow.style.display = 'block';
    });
  };

  const saveProfileChanges = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        alert('Profile updated successfully');
        await fetchUserData();
        renderProfile();
        backArrow.style.display = 'none';
      } else {
        alert('Error updating profile');
      }
    } catch (error) {
      console.error('Error saving profile changes:', error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/logout', { method: 'POST' });
      console.log('Logout response:', response); // Debugging
      if (response.ok) {
        window.location.href = '/login/login.html';
      } else {
        alert('Error logging out');
        
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  profileIcon.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });

  document.getElementById('viewProfile').addEventListener('click', () => {
    dropdownMenu.style.display = 'none';
    renderProfile();
    backArrow.style.display = 'none';
  });

  document.getElementById('viewSettings').addEventListener('click', () => {
    dropdownMenu.style.display = 'none';
    renderSettings();
  });

  document.getElementById('logout').addEventListener('click', logout);

  backArrow.addEventListener('click', () => {
    renderProfile();
    backArrow.style.display = 'none';
  });

  await fetchUserData();
});
