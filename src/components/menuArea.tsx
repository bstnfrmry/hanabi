import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "~/components/languageSelector";
import Rules from "~/components/rules";
import { TutorialContext } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import { Modal } from "~/components/ui/modal";
import Txt, { TxtSize } from "~/components/ui/txt";
import UserPreferencesDialog from "~/components/userPreferencesDialog";
import { useEditableUserPreferences, UserPreferences } from "~/hooks/userPreferences";

interface Props {
  onCloseArea: () => void;
}

export default function MenuArea(props: Props) {
  const { onCloseArea } = props;

  const [showRules, setShowRules] = useState(false);
  const { reset } = useContext(TutorialContext);
  const router = useRouter();
  const { t } = useTranslation();
  const [showUserPreferences, setShowUserPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useEditableUserPreferences();

  function onPrefClick() {
    setShowUserPreferences(true);
  }
  function onMenuClick() {
    router.push("/");
  }

  function onTutorialClick() {
    reset();
    onCloseArea();
  }

  if (showUserPreferences) {
    return (
      <UserPreferencesDialog
        saveUserPreferences={(userPreferences: UserPreferences) => {
          setUserPreferences(userPreferences);
        }}
        userPreferences={userPreferences}
        onCloseArea={() => {
          setShowUserPreferences(false);
        }}
      />
    );
  }

  return (
    <Modal isOpen onRequestClose={() => onCloseArea()}>
      <div className="flex flex-column justify-center items-center w-100 h-100 pa2 z-10">
        {!showRules && (
          <div className="flex flex-column justify-center items-center">
            <Txt className="ttu txt-yellow mb4 mb5-l" size={TxtSize.MEDIUM} value={t("hanab")} />

            <div className="mb4 mb5-l">
              <LanguageSelector />
            </div>
            <Button className="mb3 w-100" size={ButtonSize.MEDIUM} text={t("userPreferences")} onClick={onPrefClick} />
            <Button className="mb3 w-100" size={ButtonSize.MEDIUM} text={t("menu")} onClick={onMenuClick} />
            <Button className="mb3 w-100" size={ButtonSize.MEDIUM} text={t("tutorial")} onClick={onTutorialClick} />
            <Button
              className="mb3 w-100"
              size={ButtonSize.MEDIUM}
              text={t("rules")}
              onClick={() => setShowRules(true)}
            />
          </div>
        )}

        {showRules && (
          <div className="overflow-y-scroll">
            <Rules setShowRules={setShowRules} />
          </div>
        )}
      </div>
    </Modal>
  );
}
