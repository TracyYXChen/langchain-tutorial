import './App.css';
import { turtle } from './components/turtle';
import { simulation } from './components/agents';
import { useEffect, useState } from 'react';
import { AliceObservations, BobObservations } from './components/constants';

function App() {
  const [turtleName, setTurtleName] = useState('...'); // Using an empty string as initial state
  const [allConversations, setAllConversations] = useState<string[]>(['Alice said: Hi', 
  'Bob said: Hello', 'Host said: Yes']); // Using an empty string as initial state
  const [error, setError] = useState<Error | null>(null); // To handle any potential error

  const prompt = "Name a turtle stands in front of a library";
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY? process.env.REACT_APP_OPENAI_API_KEY :'';

  useEffect(() => {
    console.log("running"); // Log here
    const turtleNamer = async () => {
      try {
        const turtleName = await turtle({prompt: prompt, apiKey: OPENAI_API_KEY});
        setTurtleName(turtleName);
      } catch (error) {
        console.error("An error occurred:", error);
        setError(error as Error);
      }
    };
    turtleNamer();

    const simulationRunner = async () => {
      try {
        const allConversations = await simulation(OPENAI_API_KEY);
        setAllConversations(allConversations);
      } catch (error) {
        console.error("An error occurred:", error);
        setError(error as Error);
      }
    };
    simulationRunner();

  }, []);
  return (
    <div className="App">
      <div>
        <p> {prompt} </p>
        <p className='answer'> {turtleName}</p>
      </div>
      <div><p>Alice and Bob discuss lunch options</p></div>
      <div className='memory'> {AliceObservations.join('. ')}</div>
      <div className='memory'> {BobObservations.join('. ')}</div>
      <div> {allConversations.map((conversation, index) => (
       conversation.includes("Alice said")? <p key={index} className='alice'> {conversation} </p>: 
       (conversation.includes("Bob said")? <p key={index} className='bob'> {conversation} </p>: 
       <p key={index} className='host'> {conversation} </p>)
        ))}</div>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}

export default App;
