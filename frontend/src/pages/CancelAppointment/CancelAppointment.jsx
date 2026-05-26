import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import appointmentService from "../../services/appointmentService";
import styles from "./CancelAppointment.module.css";
import { useTranslation } from "react-i18next";

function mapStatus(apiStatus) {
  switch (apiStatus) {
    case "CANCELADA":
      return "cancelada";
    case "YA_CANCELADA":
      return "ya_cancelada";
    case "TOKEN_EXPIRADO":
      return "expirada";
    case "TOKEN_INVALIDO":
      return "invalid";
    case "NO_ENCONTRADA":
      return "not_found";
    default:
      return "error";
  }
}

export default function CancelAppointment() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const requestSent = useRef(false);
  const { t } = useTranslation('booking');

  const STATUS_UI = {
    loading: {
      title: t("cancelPage.loading.title"),
      description: t("cancelPage.loading.description"),
      icon: Loader2,
      tone: "info",
    },
    cancelada: {
      title: t("cancelPage.cancelada.title"),
      description: t("cancelPage.cancelada.description"),
      icon: CheckCircle2,
      tone: "success",
    },
    ya_cancelada: {
      title: t("cancelPage.ya_cancelada.title"),
      description: t("cancelPage.ya_cancelada.description"),
      icon: CheckCircle2,
      tone: "success",
    },
    expirada: {
      title: t("cancelPage.expirada.title"),
      description: t("cancelPage.expirada.description"),
      icon: Clock,
      tone: "warning",
    },
    invalid: {
      title: t("cancelPage.invalid.title"),
      description: t("cancelPage.invalid.description"),
      icon: AlertTriangle,
      tone: "danger",
    },
    not_found: {
      title: t("cancelPage.not_found.title"),
      description: t("cancelPage.not_found.description"),
      icon: XCircle,
      tone: "danger",
    },
    error: {
      title: t("cancelPage.error.title"),
      description: t("cancelPage.error.description"),
      icon: XCircle,
      tone: "danger",
    },
  };

  useEffect(() => {
    if (requestSent.current) {
      return;
    }

    requestSent.current = true;

    if (!token) {
      setStatus("invalid");
      return;
    }

    appointmentService
      .cancelAppointmentByToken(token)
      .then((response) => {
        const nextStatus = mapStatus(response?.status);
        setStatus(nextStatus);
        if (response?.message) {
          setMessage(response.message);
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token]);

  const ui = STATUS_UI[status] ?? STATUS_UI.error;
  const Icon = ui.icon;
  const showActions = status !== "loading";

  return (
    <section className={styles.main}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>{t("cancelPage.eyebrow")}</span>
        <div className={`${styles.statusIcon} ${styles[ui.tone]}`}>
          <Icon className={`${styles.statusIconSvg} ${status === "loading" ? styles.spinner : ""}`} strokeWidth={1.8} />
        </div>
        <h1 className={styles.title}>{ui.title}</h1>
        {/* <p className={styles.description}>{message || ui.description}</p> */}

        {showActions && (
          <div className={styles.actions}>
            <Link to="/reservar" className={styles.primaryAction}>
              {t("cancelPage.actions.bookNew")}
              <ArrowRight className={styles.actionIcon} strokeWidth={1.8} />
            </Link>
            <Link to="/" className={styles.secondaryAction}>
              {t("cancelPage.actions.backHome")}
            </Link>
          </div>
        )}

        {status === "loading" && (
          <p className={styles.helper}>{t("cancelPage.helper")}</p>
        )}
      </div>
    </section>
  );
}
