export function playSound(path: string) {
  console.info(`Play Sound: ${path}`);
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
