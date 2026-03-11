import React from "react";
import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <>
      <footer className="bg-white border-t backdrop-blur text-center py-12 w-full">
        <div className="mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mx-auto px-4 text-left">
            <div className=" space-y-4 ">
              <span className="text-2xl font-bold gap-2 flex items-center select-none">
                <span className="bg-primary text-white px-2 py-1 rounded font-heading">
                  D4S
                </span>
                Docs4Study
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.footer.description}
              </p>
            </div>
            <div className=" space-y-4 ">
              <h4 className="font-bold mb-4">{t.footer.quickLinks}</h4>
              <ul>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>{t.footer.browseDocuments}</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>{t.footer.onlineCourses}</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>{t.footer.blogsNews}</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>{t.footer.pricing}</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.footer.support}</h4>
              <ul>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>{t.footer.helpCenter}</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>{t.footer.termsOfService}</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>{t.footer.legal}</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>{t.footer.privacyPolicy}</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t.footer.subscribe}</h4>
              <p className="mb-4 text-muted-foreground">{t.footer.subscribeDescription}</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t.footer.yourEmail}
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary/80 transition-colors cursor-pointer select-none">
                  {t.footer.join}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 ">
            <p className="text-muted-foreground mb-4">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
