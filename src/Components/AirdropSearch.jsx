import React from "react";
import "./AirdropSearch.css";
import { useState } from "react";

export const AirdropSearch = ({
  placeholder = "Search airdrops...",
  onSearch,
  isLoading,
  externalValue,
  setExternalValue,
}) => {
  const [inputValue, setInputValue] = useState("");
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      onSearch(inputValue); // Вызываем функцию родителя
    }
    useEffect(() => {
      if (externalValue !== undefined) {
        setInputValue(externalValue);
      }
    }, [externalValue]);
  };
  return (
    <div className="neon-search-container">
      <div className={`neon-search-box ${isLoading ? "searching" : ""}`}>
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#58a6ff"
          strokeWidth="2.5"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
          type="text"
          className="neon-input"
          placeholder="Search by ID or Wallet..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading} // Блокируем ввод пока ищем
        />

        {/* Крутилка, если isLoading === true */}
        {isLoading && <div className="simple-loader"></div>}
      </div>
    </div>
  );
};
