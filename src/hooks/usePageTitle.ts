import { useEffect } from "react";

const BRAND = "NutriPulse Nepal";

// document.title lives outside React, so an effect is the right tool here.
export const usePageTitle = (name: string) => {
  useEffect(() => {
    document.title = `${name} | ${BRAND}`;
  }, [name]);
};
