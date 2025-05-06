import { useState } from "react";
import ChatButton from "./components/ChatButton";
import ChatPopup from "./components/ChatPopup";

function App() {
  const [togglePopup, setTogglePopup] = useState(false);
  return (
    <div className="app-container relative">
      <ChatButton togglePopup={togglePopup} setTogglePopup={setTogglePopup} />
      <ChatPopup setTogglePopup={setTogglePopup} togglePopup={togglePopup}/>
    </div>
  );
}
export default App;
