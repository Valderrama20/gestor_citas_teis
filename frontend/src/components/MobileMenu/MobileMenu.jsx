import { X } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./MobileMenu.module.css";

export default function MobileMenu({ isOpen, onClose, menuItems = [], onLogout = null }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className={styles.overlay} onClick={onClose} />

            {/* Drawer */}
            <div className={styles.drawer}>
                {/* Close Button */}
                <button
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Cerrar menú"
                >
                    <X strokeWidth={1.8} />
                </button>

                {/* Menu Items */}
                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={styles.menuItem}
                            onClick={onClose}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button (si existe) */}
                {onLogout && (
                    <button className={styles.logoutBtn} onClick={onLogout}>
                        Salir
                    </button>
                )}
            </div>
        </>
    );
}
