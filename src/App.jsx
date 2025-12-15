import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { CoinLiquidationPage } from "./Pages/CoinLiquidationPage";
import { Link } from "react-router-dom";
import "./App.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/liquidations/:coin" element={<CoinLiquidationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
