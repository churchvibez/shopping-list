import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { clearHistory } from "../store/store";
import List from "../components/List"; // Import the reusable List component
import "../styles/History.css";

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
          <List items={historyList} />
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
