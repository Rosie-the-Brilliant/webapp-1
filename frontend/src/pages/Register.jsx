import { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [content, setContent] = useState('')
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Client-side validation first
        if (!username.trim()) {
            setError('Username is required');
            return;
        }
        if (!password.trim()) {
            setError('Password is required');
            return;
        }

        // Clear previous error
        setError('');

        try {
            const res = await fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (res.ok) {
                console.log('Registration successful', data);
                navigate(`/profile/${data.user_id}`);; // Redirect to profile page
                // save JWT or session info here
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Try again.');
            console.error(err);
        }
    };

    return (
        <div className="fullscreen-center">
            <Container className="login-container col-sm-4 d-flex flex-column justify-content-center align-items-center">
                <h2>Register</h2>
                <br></br>
                <Form onSubmit={handleRegister}>
                    <Form.Group as={Row} className="mb-3" controlId="formUsername">
                        <Form.Label column sm={3}>Username:</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPassword">
                        <Form.Label column sm={3}>Password:</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formPost" className="mb-3">
                                <Form.Label column>First Post:</Form.Label>
                            <Col sm={9}>
                                    <Form.Control
                                        as="textarea"
                                        size="md"
                                        rows={3}
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        placeholder="What's on your mind?"
                                    />
                            </Col>
                    </Form.Group>

                    <Button type="submit" className="w-100">Register Now!</Button>

                    <div style={{ minHeight: '24px' }} className="w-100">
                        {error && (<p className="mt-3 text-danger mt-2" >{error} </p>)}
                    </div>

                    <div style={{ minHeight: '40px' }} className="w-100">


                        <div className="mt-3 text-center">
                            <hr></hr>
                            <p>Already have an account? Click below to log in.</p>
                            <Button variant="secondary" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                        </div>
                    </div>
                </Form>
            </Container>
        </div>
    );
}

export default Register;
