import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { clearHistory } from "../store/store";
import "../styles/History.css"; // Import the new History.css file

const History: React.FC = () => {
  const historyList = useSelector((state: RootState) => state.history);
  const dispatch = useDispatch<AppDispatch>();

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  return (
    <div className="container-fluid history-page-container">
      <div className="container mt-4">
        <div className="mb-4">
          <ul className="custom-list">
            {historyList.map((item, index) => (
              <li key={index} className="custom-list-item">
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="button-container">
          <button
            className="btn btn-warning btn-lg"
            onClick={handleClearHistory}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
