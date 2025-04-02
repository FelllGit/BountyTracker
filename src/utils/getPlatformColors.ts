import { EPlatformName } from "@/interfaces/PlatformNames";

const getPlatformColors = (): Record<EPlatformName, string> => {
  if (typeof document === "undefined") {
    // Повертаємо дефолтні кольори на сервері
    return {
      [EPlatformName.HackenProof]: "#CCCCCC",
      [EPlatformName.Cantina]: "#CCCCCC",
      [EPlatformName.CodeHawks]: "#CCCCCC",
      [EPlatformName.Immunefi]: "#CCCCCC",
      [EPlatformName.Sherlock]: "#CCCCCC",
      [EPlatformName.code4rena]: "#CCCCCC",
      [EPlatformName.HatsFinance]: "#CCCCCC",
    };
  }

  const styles = getComputedStyle(document.documentElement);

  return {
    [EPlatformName.HackenProof]: styles
      .getPropertyValue("--hackenProof")
      .trim(),
    [EPlatformName.Cantina]: styles.getPropertyValue("--cantina").trim(),
    [EPlatformName.CodeHawks]: styles.getPropertyValue("--codeHawks").trim(),
    [EPlatformName.Immunefi]: styles.getPropertyValue("--immunefi").trim(),
    [EPlatformName.Sherlock]: styles.getPropertyValue("--sherlock").trim(),
    [EPlatformName.code4rena]: styles.getPropertyValue("--code4rena").trim(),
    [EPlatformName.HatsFinance]: styles
      .getPropertyValue("--hatsFinance")
      .trim(),
  };
};

export default getPlatformColors;
