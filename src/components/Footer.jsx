import React from "react";

const Footer = ({ length }) => {
  return (
    <footer>
      SIBYLS Beamline &copy; {length} List {length === 1 ? "Item" : "Items"}
    </footer>
  );
};

export default Footer;
