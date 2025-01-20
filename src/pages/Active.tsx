import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { addToActive, removeFromActive, clearActive } from "../store/store";
import List from "../components/List"; // Import the reusable List component
import "../styles/Active.css";

const Active: React.FC = () => {
  const activeList = useSelector((state: RootState) => state.active);
  const dispatch = useDispatch<AppDispatch>();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [product, setProduct] = useState("");

  const handleAdd = () => {
    if (product.trim()) {
      dispatch(addToActive(product.trim()));
      setProduct("");
      setIsPopupOpen(false);
    }
  };

  const handleRemove = (item: string) => {
    dispatch(removeFromActive(item));
  };

  const handleClearActive = () => {
    dispatch(clearActive());
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
  };

  return (
    <div className="container-fluid page-container">
      <div className="container mt-4">
        {isPopupOpen && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Add a Product</h2>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Product Name"
                className="popup-input"
              />
              <div className="d-flex justify-content-between">
                <button className="btn btn-success" onClick={handleAdd}>
                  Add
                </button>
                <button className="btn btn-danger" onClick={togglePopup}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* added list component for code abstraction */}
        <div className="mb-4">
          <List items={activeList} onRemove={handleRemove} />
        </div>

        <div className="button-container">
          <button
            className="btn btn-warning btn-lg me-2"
            onClick={handleClearActive}
          >
            Clear
          </button>
          <div>
            <button className="btn btn-primary btn-lg" onClick={togglePopup}>
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Active;
