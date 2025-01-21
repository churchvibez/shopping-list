import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { addToActive, removeFromActive, clearActive } from "../store/store";
import List from "../components/List";
import RubbishBinIcon from "../assets/rubbish-bin.svg";
import "../styles/Active.css";

const Active: React.FC = () => {
  const activeList = useSelector((state: RootState) => state.active);
  const historyList = useSelector((state: RootState) => state.history);
  const lastAdded = useSelector((state: RootState) => state.lastAdded);
  const dispatch = useDispatch<AppDispatch>();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

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
    setSuggestions([]);
  };

  // functionality for autocompletion
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setProduct(input);

    // handle empty input
    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }

    // retrieve suggestions from list of previous items added
    const filteredSuggestions = historyList.filter((item) => 
      item.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  }

  return (
    <div className="container-fluid page-container">
      <div className="container mt-4">
        {isPopupOpen && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Добавить продукт</h2>
              <input
                type="text"
                value={product}
                onChange={handleInputChange}
                placeholder="Например: хлеб..."
                className="popup-input"
              />
              {suggestions.length > 0 && (
                <ul className="autocomplete-list">
                  {suggestions.map((suggestion, index) =>
                    <li
                      key={index}
                      className="autocomplete-item"
                      onClick={() => {
                        setProduct(suggestion);
                        setSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </li>
                  )}
                </ul>
              )}
              <div className="d-flex justify-content-between">
                <button className="btn btn-success" onClick={handleAdd}>
                  Добавить
                </button>
                <button className="btn btn-danger" onClick={togglePopup}>
                  Отменить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* either display list of items, or message saying empty */}
        <div>
          {activeList.length > 0 ? (
            <List items={activeList} onRemove={handleRemove} />
          ) : (
            <p className="empty-text">Список покупок пуст!</p>
          )}
        </div>

        {/* // display clear + add button if items exist, otherwise just an add button */}
        <div className="button-row">
          {activeList.length > 0 && (
            <button
              className="btn btn-warning btn-lg clear-button"
              onClick={handleClearActive}
            >
              <img src={RubbishBinIcon} alt="Очистить" style={{ width: "20px", height: "20px" }} />
            </button>
          )}
          <button
            className={`btn btn-primary btn-lg ${
              activeList.length > 0 ? "add-button" : "add-button-centered"
            }`}
            onClick={togglePopup}
          >
            +
          </button>
        </div>
        
        <div className="last-ten">
          <h3 className="last-ten-header">Последние продукты</h3>
          {lastAdded.length > 0 ? (
            <ul className="custom-list">
              {/* // create unique set of the last 10 items */}
              {[...new Set(lastAdded)].map((item) => (
                <li className="custom-list-item">
                  {item}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => dispatch(addToActive(item))}
                    disabled={activeList.includes(item)}
                  >
                    +
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">Нет добавленных товаров!</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Active;
