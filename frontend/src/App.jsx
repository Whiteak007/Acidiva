import { useState } from "react";
import "./App.css";
import ImageUpload from "./components/ImageUpload";
export const backendUrl = "http://localhost:3000";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ImageUpload />
    </>
  );
}

export default App;
