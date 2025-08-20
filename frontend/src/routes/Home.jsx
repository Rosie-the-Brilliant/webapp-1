
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import { fetchPosts, createPostWithWordCheck } from '../api/posts';
import WordCounter from '../components/WordCounter';

function Home() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [LLMcontent, setLLMContent] = useState('')
  const [searchCount, setSearchCount] = useState(0)
  const [showSearchInfo, setShowSearchInfo] = useState(false)
  const [loading, setLoading] = useState(false);

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

  // handle llm posting
  const createLLMPost = async () => {
    setLoading(true);
    setLLMContent(""); // clear old post

    try {
      const res = await fetch("http://127.0.0.1:5000/ai_post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: "Write a shower thought" }), // can make this dynamic later
      });

      const data = await res.json();
      setLLMContent(data.content);
      if (!data){
        setLLMContent("⚠️ Failed to generate post. Please try again.");
        console.log("Error generating post:", data);
      }
    } catch (err) {
      console.error("Error creating LLM post:", err);
      setLLMContent("⚠️ Failed to generate post.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fullscreen-center">
      <Container className="p-4 py-5 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4 text-center">Carpe Diem!</h1>
        <Col xs={4} className="mt-4">
          <Button onClick={createLLMPost} disabled={loading}>
            {loading ? "Generating..." : "Create LLM Post"}
          </Button>

          {LLMcontent && (
            <Card className="mt-4 p-3">
              <h4>Generated Post:</h4>
              <p>{LLMcontent}</p>
            </Card>
          )}
        </Col>

        <Col xs={8} className="mt-4">

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
        </Col>
      </Container>

    </div>
  )
}

export default Home;
// This component serves as the main page for the application, allowing users to create posts and view