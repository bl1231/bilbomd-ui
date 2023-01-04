import React, { useState } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/flatly/bootstrap.min.css";
//import "App.css";
import "index.css";
//import { RouterProvider } from "react-router-dom";
//import router from "routes/Home";
import Header from "components/Header";
import Root from "components/Root";
import Footer from "components/Footer";
function App() {
  const [items, setItems] = useState([
    { id: 1, checked: false, item: "onething" },
    { id: 2, checked: false, item: "twothing" },
    { id: 3, checked: false, item: "threething" },
  ]);
  const handleCheck = (id) => {
    //console.log(`item ${id} checked`);
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);
    localStorage.setItem("shoppinglist", JSON.stringify(listItems));
  };
  const handleDelete = (id) => {
    //console.log(`del ${id}`);
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
    localStorage.setItem("shoppinglist", JSON.stringify(listItems));
  };
  return (
    <div className="App">
      <Container>
        <Header title="BilboMD" />
        <Root
          items={items}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />
        <Footer length={items.length} />
      </Container>
    </div>
  );
}

export default App;
