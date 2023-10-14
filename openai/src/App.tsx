import './App.css';
import { turtle } from './components/turtle';
import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState<string | null>(null); // Using null as initial state
  const [error, setError] = useState<Error | null>(null); // To handle any potential error
  const prompt = "Name a turtle stands in front of a library";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const turtleName = await turtle(prompt);
        setData(turtleName);
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
