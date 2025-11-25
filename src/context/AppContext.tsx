import React, { createContext, useState, ReactNode } from "react";

type AppContextType = {
  userName: string;
  setUserName: (name: string) => void;
};

export const AppContext = createContext<AppContextType>({
  userName: "",
  setUserName: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState("");

  return (
    <AppContext.Provider value={{ userName, setUserName }}>
      {children}
    </AppContext.Provider>
  );
}
