import React, { useState, useRef } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/flatly/bootstrap.min.css";
//import "App.css";
import "index.css";
//import { RouterProvider } from "react-router-dom";
//import router from "routes/Home";
import Header from "components/Header";
import AddItem from "components/AddItem";
import SearchItem from "components/SearchItem";
import Root from "components/Root";
import Footer from "components/Footer";
function App() {
  // const [items, setItems] = useState([
  //   { id: 1, checked: false, item: "BilboMD job - topo2 - option 1" },
  //   { id: 2, checked: false, item: "BilboMD job - topo2 - option 2" },
  //   { id: 3, checked: false, item: "BilboMD job - topo2 - option 3" },
  // ]);
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("shoppinglist"))
  );
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");

  const setAndSaveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem("shoppinglist", JSON.stringify(newItems));
  };

  const addItem = (item) => {
    // determine new id
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setAndSaveItems(listItems);
  };
  const handleCheck = (id) => {
    //console.log(`item ${id} checked`);
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setAndSaveItems(listItems);
  };
  const handleDelete = (id) => {
    //console.log(`del ${id}`);
    const listItems = items.filter((item) => item.id !== id);
    setAndSaveItems(listItems);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    //console.log(newItem);
    addItem(newItem);
    setNewItem("");
    //console.log("submitted");
  };
  return (
    <div className="App">
      <Container>
        <Header title="BilboMD" />
        <AddItem
          newItem={newItem}
          setNewItem={setNewItem}
          handleSubmit={handleSubmit}
        />
        <SearchItem
          search={search}
          setSearch={setSearch}
        />
        <Root
          // Use higher order function to filter the displayed list
          items={items.filter((item) =>
            item.item.toLowerCase().includes(search.toLowerCase())
          )}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />
        <Footer length={items.length} />
      </Container>
    </div>
  );
}

export default App;
