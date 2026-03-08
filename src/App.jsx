import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { Snowfall } from "react-snowfall";
import "./App.css";
import { Airdrop } from "./Pages/Airdrop";
import { LitTradesPage } from "./Pages/LitTradesPage";
import { BuybacksStats } from "./Pages/BuybacksStats";
import HeatmapPage from "./Pages/HeatmapPage";
import { SpotPage } from "./Pages/SpotPage";
import { CoinLiquidationPage } from "./Pages/CoinLiquidationPage";
import { HomePage } from "./Pages/HomePage";
function App() {
  return (
    <>
      {/* <Snowfall
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          pointerEvents: "none",
        }}
        snowflakeCount={60}
        radius={[0.3, 2.0]}
      /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/liquidations/:coin" element={<CoinLiquidationPage />} />
        <Route path="/spot" element={<SpotPage />} />
        <Route path="/airdrop" element={<Airdrop />} />
        <Route path="/littrades" element={<LitTradesPage />} />
        <Route path="/buybacks" element={<BuybacksStats />} />
        <Route path="/heatmap" element={<HeatmapPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
