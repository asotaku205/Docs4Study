import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "wouter";
import React from "react";
import { useLanguage } from "../../i18n/LanguageContext";

const BackButton = ({link, text}) => {
  const { t } = useLanguage();
  return (
    <Link href={link}>
      <span className="inline-block mb-6 text-sm text-primary font-medium hover:underline bg-white/90 px-4 py-2 rounded-md shadow-md cursor-pointer">
        <FontAwesomeIcon icon={faAngleLeft} /> {t.backButton.backTo} {text}
      </span>
    </Link>
  );
}
export default BackButton;
