import React from "react";
import "./GlassNavigation.css";

export const GlassNav = ({ active, onChange }) => {
  const tabs = ["All", "Crypto", "Equities", "FX", "Pre-launch"];

  return (
    <div className="glass-nav-wrapper">
      <div className="glass-nav-container">
        <ul className="glass-nav-list">
          {tabs.map((tab) => {
            const isActive = active === tab;
            return (
              <li
                key={tab}
                className={`glass-nav-item ${isActive ? "active" : ""}`}
                onClick={() => onChange(tab)}
              >
                {tab}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
