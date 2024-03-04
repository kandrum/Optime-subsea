import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";

import Register from "./Register";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />

            <Route path="/register" element={<Register />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
