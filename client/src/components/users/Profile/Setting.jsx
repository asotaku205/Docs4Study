import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShield, faCamera, faKey, faArrowRightFromBracket, faCheck, faGlobe } from "@fortawesome/free-solid-svg-icons";
import ChangePasswordModal from "./ChangePasswordModal";
import authService from "../../../services/authService";
import apiUser from "../../../services/apiUser";
import { uploadService } from "../../../services/uploadService";
import { useLanguage } from "../../../i18n/LanguageContext";
import { getAvatarUrl } from "../../../utils/url";

const Setting = ({ user = {}, onProfileUpdate }) => {
    const [, setLocation] = useLocation();
    const { t, language, changeLanguage } = useLanguage();
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ text: "", type: "" });
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setAvatarUrl(user.avatar || "");
            setAvatarPreview(getAvatarUrl(user.avatar, user.fullName));
        }
    }, [user]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Kiểm tra file
        if (!file.type.startsWith('image/')) {
            setSaveMessage({ text: t.settings.selectImage, type: "error" });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setSaveMessage({ text: t.settings.imageTooLarge, type: "error" });
            return;
        }

        // Hiển thị xem trước ngay lập tức
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);

        // Tải file lên
        try {
            setUploadingAvatar(true);
            const result = await uploadService.uploadSingle(file);
            setAvatarUrl(result.url);
            setSaveMessage({ text: t.settings.avatarUploaded, type: "info" });
            setTimeout(() => setSaveMessage({ text: "", type: "" }), 4000);
        } catch (error) {
            console.error("Avatar upload error:", error);
            setSaveMessage({ text: t.settings.avatarUploadFailed, type: "error" });
            setAvatarPreview(getAvatarUrl(user.avatar, user.fullName));
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSaveChanges = async () => {
        if (!fullName.trim()) {
            setSaveMessage({ text: t.settings.fullNameRequired, type: "error" });
            return;
        }

        try {
            setSaving(true);
            setSaveMessage({ text: "", type: "" });
            const response = await apiUser.put('/user/profile', { 
                fullName: fullName.trim(), 
                avatar: avatarUrl || null
            });

            const updatedUser = response.data.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setSaveMessage({ text: t.settings.profileUpdated, type: "success" });
            if (onProfileUpdate) onProfileUpdate();

            setTimeout(() => setSaveMessage({ text: "", type: "" }), 3000);
        } catch (error) {
            setSaveMessage({ text: error.response?.data?.message || t.settings.updateFailed, type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        const confirmLogout = window.confirm(t.settings.confirmLogout);
        if (confirmLogout) {
            try {
                await authService.signout();
            } catch (error) {
                console.error("Logout error:", error);
            } finally {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                window.location.href = "/auth";
            }
        }
    };

    return (
        <>
            <div className="mt-2 space-y-6">
                {/* Avatar & Account Info */}
                <div className="rounded-xl border bg-card text-card-foreground border-border shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6 border-b border-border bg-muted/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="font-semibold tracking-tight text-lg">{t.settings.profileSettings}</div>
                                <div className="text-muted-foreground text-xs">{t.settings.profileSubtitle}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-border shadow-md">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingAvatar}
                                    className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
                                >
                                    {uploadingAvatar ? (
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <FontAwesomeIcon icon={faCamera} className="text-white text-lg" />
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{user.fullName || "User"}</p>
                                <p className="text-xs text-muted-foreground mb-2">{user.email || ""}</p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingAvatar}
                                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
                                >
                                    {uploadingAvatar ? t.settings.uploading : t.settings.changeAvatar}
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-border" />

                        {/* Form Fields */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.settings.fullNameLabel}</label>
                                <input
                                    className="flex h-10 w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary bg-background border-border"
                                    placeholder={t.settings.fullNamePlaceholder}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.settings.emailLabel}</label>
                                <input
                                    className="flex h-10 w-full rounded-lg border px-3 py-2 text-sm shadow-sm bg-muted/50 border-border cursor-not-allowed text-muted-foreground"
                                    type="email"
                                    value={email}
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Save Message */}
                        {saveMessage.text && (
                            <div className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg ${
                                saveMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                                saveMessage.type === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                                {saveMessage.type === 'success' && <FontAwesomeIcon icon={faCheck} />}
                                {saveMessage.text}
                            </div>
                        )}

                        {/* Save Button */}
                        <button
                            onClick={handleSaveChanges}
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 min-h-10 py-2.5 px-8"
                        >
                            {saving ? t.settings.saving : t.settings.saveChanges}
                        </button>
                    </div>
                </div>

                {/* Language & Region */}
                <div className="rounded-xl border bg-card text-card-foreground border-border shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6 border-b border-border bg-muted/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                                <FontAwesomeIcon icon={faGlobe} className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="font-semibold tracking-tight text-lg">{t.settings.languageSection}</div>
                                <div className="text-muted-foreground text-xs">{t.settings.languageSectionSubtitle}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.settings.languageLabel}</label>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`flex items-center gap-3 flex-1 p-3 rounded-lg border-2 transition-all ${
                                        language === 'en' 
                                            ? 'border-primary bg-primary/5 shadow-sm' 
                                            : 'border-border hover:border-primary/30 hover:bg-muted/50'
                                    }`}
                                >
                                    <span className="text-2xl">🇬🇧</span>
                                    <div className="text-left">
                                        <p className="text-sm font-medium">English</p>
                                        <p className="text-xs text-muted-foreground">English</p>
                                    </div>
                                    {language === 'en' && (
                                        <FontAwesomeIcon icon={faCheck} className="ml-auto text-primary" />
                                    )}
                                </button>
                                <button
                                    onClick={() => changeLanguage('vi')}
                                    className={`flex items-center gap-3 flex-1 p-3 rounded-lg border-2 transition-all ${
                                        language === 'vi' 
                                            ? 'border-primary bg-primary/5 shadow-sm' 
                                            : 'border-border hover:border-primary/30 hover:bg-muted/50'
                                    }`}
                                >
                                    <span className="text-2xl">🇻🇳</span>
                                    <div className="text-left">
                                        <p className="text-sm font-medium">Tiếng Việt</p>
                                        <p className="text-xs text-muted-foreground">Vietnamese</p>
                                    </div>
                                    {language === 'vi' && (
                                        <FontAwesomeIcon icon={faCheck} className="ml-auto text-primary" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy & Security */}
                <div className="rounded-xl border bg-card text-card-foreground border-border shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6 border-b border-border bg-muted/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
                                <FontAwesomeIcon icon={faShield} className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="font-semibold tracking-tight text-lg">{t.settings.security}</div>
                                <div className="text-muted-foreground text-xs">{t.settings.securitySubtitle}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-3">
                        <button
                            onClick={() => setIsChangePasswordModalOpen(true)}
                            className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <FontAwesomeIcon icon={faKey} className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{t.settings.changePassword}</p>
                                <p className="text-xs text-muted-foreground">{t.settings.updatePassword}</p>
                            </div>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-red-50 transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-muted group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-red-600">{t.settings.logoutLabel}</p>
                                <p className="text-xs text-muted-foreground">{t.settings.logoutSubtitle}</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={() => setIsChangePasswordModalOpen(false)}
            />
        </>
    );
}
export default Setting;