import ReactGA from "react-ga";

const isDevelopment = process.env.NODE_ENV === "development";

export const initGA = () => {
  if (isDevelopment) return;

  ReactGA.initialize("UA-56583082-2");
};

export const logPageView = () => {
  if (isDevelopment) return;

  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
