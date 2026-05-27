import api from '../config/api';
import i18n from '../config/i18n';

function normalizeWeekdayKey(day) {
  return String(day)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function translateWeekday(day) {
  if (!day) return '';
  return i18n.t(`calendar.weekdaysFull.${normalizeWeekdayKey(day)}`, {
    defaultValue: day,
  });
}

function buildLocalizedSlotLabel(slot) {
  const dayLabel = translateWeekday(slot.diaSemana);
  const start = String(slot.horaApertura ?? '').substring(0, 5);
  const end = String(slot.horaCierre ?? '').substring(0, 5);
  return `${dayLabel} - ${i18n.t('schedule.from', { defaultValue: 'de' })} ${start} ${i18n.t('schedule.to', { defaultValue: 'a' })} ${end}`;
}

const availabilityService = {
  createSlot: async (slotData) => {
    try {
      const response = await api.post('/horarios-talleres', slotData);
      return response.data;
    } catch (error) {
      console.error("Fallo al guardar horario:", error);
      throw new Error("Fallo al guardar las horas en la BD");
    }
  },

  getSlotsByWorkshopId: async (workshopId, semanas) => {
    try {
      const response = await api.get(
        `/horarios-talleres/taller/${workshopId}`,
        semanas ? { params: { semanas } } : undefined,
      );
      return response.data ?? [];

    } catch (error) {
      console.error("Error de conexión con la API de horarios:", error);
      return [];
    }
  },

  getSchedulesByWorkshopId: async (workshopId) => {
    try {
      const response = await api.get('/horarios-talleres');
      const schedules = response.data ?? [];

      return schedules.filter((schedule) => {
        const scheduleWorkshopId = schedule.idTaller?.idTaller ?? schedule.idTaller?.id_taller;
        return String(scheduleWorkshopId) === String(workshopId);
      });
    } catch (error) {
      console.error("Error cargando horarios del taller:", error);
      return [];
    }
  },

  getSlotsByDate: async (date) => {
    try {
      const response = await api.get('/horarios-talleres');
      const allSlots = response.data;
      
      return allSlots
        .filter((slot) => slot.diaSemana === String(date))
        .map((slot) => ({
          id: String(slot.idHorario),
          workshopId: String(slot.idTaller.idTaller),
          label: buildLocalizedSlotLabel(slot),
          date: slot.diaSemana,
          time: slot.horaApertura.substring(0, 5),
        }));
    } catch {
      return [];
    }
  },

  getSlotById: async (slotId) => {
    try {
      const response = await api.get(`/horarios-talleres/${slotId}`);
      const slot = response.data;

      return {
        id: String(slot.idHorario),
        workshopId: String(slot.idTaller.idTaller),
        label: buildLocalizedSlotLabel(slot),
        date: slot.diaSemana,
        time: slot.horaApertura.substring(0, 5),
      };
    } catch {
      return null;
    }
  },
};

export default availabilityService;
