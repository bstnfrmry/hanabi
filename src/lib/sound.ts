export async function playSound(path: string) {
  new Audio(path).play().catch(e => {
    // Playing a sound before any user interaction triggers an error
    // Prevent it from polluting the error logs
    // @see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
    if (e.name === "NotAllowedError") {
      return;
    }

    // Some browsers can't play sounds
    if (e.name === "NotSupportedError") {
      return;
    }

    throw e;
  });
}
