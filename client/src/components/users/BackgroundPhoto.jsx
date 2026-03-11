import { useLanguage } from "../../i18n/LanguageContext";

const BackgroundPhoto = ({ image }) => {
  const { t } = useLanguage();
  return (
    <div className="relative overflow-hidden h-96 lg:h-[500px]">
      <img
        src={image}
        alt={t.backgroundPhoto.alt}
        className="w-full  h-full object-cover"
      ></img>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent "></div>
    </div>
  );
};
export default BackgroundPhoto;