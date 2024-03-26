import React from "react";
import StyleDeleteEvent from "./EventDelete.module.css";
import { useLanguage } from "../../../Utils/LanguageContext";

function EventDelete({ cancelDeleteEvent, handleDeleteEvent }) {
  const { language } = useLanguage();

  return (
    <div className={StyleDeleteEvent.popUpContainer}>
      <h1>
        {language === "en"
          ? "Are you sure to Delete this event?!"
          : "هل أنت متأكد من حذف هذا الحدث !؟"}
      </h1>
      <div>
        <div className={StyleDeleteEvent.control}>
          <button
            type="button"
            onClick={handleDeleteEvent}
            className={StyleDeleteEvent.addEvent}
          >
            {language === "en" ? "Confirm" : "تأكيد"}
          </button>
          <button
            type="button"
            onClick={cancelDeleteEvent}
            className={StyleDeleteEvent.cancelEvent}
          >
            {language === "en" ? "Cancel" : "إلغاء"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDelete;
