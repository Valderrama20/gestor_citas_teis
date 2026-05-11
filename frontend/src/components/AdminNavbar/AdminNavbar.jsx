import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, LogOut, User, ChevronDown } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import styles from "./AdminNavbar.module.css";

export default function AdminNavbar() {
    const { usuario, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate("/admin/login");
    }

    const userName = usuario?.nombre || usuario?.email || "Usuario";

    return (
        <nav className={styles.nav}>
            {/* Logo */}
            <Link to="/admin/cursos" className={styles.logoGroup}>
                <div className={styles.logoIconBox}>
                    <Sparkles className={styles.logoIcon} strokeWidth={1.8} />
                </div>
                <span className={styles.logoText}>
                    IES TEIS <span className={styles.logoHighlight}>Estetica</span>
                </span>
            </Link>

            {/* User Menu */}
            <div className={styles.userMenuWrapper}>
                <button
                    className={styles.userMenuBtn}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="Menú de usuario"
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
                                <span>Editar perfil</span>
                            </Link>

                            <button
                                className={styles.logoutItem}
                                onClick={handleLogout}
                            >
                                <LogOut className={styles.menuIcon} strokeWidth={1.8} />
                                <span>Salir</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}
