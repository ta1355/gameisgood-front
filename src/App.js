import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gameisgood from "./header/GameisgoodHeader";
import Game from "./gameisgood/game";
import Footer from "./footer/Footer";

function App() {
  return (
    <Router>
      <Gameisgood></Gameisgood>
      <Routes>
        <Route path="/" element={<Game />}></Route>
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
