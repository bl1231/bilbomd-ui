import React from "react";

const Footer = ({ length }) => {
  return (
    <footer>
      SIBYLS Beamline &copy;2023 - {length} BilboMD{" "}
      {length === 1 ? "Job" : "Jobs"}
    </footer>
  );
};

export default Footer;
