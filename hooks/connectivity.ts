import { useEffect, useState } from "react";

export default function useConnectivity() {
  const [online, setOnline] = useState(true);

  const onOnline = () => setOnline(true);
  const onOffline = () => setOnline(false);

  useEffect(() => {
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return online;
}
