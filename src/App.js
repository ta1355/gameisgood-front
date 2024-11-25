import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gameisgood from "./header/GameisgoodHeader";
import Game from "./steamapi/special/gameisgood/game";
import Footer from "./footer/Footer";
import GameDetail from "./steamapi/detail/GameDetail";
import Search from "./steamapi/search/Search";
import PostList from "./post/PostList";
import CreatePost from "./post/CreatePost";
import PostDetail from "./post/PostDetail";
import Main from "./main/main";
import "./App.css";

function App() {
  return (
    <Router>
      <Gameisgood></Gameisgood>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/special" element={<Game />} />
        <Route path="/test/:steamAppId" element={<GameDetail />} />
        <Route path="/search/:steamAppName" element={<Search />} />
        <Route path="post/list" element={<PostList />} />
        <Route path="post/create" element={<CreatePost />} />
        <Route path="post/:id" element={<PostDetail />} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
