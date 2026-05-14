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

const STATUS_UI = {
  loading: {
    title: "Procesando cancelacion",
    description: "Estamos anulando tu cita. Esto puede tardar unos segundos.",
    icon: Loader2,
    tone: "info",
  },
  cancelada: {
    title: "Cita cancelada",
    description: "Tu cita ha sido cancelada correctamente. Si quieres, puedes reservar un nuevo horario.",
    icon: CheckCircle2,
    tone: "success",
  },
  ya_cancelada: {
    title: "La cita ya estaba cancelada",
    description: "No es necesario hacer nada mas. Si deseas, puedes reservar una nueva cita.",
    icon: CheckCircle2,
    tone: "success",
  },
  expirada: {
    title: "El enlace ha expirado",
    description: "La cita ya no se puede cancelar porque la fecha ya paso.",
    icon: Clock,
    tone: "warning",
  },
  invalid: {
    title: "Enlace no valido",
    description: "El enlace de cancelacion no es valido o esta incompleto.",
    icon: AlertTriangle,
    tone: "danger",
  },
  not_found: {
    title: "Cita no encontrada",
    description: "No encontramos la cita asociada a este enlace.",
    icon: XCircle,
    tone: "danger",
  },
  error: {
    title: "No pudimos cancelar la cita",
    description: "Ocurrio un error inesperado. Intenta de nuevo mas tarde.",
    icon: XCircle,
    tone: "danger",
  },
};

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
        <span className={styles.eyebrow}>Gestion de citas</span>
        <div className={`${styles.statusIcon} ${styles[ui.tone]}`}>
          <Icon className={`${styles.statusIconSvg} ${status === "loading" ? styles.spinner : ""}`} strokeWidth={1.8} />
        </div>
        <h1 className={styles.title}>{ui.title}</h1>
        <p className={styles.description}>{message || ui.description}</p>

        {showActions && (
          <div className={styles.actions}>
            <Link to="/reservar" className={styles.primaryAction}>
              Reservar nueva cita
              <ArrowRight className={styles.actionIcon} strokeWidth={1.8} />
            </Link>
            <Link to="/" className={styles.secondaryAction}>
              Volver al inicio
            </Link>
          </div>
        )}

        {status === "loading" && (
          <p className={styles.helper}>No cierres esta ventana hasta terminar.</p>
        )}
      </div>
    </section>
  );
}
