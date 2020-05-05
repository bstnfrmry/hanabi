import ReactGA from "react-ga";
import { hotjar } from "react-hotjar";

const isDevelopment = process.env.NODE_ENV === "development";

export const initGA = () => {
  if (isDevelopment) return;

  ReactGA.initialize("UA-56583082-2");
  hotjar.initialize(+process.env.HOTJAR_ID, 6);
};

export const logPageView = () => {
  if (isDevelopment) return;

  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
