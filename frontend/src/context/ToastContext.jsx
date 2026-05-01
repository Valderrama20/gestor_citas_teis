import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast/Toast";

// 1. Creamos la emisora de radio (Contexto)
const ToastContext = createContext();

// 2. Este es el "Proveedor": envolverá a toda la app para darles superpoderes
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    // Función para añadir una notificación
    const addToast = useCallback((message, type = "success") => {
        const id = Date.now(); // Generamos un ID único por tiempo
        setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    }, []);

    // Función para eliminarla (la usará el componente Toast al terminar su tiempo)
    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* 3. El contenedor donde se dibujarán los Toasts flotando */}
            <div style={{
                position: "fixed",
                top: "2rem",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center"
            }}>
                {toasts.map((t) => (
                    <Toast
                        key={t.id}
                        message={t.message}
                        type={t.type}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

// 4. El "Gancho" (Hook): lo que usarás en tus páginas para lanzar el aviso
export function useToast() {
    return useContext(ToastContext);
}