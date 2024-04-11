import { useState } from "react";
import "./App.css";
// import "./styles.css";
import Header from "./components/Header";
import UploadPopup from "./components/UploadPopup";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignInPage from "./Pages/SignInPage/SignInPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";

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
      <Router>
        <Header handleUploadPopupOpen={handleUploadPopupOpen} />
        {openUploadPopup && (
          <UploadPopup handleUploadPopupClose={handleUploadPopupClose} />
        )}
        
          <Routes>s
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/signin" element={<SignInPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
