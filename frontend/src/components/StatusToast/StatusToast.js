import "react-toastify/dist/ReactToastify.css";


const StatusToast = ({ message, showClose }) => {
    console.log("closeToast type:", typeof closeToast); 
    return (
      <div>
        <p>{message}</p>
        {showClose && <button>Close</button>}
      </div>
    );
  };

export default StatusToast;