import React from "react";
import { useTranslation } from "react-i18next";

import Txt, { TxtSize } from "~/components/ui/txt";

export default function LoadingScreen() {
  const { t } = useTranslation();

  return (
    <div className="w-100 h-100 flex flex-column justify-center items-center bg-main-dark pa2 pv4-l ph3-l shadow-5 br3">
      <div className="animate-opacity">
        <Txt size={TxtSize.LARGE} value={t("loading")} />
      </div>
      <style jsx>{`
        @keyframes opacityAnimation {
          /* flame pulses */
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-opacity {
          opacity: 1;
          animation: opacityAnimation 3s infinite;
        }
      `}</style>
    </div>
  );
}
