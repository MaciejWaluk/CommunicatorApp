import './App.css';
import { Route, Routes, Router } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={HomePage} exact/>
        <Route path="/chats" Component={ChatPage}/>
      </Routes>
    </div>
  );
}

export default App;
