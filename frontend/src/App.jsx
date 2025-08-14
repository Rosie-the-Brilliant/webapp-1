import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button } from 'react-bootstrap';
import PostCard from './components/PostCard';
import { fetchPosts, createPostWithWordCheck } from './api/posts';
import WordCounter from './components/WordCounter';

function App() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [searchCount, setSearchCount] = useState(0)
  const [showSearchInfo, setShowSearchInfo] = useState(false)

  const searchWord = 'shower';

  //Fetch posts on initial mount
  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };
    loadPosts();
  }, []);


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create post and check for word
    const { data, searchCount, showInfo } = await createPostWithWordCheck(content, searchWord, showSearchInfo);
    setContent('');
    setSearchCount(searchCount);
    setShowSearchInfo(showInfo)

    // Refresh posts list from backend
    const updatedPosts = await fetchPosts();
    setPosts(updatedPosts);
  };

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
        {showSearchInfo && <WordCounter searchWord={searchWord} searchCount={searchCount}></WordCounter>}

        <div>
          {posts.length === 0 ? (
            <p>No posts yet. Be the first!</p>
          ) : (
            posts.map(post => (<PostCard key={post.id} post={post} />))
          )}
        </div>
      </Container>
    </div>
  )
}

export default App