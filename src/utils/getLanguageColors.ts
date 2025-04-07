import { ELanguagesNames } from "@/interfaces/LanguagesNames";

const getPlatformColors = (): Record<ELanguagesNames, string> => {
  if (typeof document === "undefined") {
    // Повертаємо дефолтні кольори на сервері
    return {
      [ELanguagesNames.Cairo]: "#CCCCCC",
      [ELanguagesNames.Move]: "#CCCCCC",
      [ELanguagesNames.Solidity]: "#CCCCCC",
      [ELanguagesNames.Rust]: "#CCCCCC",
      [ELanguagesNames.Other]: "#CCCCCC",
      [ELanguagesNames.Go]: "#CCCCCC",
    };
  }

  const styles = getComputedStyle(document.documentElement);

  return {
    [ELanguagesNames.Cairo]: styles.getPropertyValue("--cairo").trim(),
    [ELanguagesNames.Move]: styles.getPropertyValue("--move").trim(),
    [ELanguagesNames.Solidity]: styles.getPropertyValue("--solidity").trim(),
    [ELanguagesNames.Rust]: styles.getPropertyValue("--rust").trim(),
    [ELanguagesNames.Go]: styles.getPropertyValue("--go").trim(),
    [ELanguagesNames.Other]: "#CCCCCC",
  };
};

export default getPlatformColors;
