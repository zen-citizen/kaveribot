import { useState } from "react";
import ChatButton from "./components/ChatButton";
import ChatPopup from "./components/ChatPopup";

function App() {
  const [togglePopup, setTogglePopup] = useState(true);
  return (
    <div>
      <ChatButton togglePopup={togglePopup} setTogglePopup={setTogglePopup} />
      {togglePopup && <ChatPopup setTogglePopup={setTogglePopup} togglePopup={togglePopup}/>}
    </div>
  );
}
export default App;
