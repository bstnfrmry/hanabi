export function playSound(path: string) {
  new Audio(path).play().catch((error) => {
    console.warn(error);
  });
}

export function vibrate(length: number) {
  try {
    navigator.vibrate(length);
  } catch (err) {
    console.warn(err);
  }
}
