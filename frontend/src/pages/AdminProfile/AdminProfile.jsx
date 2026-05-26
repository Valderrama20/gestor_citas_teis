import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Lock, Camera, Save, ChevronLeft } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import AdminTopbar from "../../components/AdminTopbar/AdminTopbar";
import styles from "./AdminProfile.module.css";
import { useTranslation } from "react-i18next";

export default function AdminProfile() {
    const { usuario } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation('admin');

    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || "",
        email: usuario?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Aquí irá tu conexión a la API (Ej: adminService.updateProfile)
            // await adminService.updateProfile(formData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert(t("profile.alerts.success"));
        } catch (error) {
            console.error(error);
            alert(t("profile.alerts.error"));
        } finally {
            setIsSubmitting(false);
        }
    }

    // Extraemos y formateamos los roles (ej: ROLE_ADMIN -> ADMIN)
    const rolesRaw = usuario?.roles && usuario.roles.length > 0 ? (Array.isArray(usuario.roles) ? usuario.roles : [usuario.roles]) : ["USUARIO"];
    const rolesString = rolesRaw.map(role => {
        const roleName = String(typeof role === 'string' ? role : (role?.nombreRol || role?.authority || "USUARIO"));
        return roleName.replace('ROLE_', '');
    }).join(', ');

    return (
        <div className={styles.container}>
            <AdminTopbar
                startContent={
                    <button type="button" onClick={() => navigate(-1)} className={styles.textButton}>
                        <ChevronLeft size={18} />
                        <span>{t("profile.back")}</span>
                    </button>
                }
                endContent={
                    <div className={styles.brand}>
                        <User size={18} />
                        <span>{t("profile.brand")}</span>
                    </div>
                }
            />

            <main className={styles.main}>
                <header className={styles.headerRow}>
                    <div className={styles.titleSection}>
                        <h1 className={styles.title}>{t("profile.title")}</h1>
                        <p className={styles.subtitle}>{t("profile.subtitle")}</p>
                    </div>
                </header>

                <div className={styles.grid}>

                    {/* Tarjeta de Información de Usuario */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>{t("profile.personal.title")}</h2>
                            <p className={styles.cardSubtitle}>{t("profile.personal.subtitle")}</p>
                        </div>

                        <div className={styles.avatarSection}>
                            <div className={styles.avatarWrapper}>
                                <User className={styles.avatarIcon} size={48} strokeWidth={1.5} />
                                <button className={styles.avatarEditBtn} aria-label={t("profile.personal.ariaPhoto")}>
                                    <Camera size={16} />
                                </button>
                            </div>
                            <div className={styles.roleTag}>
                                <Shield size={14} />
                                <span>{rolesString}</span>
                            </div>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.field}>
                                <label className={styles.label}>{t("profile.personal.name")}</label>
                                <div className={styles.inputWrapper}>
                                    <User className={styles.inputIcon} size={18} />
                                    <input
                                        type="text" name="nombre"
                                        className={styles.input}
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>{t("profile.personal.email")}</label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={18} />
                                    <input
                                        type="email" name="email"
                                        className={styles.input}
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled // El correo suele requerir otra validación o no ser editable
                                    />
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                                    {isSubmitting ? t("profile.personal.saving") : t("profile.personal.save")}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tarjeta de Seguridad (Contraseña) */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>{t("profile.security.title")}</h2>
                            <p className={styles.cardSubtitle}>{t("profile.security.subtitle")}</p>
                        </div>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.field}>
                                <label className={styles.label}>{t("profile.security.current")}</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={18} />
                                    <input
                                        type="password" name="currentPassword"
                                        className={styles.input}
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>{t("profile.security.new")}</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={18} />
                                    <input
                                        type="password" name="newPassword"
                                        className={styles.input}
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button type="button" className={styles.primaryButton}>
                                    {t("profile.security.update")}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
}