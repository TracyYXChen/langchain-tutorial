import './App.css';
import { turtle } from './components/turtle';
import { simulation } from './components/agents';
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState<string | null>(null); // Using null as initial state
  const [error, setError] = useState<Error | null>(null); // To handle any potential error
  const prompt = "Name a turtle stands in front of a library";
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY? process.env.REACT_APP_OPENAI_API_KEY :'';
  useEffect(() => {
    const fetchData = async () => {
      try {
        const turtleName = await turtle({prompt: "Your prompt here", apiKey: OPENAI_API_KEY});
        setData(turtleName);
        await simulation(OPENAI_API_KEY);

      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    
    fetchData();
  }, []);
  return (
    <div className="App">
      {error && <p>Error: {error.message}</p>}
      {data ? (
        <div>
        <p> {prompt} </p>
        <b> {data}</b>
        </div>
      ) : (
        <div>
        <p> {prompt} </p>
        <b> loading ...</b>
        </div>
      )}
    </div>
  );
}

export default App;
