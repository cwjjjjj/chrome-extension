import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// const root = document.createElement("div");
// root.id = "crx-root";
// document.body.append(root);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   root
// );

const root = document.createElement("div");
root.id = "crx-root";
document.body.append(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
