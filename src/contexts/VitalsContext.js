import React, { createContext, useContext, useState } from "react";

const VitalsContext = createContext(null);

export function VitalsProvider({ children }) {
  const [vitals, setVitals] = useState(null); // Stores latest vitals as object from Fitbit API
  const [vitalsSent, setVitalsSent] = useState(false); // Was it sent to chat?

  return (
    <VitalsContext.Provider value={{ vitals, setVitals, vitalsSent, setVitalsSent }}>
      {children}
    </VitalsContext.Provider>
  );
}

// Custom hook for easy access to context
export function useVitals() {
  return useContext(VitalsContext);
}