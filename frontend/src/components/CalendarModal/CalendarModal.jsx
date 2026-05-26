import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../Modal";
import styles from "./CalendarModal.module.css";
import { useTranslation } from "react-i18next";

export default function CalendarModal({
  isOpen,
  onClose,
  onSelectDate,
  allowedDaysOfWeek = [],
  allowedDates = [],
}) {
  const { t, i18n } = useTranslation('common');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentDate, setCurrentDate] = useState(new Date(today));

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Días de la semana (Lunes a Domingo)
  const weekDays = t('calendar.weekdays', { returnObjects: true });

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

    const allowedDateMap = new Map();
    if (allowedDates.length > 0) {
      if (typeof allowedDates[0] === 'object' && allowedDates[0].fecha) {
        allowedDates.forEach(d => allowedDateMap.set(d.fecha, d));
      } else {
        allowedDates.forEach(d => allowedDateMap.set(d, { isString: true }));
      }
    }

    // Días reales del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const dateToCheck = new Date(currentYear, currentMonth, i);
      const jsDayOfWeek = dateToCheck.getDay(); // 0 = Domingo, 1 = Lunes...
      const localIsoDate = getLocalIsoDate(dateToCheck);
      
      // Ajustamos el día de la semana para que coincida con tu backend si es necesario 
      // (Aquí asumimos que 1=Lunes, 2=Martes... 0=Domingo)
      
      const isPast = dateToCheck < today;
      let isAllowedDate = false;
      let availabilityClass = "";
      let isDisabled = isPast;
      let remainingSpots = null;

      if (allowedDateMap.size > 0) {
        const dateData = allowedDateMap.get(localIsoDate);
        if (dateData) {
          isAllowedDate = true;
          if (!dateData.isString) {
            const { capacidadMaxima, ocupacionActual } = dateData;
            remainingSpots = capacidadMaxima - (ocupacionActual || 0);
            if (remainingSpots <= 0) {
              availabilityClass = styles.noAvailability;
              isDisabled = true;
            } else if (remainingSpots <= 2) { // Puedes ajustar este umbral
              availabilityClass = styles.lowAvailability;
            } else {
              availabilityClass = styles.highAvailability;
            }
          }
        }
      } else {
         isAllowedDate = allowedDaysOfWeek.includes(jsDayOfWeek);
      }

      const isAllowed = allowedDateMap.size > 0 ? isAllowedDate : (allowedDaysOfWeek.length === 0 || allowedDaysOfWeek.includes(jsDayOfWeek));
      isDisabled = isDisabled || !isAllowed;

      let btnClasses = `${styles.dayBtn}`;
      if (isDisabled) {
        btnClasses += ` ${styles.disabled}`;
        if (availabilityClass === styles.noAvailability) {
           btnClasses += ` ${styles.noAvailability}`;
        }
      } else {
        btnClasses += ` ${availabilityClass || styles.enabled}`;
      }

      days.push(
        <button
          key={i}
          type="button"
          disabled={isDisabled}
          className={btnClasses}
          onClick={() => handleDateClick(i)}
        >
          {remainingSpots !== null && isAllowedDate && (
             <span className={styles.spotsBadge}>{remainingSpots}</span>
          )}
          <span className={styles.dayNumber}>{i}</span>
        </button>
      );
    }
    return days;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('calendar.title')} showAction={false}>
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            className={styles.navBtn}
            aria-label={t('calendar.previousMonth')}
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className={styles.monthTitle}>
            {currentDate.toLocaleDateString(i18n.language, { month: "long", year: "numeric" })}
          </h3>
          <button
            type="button"
            onClick={handleNextMonth}
            className={styles.navBtn}
            aria-label={t('calendar.nextMonth')}
          >
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
