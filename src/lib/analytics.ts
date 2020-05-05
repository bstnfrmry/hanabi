import ReactGA from "react-ga";
import { hotjar } from "react-hotjar";

const NODE_ENV = process.env.NODE_ENV;
const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;
const HOTJAR_ID = process.env.HOTJAR_ID;

const isDevelopment = NODE_ENV === "development";

export const initGA = () => {
  if (isDevelopment) return;

  if (GOOGLE_ANALYTICS_ID) {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID);
  }

  if (HOTJAR_ID) {
    hotjar.initialize(+HOTJAR_ID, 6);
  }
};

export function logPageView() {
  if (isDevelopment) return;

  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

export function logEvent(category: string, action: string) {
  if (isDevelopment) return;

  ReactGA.event({ category, action });
}
