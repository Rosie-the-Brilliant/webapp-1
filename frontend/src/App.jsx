import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')

  // Fetch posts from Flask backend
  useEffect(() => {
    fetch('http://localhost:5000/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error fetching posts:', err))
  }, [])

  // Add a new post

  const handleSubmit = async (e) => {
  e.preventDefault()
  console.log('Submitting:', content)
  await fetch('http://127.0.0.1:5000/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  setContent('')
  fetch('http://127.0.0.1:5000/posts')
    .then(res => res.json())
    .then(data => setPosts(data))
    .catch(err => console.error('Error fetching posts:', err))
}

  return (
    <div>
      <h1>Carpe Diem!</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        <button type="submit">Post</button>
      </form>
      <div>
        {posts.length === 0 ? (
          <p>No posts yet. Be the first!</p>
        ) : (
          posts.map(post => (
            <div key={post.id}>
              <hr></hr>
              <p>{post.content}</p>
              <small>Post #{post.id}</small>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App