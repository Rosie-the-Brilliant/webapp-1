function shower({ tasks }) {
  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          {/* Show image */}
          <img src={task.image_url} alt={task.title} style={{ maxWidth: '200px' }} />
        </div>
      ))}
    </div>
  );
}
