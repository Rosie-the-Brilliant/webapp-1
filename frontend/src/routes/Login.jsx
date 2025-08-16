import { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
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
            const res = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            // Clear previous error
            setError('');

            if (res.ok) {
                console.log('Login successful', data);
                navigate('/');
                // save JWT or session info here
            } else if (data.error === 'User not found') {
                setError('User not found. Please register first.');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Try again.');
            console.error(err);
        }
    };

    return (
        <div className="fullscreen-center">
            <Container className="login-container col-sm-4 d-flex flex-column justify-content-center align-items-center">
                <h2>Login</h2>
                <br></br>
                <Form onSubmit={handleLogin}>
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
                            />
                        </Col>
                    </Form.Group>

                    <Button type="submit" className="w-100">Login</Button>

                    {/* Error message with fixed height */}
                    <div style={{ minHeight: '24px' }} className="w-100 text-center">
                        {error && <p className="text-danger mt-2">{error}</p>}
                    </div>

                    {/* Register prompt with fixed height */}
                    <hr/>
                    <div style={{ minHeight: '60px' }} className="w-100 text-center mt-2">
                        <p>Don't have an account? Click below to register.</p>
                        <Button variant="secondary" onClick={() => navigate('/register')}>
                            Register
                        </Button>
                    </div>
                </Form>

            </Container>
        </div>
    );
}

export default Login;
