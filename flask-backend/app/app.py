from flask import Flask, jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash
from llavaPost import llavaPost

import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('app.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()

    conn.execute('''
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 0,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )

    ''')

    conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT DEFAULT '',
        bio TEXT DEFAULT '',
        profile_picture TEXT DEFAULT '',
        followers INTEGER DEFAULT 0,
        following INTEGER DEFAULT 0,
        joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    conn.execute('''
    CREATE TABLE IF NOT EXISTS llm (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        content TEXT NOT NULL
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
    user = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
    conn.close()
    return jsonify({'message': 'User registered', 'user_id': user}), 201

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
        # session['user_id'] = user['id']  # For session-based auth
        return jsonify({'message': 'Login successful', 'user_id': user['id']}), 200
    elif not user:
        return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify({'error': 'Invalid credentials'}), 401


# --- USER PROFILE ---
@app.route("/users/<int:user_id>", methods=["GET"])
def get_user_profile(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    if not user:
        return jsonify({"error": "User not found"}), 404
    user_dict = dict(user)
    user_dict.pop('password', None)  # Remove password from response
    conn.close()
    return jsonify(user_dict)


# --- USER POSTS ---
@app.route("/users/<int:user_id>/posts", methods=["GET"])
def get_user_posts(user_id):
    # TODO: Implement user posts retrieval
    conn = get_db_connection()
    user_posts = conn.execute('SELECT * FROM posts WHERE user_id = ?', (user_id,)).fetchall()
    if not user_posts:
        return jsonify([{"message": "No posts found for this user"}]), 200
    user_posts = [dict(post) for post in user_posts]
    conn.close()
    return jsonify(user_posts)


# --- UPDATE PROFILE (e.g., bio) ---
@app.route("/users/<int:user_id>", methods=["PUT"])
def update_user_profile(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    bio = data.get('bio', user['bio'])
    followers = data.get('followers', user['followers'])
    following = data.get('following', user['following'])

    conn.execute('UPDATE users SET bio = ?, followers = ?, following = ? WHERE id = ?',
                 (bio, followers, following, user_id))
    conn.commit()
    conn.close()
    user_dict = dict(user)
    user_dict.pop('password', None)  # Remove password from response
    return jsonify(user)

   
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

@app.route("/ai_post", methods=["POST"])
def ai_post():
    topic = request.json.get("topic", "Write a shower thought.")
    print(f"Generating AI post for topic: {topic}")
    llm = llavaPost()
    ai_content = llm.get_model_response(topic)

    # Save to DB here...
    return jsonify({"content": ai_content})


if __name__ == '__main__':
    app.run(debug=True)