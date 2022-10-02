import * as colors from "nice-color-palettes/1000";

export function colorPaletteFromId(id: string) {
  const hashedValue = id.split("").reduce((prev, current, index) => {
    return prev + current.charCodeAt(0);
  }, 0);

  return colors[hashedValue % 1000];
}
