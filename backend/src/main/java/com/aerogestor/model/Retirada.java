package com.aerogestor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "retiradas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Retirada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo_item", nullable = false)
    @JsonProperty("tipo_item")
    private String tipoItem; // consumivel, materia-prima, peca

    @Column(name = "item_id", nullable = false)
    @JsonProperty("item_id")
    private Long itemId;

    @Column(name = "item_nome", nullable = false)
    @JsonProperty("item_nome")
    private String itemNome;

    @Column(nullable = false)
    private Double quantidade;

    @Column(nullable = false)
    private String pessoa;

    @Column(nullable = false)
    private LocalDate data;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "created_at", updatable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
