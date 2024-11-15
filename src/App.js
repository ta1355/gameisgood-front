import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gameisgood from "./header/GameisgoodHeader";
import Game from "./special/gameisgood/game";
import Footer from "./footer/Footer";
import GameDetail from "./detail/GameDetail";
import Search from "./search/Search";

function App() {
  return (
    <Router>
      <Gameisgood></Gameisgood>
      <Routes>
        <Route path="/" element={<Game />}></Route>
        <Route path="/test/:steamAppId" element={<GameDetail />} />
        <Route path="/search/:steamAppName" element={<Search />} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
