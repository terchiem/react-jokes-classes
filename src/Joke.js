import React from "react";
import "./Joke.css";

/** A single joke, along with vote up/down buttons. */

function Joke({ id, vote, votes, text, updateSavedJokes, savedJokes }) {

  const saved = savedJokes.some(j => j.id === id);

  const saveStyle = { color: saved ? 'red' : 'gray' };

  return (
    <div className="Joke">
      <div className="Joke-votearea">
        <button onClick={evt => vote(id, +1)}>
          <i className="fas fa-thumbs-up" />
        </button>

        <button onClick={evt => vote(id, -1)}>
          <i className="fas fa-thumbs-down" />
        </button>

        {votes}

        <button onClick={evt => updateSavedJokes(id)}>
          <i style={saveStyle} className="fas fa-heart" />
        </button>
      </div>

      <div className="Joke-text">{text}</div>
    </div>
  );
}

export default Joke;
