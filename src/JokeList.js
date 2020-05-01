import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import useLocalStorage from './hooks/useLocalStorage';
import "./JokeList.css";

/** List of jokes. */

function JokeList({ numJokesToGet=5 }) {
  const [jokes, setJokes] = useLocalStorage('jokes', []);
  const [isLoading, setIsLoading] = useState(true);
  const [savedJokes, setSavedJokes] = useLocalStorage('saved-jokes', []);

  useEffect(() => {
    if (jokes.length === 0) {
      getJokes();
    } else {
      setIsLoading(false);
    }
  }, []);

  /* retrieve jokes from API */

  async function getJokes() {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let jokes = [...savedJokes];
      let seenJokes = new Set(savedJokes.map(j => j.id));

      while (jokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }

      console.log(seenJokes);
      setJokes(jokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  /* empty joke list, set to loading state, and then call getJokes */

  function generateNewJokes() {
    setIsLoading(true);
    getJokes();
  }

  /* change vote for this id by delta (+1 or -1) */

  function vote(id, delta) {
    setJokes(oldJokes => oldJokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    );
  }

  /* reset all joke vote counts */

  function resetVotes() {
    setJokes(oldJokes => oldJokes.map(j => ({...j, votes: 0})));
  }

  /* either removes or adds a joke to the savedJokes state by id */

  function updateSavedJokes(id) {
    const savedJoke = savedJokes.find(j => j.id === id);
    
    if (savedJoke) {
      setSavedJokes(oldJokes => oldJokes.filter(j => j.id !== id));
    } else {
      const jokeToSave = jokes.find(j => j.id === id);
      setSavedJokes(oldJokes => [...oldJokes, jokeToSave]);
    }
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  return (
    <div className="JokeList">
      <button
        className="JokeList-getmore"
        onClick={generateNewJokes}
      >
        Get New Jokes
      </button>

      <button onClick={resetVotes}>Reset Votes</button>

      {sortedJokes.map(j => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
          updateSavedJokes={updateSavedJokes}
          savedJokes={savedJokes}
        />
      ))}
    </div>
  );
}

export default JokeList;
