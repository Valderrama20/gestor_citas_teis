import { Lock, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/admin/cursos");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.logo}>
          <Sparkles className={styles.logoIcon} strokeWidth={1.8} />
        </div>

        <h1 className={styles.title}>Acceso Profesor</h1>
        <p className={styles.subtitle}>Gestiona las citas del IES TEIS</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} strokeWidth={1.8} />
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email institucional"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} strokeWidth={1.8} />
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Contrasena"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Entrar al panel
          </button>
        </form>
      </section>
    </main>
  );
}
