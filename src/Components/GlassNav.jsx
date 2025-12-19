import React from "react";
import { CoinSearch } from "./ClientSearch";

export const GlassNav = ({ active, onChange, markets }) => {
  const sectors = ["All", "Crypto", "Equities", "FX", "Pre-launch"];

  return (
    <div style={styles.glassContainer}>
      <div style={styles.tabsContainer} className="hide-scrollbar">
        {sectors.map((sector) => {
          const isActive = active === sector;
          return (
            <button
              key={sector}
              onClick={() => onChange(sector)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.activeItem : {}),
              }}
            >
              {sector}
              {isActive && <div style={styles.activeGlow} />}
            </button>
          );
        })}
      </div>

      <div style={styles.searchWrapper}>
        <CoinSearch market={markets} />
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const styles = {
  glassContainer: {
    background: "rgba(22, 27, 34, 0.6)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(48, 54, 61, 0.4)",
    borderRadius: "16px",
    padding: "12px",
    marginBottom: "24px",
    marginTop: "20px",

    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },

  tabsContainer: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    flex: "1 1 auto",
    whiteSpace: "nowrap",
    alignItems: "center",
    minWidth: "0",
  },

  searchWrapper: {
    flex: "0 0 auto",
    display: "flex",
    justifyContent: "flex-end",
  },

  navItem: {
    position: "relative",
    cursor: "pointer",
    padding: "8px 20px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "#8b949e",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    outline: "none",
  },
  activeItem: {
    color: "#fff",
    background: "rgba(255, 255, 255, 0.05)",
  },
  activeGlow: {
    position: "absolute",
    bottom: "-2px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "20px",
    height: "2px",
    background: "#58a6ff",
    boxShadow: "0 0 10px #58a6ff",
    borderRadius: "2px",
  },
};
