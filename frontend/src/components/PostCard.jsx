import { Card } from 'react-bootstrap';

export default function PostCard({ post }) {
    return (
        <Card key={post.id} className="mb-3">
            <Card.Body>
                <Card.Text>{post.content}</Card.Text>
                <small className="text-muted">Post #{post.id}</small>
            </Card.Body>
        </Card>
    );
}