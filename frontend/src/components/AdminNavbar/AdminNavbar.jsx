import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, LogOut, User, ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/authStore";
import styles from "./AdminNavbar.module.css";

export default function AdminNavbar() {
    const { usuario, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { t, i18n } = useTranslation('common');

    function handleLogout() {
        logout();
        navigate("/admin/login");
    }

    const userName = usuario?.nombre || usuario?.email || t("adminNav.defaultUser");

    const handleLanguageToggle = () => {
        const langs = ["es", "gl", "en"];
        const currentLang = i18n.language?.split('-')[0] || "es";
        const currentIndex = langs.indexOf(currentLang);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % langs.length;
        i18n.changeLanguage(langs[nextIndex]);
    };

    const languageNames = {
        es: "Español",
        gl: "Galego",
        en: "English"
    };

    return (
        <nav className={styles.nav}>
            {/* Logo */}
            <Link to="/admin/cursos" className={styles.logoGroup}>
                {/* <div className={styles.logoIconBox}>
            <Sparkles className={styles.logoIcon} strokeWidth={1.8} />
          </div> */}
                <span className={styles.logoText}>
                    <span className={styles.logoMain}>IES TEIS</span>
                    <span className={styles.logoSeparator}> | </span>
                    <span className={styles.logoHighlight}>Imagen Personal</span>
                </span>
            </Link>

            <div className={styles.rightActions}>
                {/* Language Selector */}
                <div
                    className={styles.langSelectorWrapper}
                    onClick={(e) => {
                        if (e.target.tagName.toLowerCase() === 'select') return;
                        handleLanguageToggle();
                    }}
                >
                    <Globe className={styles.langIcon} strokeWidth={1.8} />
                    <span className={styles.langText}>{languageNames[i18n.language?.split('-')[0]] || "Español"}</span>
                    <select
                        className={styles.langSelectHidden}
                        value={i18n.language?.split('-')[0] || "es"}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                    >
                        <option value="es">Español</option>
                        <option value="gl">Galego</option>
                        <option value="en">English</option>
                    </select>
                </div>

                {/* User Menu */}
                <div className={styles.userMenuWrapper}>
                    <button
                        className={styles.userMenuBtn}
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        aria-label={t("adminNav.userMenu")}
                    >
                        <User className={styles.userIcon} strokeWidth={1.8} />
                        <span className={styles.userName}>{userName}</span>
                        <ChevronDown
                            className={`${styles.chevron} ${isUserMenuOpen ? styles.open : ""}`}
                            strokeWidth={1.8}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                        <>
                            {/* Overlay para cerrar el menu */}
                            <div
                                className={styles.dropdownOverlay}
                                onClick={() => setIsUserMenuOpen(false)}
                            />

                            <div className={styles.dropdown}>
                                <div className={styles.userInfo}>
                                    <div className={styles.userAvatar}>
                                        <User className={styles.avatarIcon} strokeWidth={1.8} />
                                    </div>
                                    <div>
                                        <p className={styles.userFullName}>{userName}</p>
                                        <p className={styles.userEmail}>
                                            {usuario?.email || "profesor@ies-teis.es"}
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.divider} />

                                <Link
                                    to="/admin/perfil"
                                    className={styles.menuItem}
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <User className={styles.menuIcon} strokeWidth={1.8} />
                                    <span>{t("adminNav.editProfile")}</span>
                                </Link>

                                <button
                                    className={styles.logoutItem}
                                    onClick={handleLogout}
                                >
                                    <LogOut className={styles.menuIcon} strokeWidth={1.8} />
                                    <span>{t("adminNav.logout")}</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
