import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Form, Button, Card } from 'react-bootstrap'

function App() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [searchCount, setSearchCount] = useState(0)
  const [searchWord, setSearchWord] = useState('shower');
  const [showSearchInfo, setShowSearchInfo] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error fetching posts:', err))
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()
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

    // Check if submitted content includes searchWord (case-insensitive)
    if (content.toLowerCase().includes(searchWord.toLowerCase())) {
      fetch(`http://127.0.0.1:5000/count-word?word=${encodeURIComponent(searchWord)}`)
        .then(res => res.json())
        .then(data => setSearchCount(data.search_count || 0))
        .catch(console.error)
        setShowSearchInfo(true)
    }
  }

  return (
    <div className="fullscreen-center">
      <Container className="p-4 py-5 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4 text-center">Carpe Diem!</h1>
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group controlId="postContent">
            <Form.Control
              as="textarea"
              size="lg"
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What's on your mind?"
              required
            />
          </Form.Group>
          <Button type="submit" className="mt-2 d-block w-100 mx-auto">Post</Button>
        </Form>

        {/* Show how many times search word was mentioned */}
        {showSearchInfo && (
          <div className="text-center mb-4">
            <p>
              The CS kids have <strong>{searchWord}ed</strong> <strong>{searchCount}</strong> times! Huzzah!
            </p>
            <img
              src="https://i0.wp.com/www.onegreenplanet.org/wp-conten…erstock-558636937-e1708704946288.jpg?w=1600&ssl=1https://www.onegreenplanet.org/wp-content/uploads/2024/02/shutterstock-558636937-e1708704946288.jpg"
              alt="Shower cat"
              style={{ maxWidth: '100%', marginTop: '10px' }}
            />
          </div>
        )}

        <div>
          {posts.length === 0 ? (
            <p>No posts yet. Be the first!</p>
          ) : (
            posts.map(post => (
              <Card key={post.id} className="mb-3">
                <Card.Body>
                  <Card.Text>{post.content}</Card.Text>
                  <small className="text-muted">Post #{post.id}</small>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </Container>
    </div>
  )
}

export default App