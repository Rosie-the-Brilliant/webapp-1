import { Card } from 'react-bootstrap';

export default function PostCard({ post }) {
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Text>{post.content}</Card.Text>
                <small className="text-muted">Posted: {post.created_at}</small>
            </Card.Body>
        </Card>
    );
}