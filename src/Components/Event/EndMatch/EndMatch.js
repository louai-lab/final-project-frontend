import React from "react";
import StyleEndMatch from "./EndMatch.module.css";
import { useLanguage } from "../../../Utils/LanguageContext";

function EndMatch({ closePopUpEndMatch, handleEndMatch }) {
  const { language } = useLanguage();

  return (
    <div className={StyleEndMatch.popUpContainer}>
      <h1 className={StyleEndMatch.confirmTitle}>
        {language === "en"
          ? "Are you sure to end this match?!"
          : "هل أنت متأكد من إنهاء هذه المباراة !؟"}
      </h1>
      <div className={StyleEndMatch.confirButtons}>
        <button
          type="button"
          onClick={handleEndMatch}
          className={StyleEndMatch.confirm}
        >
          {language === "en" ? "Confirm" : "تأكيد"}
        </button>
        <button
          type="button"
          onClick={closePopUpEndMatch}
          className={StyleEndMatch.cancelEnd}
        >
          {language === "en" ? "Cancel" : "إلغاء"}
        </button>
      </div>
    </div>
  );
}

export default EndMatch;
