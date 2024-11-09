import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gameisgood from "./header/GameisgoodHeader";

function App() {
  return (
    <Router>
      <Gameisgood></Gameisgood>
      <Routes>
        <Route path="/" element={<div>습연습연</div>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
