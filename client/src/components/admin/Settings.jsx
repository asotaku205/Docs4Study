import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/i18n/LanguageContext";

const SETTINGS_KEY = 'admin_platform_settings';

const defaultSettings = {
  platformName: "Docs4Study",
  supportEmail: "support@docs4study.com",
  description: "The ultimate platform for learning and sharing educational content.",
};

export default function Settings() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) setSettings(JSON.parse(stored));
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">{t("admin.settingsMgmt.title")}</h2>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.settingsMgmt.general")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">{t("admin.settingsMgmt.platformName")}</label>
            <Input 
              className="mt-1" 
              value={settings.platformName} 
              onChange={(e) => handleChange('platformName', e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-medium">{t("admin.settingsMgmt.supportEmail")}</label>
            <Input 
              className="mt-1" 
              value={settings.supportEmail} 
              onChange={(e) => handleChange('supportEmail', e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-medium">{t("admin.settingsMgmt.description")}</label>
            <textarea 
              className="w-full h-24 border border-input rounded-md p-3 text-sm mt-1 resize-none" 
              value={settings.description} 
              onChange={(e) => handleChange('description', e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSave}>{t("admin.settingsMgmt.saveChanges")}</Button>
            {saved && <span className="text-sm text-green-600">{t("admin.settingsMgmt.saved")}</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
