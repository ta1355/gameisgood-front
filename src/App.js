import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Gameisgood from "./header/GameisgoodHeader";
import Game from "./steamapi/special/gameisgood/game";
import Footer from "./footer/Footer";
import GameDetail from "./steamapi/detail/GameDetail";
import Search from "./steamapi/search/Search";
import ComingSoon from "./steamapi/comingsoon/ComingSoon";
import TopSellers from "./steamapi/topsellers/TopSellers";
import NewReleases from "./steamapi/newreleases/NewReleases";
import PostList from "./post/PostList";
import CreatePost from "./post/CreatePost";
import PostDetail from "./post/PostDetail";
import SignUp from "./user/login/Signup";
import LoginForm from "./user/login/Loginform";
import Main from "./main/main";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Gameisgood></Gameisgood>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/special" element={<Game />} />
          <Route path="/coming_soon" element={<ComingSoon />} />
          <Route path="/top_sellers" element={<TopSellers />} />
          <Route path="/new_releases" element={<NewReleases />} />
          <Route path="/game_detail/:steamAppId" element={<GameDetail />} />
          <Route path="/search/:steamAppName" element={<Search />} />
          <Route path="/post/list" element={<PostList />} />
          <Route path="/post/create" element={<CreatePost />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="post/:id" element={<PostDetail />} />
        </Routes>
        <Footer></Footer>
      </Router>
    </AuthProvider>
  );
}

export default App;
