import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Analyze from "./Analyze";
import Graphs from "./Graphs ";
import Activate from "./Activate";
import Register from "./Register";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/caps24g12" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/register" element={<Register />} />
            <Route path="/graphs" element={<Graphs />} />
            <Route path="/activate" element={<Activate />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
