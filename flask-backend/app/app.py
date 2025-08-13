from flask import Flask, jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash

import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('posts.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()

    conn.execute('''
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL
    )
    ''')

    conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    if user:
        conn.close()
        return jsonify({'error': 'User already exists'}), 400
    hashed = generate_password_hash(password)
    conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed))
    conn.commit()
    conn.close()
    return jsonify({'message': 'User registered'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()
    if user and check_password_hash(user['password'], password):
        # For JWT, generate and return a token here
        session['user_id'] = user['id']  # For session-based auth
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'error': 'Invalid credentials'}), 401


@app.route('/posts', methods=['GET', 'POST'])
@app.route('/posts/', methods=['GET', 'POST'])
def posts():
    if request.method == 'GET':
        conn = get_db_connection()
        posts = conn.execute('SELECT * FROM posts ORDER BY id DESC').fetchall()
        conn.close()
        posts_list = [dict(post) for post in posts]
        return jsonify(posts_list)
    elif request.method == 'POST':
        data = request.get_json()
        content = data.get('content')
        if not content:
            return jsonify({'error': 'Content required'}), 400
        conn = get_db_connection()
        conn.execute('INSERT INTO posts (content) VALUES (?)', (content,))
        conn.commit()

        conn.close()
        return jsonify({'message': 'Post added'}), 201

@app.route('/count-word', methods=['GET'])
def count_word():
    word = request.args.get('word', '').lower().strip()
    if not word:
        return jsonify({'error': 'No word provided'}), 400

    conn = get_db_connection()

    # Count how many posts contain the word (case-insensitive)
    query = "SELECT COUNT(*) as count FROM posts WHERE LOWER(content) LIKE ?"
    like_pattern = f'%{word}%'
    result = conn.execute(query, (like_pattern,)).fetchone()

    conn.close()

    total = result['count'] if result else 0

    return jsonify({
        'search_word': word,
        'search_count': total
    })


if __name__ == '__main__':
    app.run(debug=True)