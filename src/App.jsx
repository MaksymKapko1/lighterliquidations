import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { CoinLiquidationPage } from "./Pages/CoinLiquidationPage";
import { Snowfall } from "react-snowfall";
import { Link } from "react-router-dom";
import "./App.css";
function App() {
  return (
    <Router>
      <Snowfall
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          pointerEvents: "none",
        }}
        snowflakeCount={60}
        radius={[0.3, 2.0]}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/liquidations/:coin" element={<CoinLiquidationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
