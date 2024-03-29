import React from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "~/components/ui/forms";
import { Modal } from "~/components/ui/modal";
import Txt, { TxtSize } from "~/components/ui/txt";
import { UserPreferences } from "~/hooks/userPreferences";

interface Props {
  onCloseArea: () => void;
  userPreferences: UserPreferences;
  saveUserPreferences: (userPreferences: UserPreferences) => void;
}

export default function UserPreferencesDialog({ onCloseArea, userPreferences, saveUserPreferences }: Props) {
  const { t } = useTranslation();
  function toggleSoundOnStrike() {
    const modifiedPreferences = { ...userPreferences, soundOnStrike: !userPreferences.soundOnStrike };
    saveUserPreferences(modifiedPreferences);
  }
  function toggleShowFireworksAtGameEnd() {
    const modifiedPreferences = { ...userPreferences, showFireworksAtGameEnd: !userPreferences.showFireworksAtGameEnd };
    saveUserPreferences(modifiedPreferences);
  }
  function toggleColorBlindMode() {
    const modifiedPreferences = { ...userPreferences, colorBlindMode: !userPreferences.colorBlindMode };
    saveUserPreferences(modifiedPreferences);
  }

  return (
    <Modal isOpen onRequestClose={() => onCloseArea()}>
      <div className="flex flex-column justify-center items-center w-100 h-100 pa2 z-10">
        <div className="flex flex-column justify-center items-center">
          <Txt className="ttu txt-yellow mb4 mb5-l" size={TxtSize.MEDIUM} value={t("userPreferences")} />

          <div className="mb4 mb5-l">
            <div className="flex flex-row justify-start-l items-center">
              <Checkbox checked={userPreferences.soundOnStrike} onChange={() => toggleSoundOnStrike()} />
              &nbsp;
              <Txt value={t("soundOnStrike")} />
            </div>
            <div className="flex flex-row justify-start-l items-center">
              <Checkbox
                checked={userPreferences.showFireworksAtGameEnd}
                onChange={() => toggleShowFireworksAtGameEnd()}
              />
              &nbsp;
              <Txt value={t("playFireworksAtGameEnd")} />
            </div>
            <div className="flex flex-row justify-start-l items-center">
              <Checkbox checked={userPreferences.colorBlindMode} onChange={() => toggleColorBlindMode()} />
              &nbsp;
              <Txt value={t("colorBlindMode")} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
