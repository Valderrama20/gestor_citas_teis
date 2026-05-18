import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../Modal";
import styles from "./CalendarModal.module.css";

export default function CalendarModal({
  isOpen,
  onClose,
  onSelectDate,
  allowedDaysOfWeek = [],
  allowedDates = [],
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentDate, setCurrentDate] = useState(new Date(today));

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Días de la semana (Lunes a Domingo)
  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Ajustamos para que Lunes sea el primer día (0)
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getLocalIsoDate = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    onSelectDate(getLocalIsoDate(selectedDate));
    onClose();
  };

  // Prevenimos volver a meses anteriores al actual
  const isPrevDisabled = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const renderDays = () => {
    const days = [];
    // Espacios vacíos al principio del mes
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    const allowedDateSet = new Set(allowedDates.filter(Boolean));

    // Días reales del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const dateToCheck = new Date(currentYear, currentMonth, i);
      const jsDayOfWeek = dateToCheck.getDay(); // 0 = Domingo, 1 = Lunes...
      const localIsoDate = getLocalIsoDate(dateToCheck);
      
      // Ajustamos el día de la semana para que coincida con tu backend si es necesario 
      // (Aquí asumimos que 1=Lunes, 2=Martes... 0=Domingo)
      
      const isPast = dateToCheck < today;
      const isAllowedDate = allowedDateSet.size === 0 || allowedDateSet.has(localIsoDate);
      const isAllowedDay = allowedDaysOfWeek.length === 0 || allowedDaysOfWeek.includes(jsDayOfWeek);
      const isAllowed = allowedDateSet.size > 0 ? isAllowedDate : isAllowedDay;
      const isDisabled = isPast || !isAllowed;

      days.push(
        <button
          key={i}
          type="button"
          disabled={isDisabled}
          className={`${styles.dayBtn} ${isDisabled ? styles.disabled : styles.enabled}`}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </button>
      );
    }
    return days;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Seleccionar Fecha" showAction={false}>
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <button type="button" onClick={handlePrevMonth} disabled={isPrevDisabled} className={styles.navBtn}>
            <ChevronLeft size={20} />
          </button>
          <h3 className={styles.monthTitle}>
            {currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
          </h3>
          <button type="button" onClick={handleNextMonth} className={styles.navBtn}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className={styles.weekDays}>
          {weekDays.map((day) => (
            <span key={day} className={styles.weekDayLabel}>{day}</span>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {renderDays()}
        </div>
      </div>
    </Modal>
  );
}