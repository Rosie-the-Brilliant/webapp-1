// This file contains the API functions for posts and word count in the frontend React application.

export const fetchPosts = async () => {
  const res = await fetch('http://127.0.0.1:5000/posts');
  return res.json();
};

export const createPost = async (content) => {
  const res = await fetch('http://127.0.0.1:5000/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return res.json();
};

export const fetchWordCount = async (word) => {
  const res = await fetch(`http://127.0.0.1:5000/count-word?word=${encodeURIComponent(word)}`);
  return res.json();
};


// posting with word check logic 
export const createPostWithWordCheck = async (content, word) => {
  const data = await createPost(content);

  // Only fetch count if word is present
  let searchCount = 0;
  if (content.toLowerCase().includes(word.toLowerCase())) {
    const countData = await fetchWordCount(word);
    searchCount = countData.search_count || 0;
  }
  return { data, searchCount };
};
