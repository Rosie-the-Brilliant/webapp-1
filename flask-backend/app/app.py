from flask import Flask, jsonify, request
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
    conn.commit()
    conn.close()

init_db()

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

if __name__ == '__main__':
    app.run(debug=True)