import React from "react";
import { Button } from "rsuite";

export default function App() {
  return (
    <div
      style={{
        height: "100px",
        width: "100px",
        backgroundColor: "orange",
        position: "absolute",
        top: "0px",
        right: "0px",
        zIndex: "99999",
      }}
    >
      App
      <Button>213</Button>
    </div>
  );
}
