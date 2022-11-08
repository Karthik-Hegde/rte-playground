import React from "react";
import Main from "./components/Main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AlbumMain from "./components/AlbumMain";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Main />} path="/" />
        <Route element={<AlbumMain />} path="/:breed" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
