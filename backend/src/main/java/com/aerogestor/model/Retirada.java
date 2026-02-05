package com.aerogestor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String tipoItem; // consumivel, materia-prima, peca

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(name = "item_nome", nullable = false)
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
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
