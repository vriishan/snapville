import { useState } from "react";
import "./App.css";
// import "./styles.css";
import Header from "./components/Header";
import Modal from "react-bootstrap/Modal";
import UploadPopup from "./components/UploadPopup";

function App() {
  // Using BEM naming convention
  const [openUploadPopup, setopenUploadPopup] = useState(false);

  const handleUploadPopupClose = () => {
    setopenUploadPopup(false);
  };

  const handleUploadPopupOpen = () => {
    setopenUploadPopup(true);
  };

  return (
    <div className="App">
      <Header handleUploadPopupOpen={handleUploadPopupOpen} />
      {openUploadPopup && (
        <UploadPopup handleUploadPopupClose={handleUploadPopupClose} />
      )}
    </div>
  );
}

export default App;
