"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AccessibilityContextType {
  highContrast: boolean;
  largeText: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(
  null
);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility deve ser usado dentro de AccessibilityProvider"
    );
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  // Carrega preferências salvas
  useEffect(() => {
    const savedHighContrast = localStorage.getItem("participa-df-high-contrast");
    const savedLargeText = localStorage.getItem("participa-df-large-text");

    if (savedHighContrast === "true") {
      setHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }

    if (savedLargeText === "true") {
      setLargeText(true);
      document.documentElement.classList.add("large-text");
    }
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem("participa-df-high-contrast", String(newValue));

    if (newValue) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    localStorage.setItem("participa-df-large-text", String(newValue));

    if (newValue) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{ highContrast, largeText, toggleHighContrast, toggleLargeText }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}
