// This file contains the API functions for authentication in the frontend React application.

const handleLogin = async (e) => {
  e.preventDefault();
  const res = await fetch('http://127.0.0.1:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (res.ok) {
    // Save token or set logged-in state
  } else {
    // Show error
  }
};