import React, { useState, useRef } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/flatly/bootstrap.min.css";
//import "App.css";
import "index.css";
//import { RouterProvider } from "react-router-dom";
//import router from "routes/Home";
// import Header from "components/Header";
// import AddItem from "components/AddItem";
// import SearchItem from "components/SearchItem";
// import Root from "components/Root";
// import Footer from "components/Footer";
import Register from "components/Register";
function App() {
  return (
    <main className="App">
      <Register />
    </main>
  );
}

export default App;
