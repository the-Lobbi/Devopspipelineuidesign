"use client";

import { useTheme } from "../theme-provider";
import { Toaster as Sonner, ToasterProps, toast } from "sonner@2.0.3?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster, toast };
