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

        # showers when shower is mentioned
        searchShower(conn)

        conn.close()
        return jsonify({'message': 'Post added'}), 201

def searchShower(conn):
    cursor = conn.cursor()

    search_word = 'shower'
    query = "SELECT * FROM posts WHERE content LIKE ?"
    cursor.execute(query, ('%' + search_word + '%',))

    results = cursor.fetchall()

    if results:
        print(f"Found {len(results)} task(s) containing '{search_word}':")
        for row in results:
            print(row)
    else:
        print(f"No tasks found containing '{search_word}'.")


if __name__ == '__main__':
    app.run(debug=True)