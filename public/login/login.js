document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save user info in session storage
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('username', `${data.user.first_name} ${data.user.last_name}`);
      alert('Login successful! Redirecting to your profile...');
      window.location.href = '/profile'; // Navigate to the profile page
    } else {
      // Display different error messages
      if (response.status === 404) {
        alert("You haven't registered yet. Please Register!");
        window.location.href = '/register';  // Redirect to register page
      } else if (response.status === 401) {
        alert("Invalid email or password.");
      } else {
        alert(data.message || 'Login failed. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred. Please try again later.');
  }
});
