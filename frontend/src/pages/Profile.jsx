import { useParams } from "react-router-dom";
import { useState, useEffect, use } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import PostCard from "../components/PostCard";
import { fetchUser, fetchUserPosts } from "../api/auth";


function Profile() {
    const { user_id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    // Load user + posts
    useEffect(() => {
        const loadProfile = async () => {
            try {
                // Fetch user info (stub for now — replace with real API later)
                const user = await fetchUser(user_id);
                setUser(user);

                // Fetch posts from your backend
                const data = await fetchUserPosts(user_id);
                setPosts(data);
            } catch (err) {
                console.error("Error loading profile:", err);
            }
        };
        loadProfile();
    }, [user_id]);

    if (!user) return <p>Loading profile...</p>;

    return (
    <div className="fullscreen-center">
        <Container className="">
            <Row>
                {/* User Info */}
                <Col md={5} className="">
                    <h2 className="mb-4">{user.name}'s Profile</h2>
                    <Card className="p-3 mb-4">
                        <Card.Img
                            variant="top"
                            src="https://via.placeholder.com/150"
                            className="rounded-circle mx-auto d-block"
                            style={{ width: "120px", height: "120px" }}
                        />
                        <Card.Body className="text-center">
                            <h3>{user.name}</h3>
                            <p className="text-muted">{user.bio}</p>
                            <p>Joined {user.joined}</p>
                            <Row className="justify-content-center">
                                <Col xs="auto">
                                    <strong>{user.followers}</strong> Followers
                                </Col>
                                <Col xs="auto">
                                    <strong>{user.following}</strong> Following
                                </Col>
                            </Row>
                            <Button variant="primary" className="mt-3">
                                Edit Profile
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* User’s Posts */}
                <Col md={7} className="">
                    <h4 className="mb-3">{user.name}'s Posts</h4>
                    {posts.length === 0 ? (
                        <p>No posts yet.</p>
                    ) : (
                        posts.map((post) => <PostCard key={post.id} post={post} />)
                    )}
                </Col>
            </Row>
        </Container>
        </div>
    );
}

export default Profile;
