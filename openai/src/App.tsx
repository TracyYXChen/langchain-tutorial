import './App.css';
import { socks } from './components/socks';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await socks();
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    
    fetchData();
  }, []);
  return (
    <div className="App">
    </div>
  );
}

export default App;
