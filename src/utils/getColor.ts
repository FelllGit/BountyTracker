export function getEnumColors<T extends string>(
  enumValues: T[]
): Record<T, string> {
  if (typeof document === "undefined") {
    return enumValues.reduce(
      (acc, value) => ({
        ...acc,
        [value]: "#CCCCCC",
      }),
      {} as Record<T, string>
    );
  }

  const styles = getComputedStyle(document.documentElement);

  return enumValues.reduce(
    (acc, value) => {
      const cssVar = `--${value[0].toLowerCase()}${value.slice(1)}`;
      const color = styles.getPropertyValue(cssVar).trim() || "#CCCCCC";

      return {
        ...acc,
        [value]: color,
      };
    },
    {} as Record<T, string>
  );
}
