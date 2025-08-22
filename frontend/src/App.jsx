import { useState } from "react";
import "./App.css";
import ImageUpload from "./components/ImageUpload";
export const backendUrl = "https://acidiva.vercel.app";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ImageUpload />
    </>
  );
}

export default App;
