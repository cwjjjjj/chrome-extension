import TabsList from "./components/TabsList";
import Tab from "./components/Tab";

function App() {
  return (
    <div
      className="App"
      style={{
        height: "100px",
        width: "100px",
        background: "red",
      }}
    >
      <Tab />
      <TabsList />
    </div>
  );
}

export default App;
