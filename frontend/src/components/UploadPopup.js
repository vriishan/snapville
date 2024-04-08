import { useState } from "react";
import FirstTab from "./tab-components/FirstTab";
import "./popup.css";

export default function UploadPopup({ handleUploadPopupClose }) {
  return (
    <div className="uploadPopup">
      <div className="uploadPopup__box">
        <div className="box__close" onClick={handleUploadPopupClose}>
          X
        </div>
        <h3 className="box__heading">Upload Image</h3>
        <div className="outlet">
          <FirstTab />
        </div>
      </div>
    </div>
  );
}
