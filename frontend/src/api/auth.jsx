// This file contains the API functions for authentication in the frontend React application.

export const handleLogin = async (e) => {
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

export const fetchUser = async (user_id) => {
  const res = await fetch(`http://127.0.0.1:5000/users/${user_id}`, {
    method: 'GET', 
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch user data');
  }
  return await res.json();
};

export const fetchUserPosts = async (user_id) => {
  const res = await fetch(`http://127.0.0.1:5000/users/${user_id}/posts`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch user posts');
  }
  return await res.json();
};