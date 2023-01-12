// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";

// let root = document.createElement("div");
// // root = root.attachShadow({ mode: "open" });
// const testRoot = root.attachShadow({ mode: "open" });
// root.append(testRoot);
// root.id = "crx-root";
// document.body.append(root);
// document.body.append(testRoot);

// ReactDOM.createRoot(testRoot).render(
//   // <React.StrictMode>
//   <App />
//   // </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.createElement("div");
root.id = "crx-root";
document.body.append(root);

ReactDOM.createRoot(root).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
