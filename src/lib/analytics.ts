import ReactGA from "react-ga";
import { hotjar } from "react-hotjar";

const { NODE_ENV, GOOGLE_ANALYTICS_ID, HOTJAR_ID } = process.env;

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

export const logPageView = () => {
  if (isDevelopment) return;

  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
