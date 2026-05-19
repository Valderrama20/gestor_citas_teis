package es.iesdeteis.gestorcitas.dto;

import java.time.LocalDate;

public class HorarioDisponibleDTO {
    private Long id;
    private Long workshopId;
    private String label;
    private String date;
    private String time;
    private LocalDate fecha;
    private Integer capacidadMaxima;
    private Integer ocupacionActual;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getWorkshopId() {
        return workshopId;
    }

    public void setWorkshopId(Long workshopId) {
        this.workshopId = workshopId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Integer getCapacidadMaxima() {
        return capacidadMaxima;
    }

    public void setCapacidadMaxima(Integer capacidadMaxima) {
        this.capacidadMaxima = capacidadMaxima;
    }

    public Integer getOcupacionActual() {
        return ocupacionActual;
    }

    public void setOcupacionActual(Integer ocupacionActual) {
        this.ocupacionActual = ocupacionActual;
    }
}
