export function playSound(path: string) {
  new Audio(path).play().catch(error => {
    console.warn(error);
  });
}
