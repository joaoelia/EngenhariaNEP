package com.aerogestor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ordens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ordem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_ordem", nullable = false, unique = true)
    @JsonProperty("numero_ordem")
    private String numeroOrdem;

    @Column(name = "tipo_ordem", nullable = false)
    @JsonProperty("tipo_ordem")
    private String tipoOrdem;

    @Column(nullable = false)
    private String projeto;

    @Column(name = "part_number", nullable = false)
    @JsonProperty("part_number")
    private String partNumber;

    @Column(nullable = false)
    private String status;

    @Column(name = "data_criacao", nullable = false)
    @JsonProperty("data_criacao")
    private LocalDate dataCriacao;

    @Column(name = "data_conclusao")
    @JsonProperty("data_conclusao")
    private LocalDate dataConclusao;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "arquivo_pdf")
    @JsonProperty("arquivo_pdf")
    private String arquivoPdf;

    @Column(name = "dados_formulario", columnDefinition = "JSON")
    @JsonProperty("dados_formulario")
    private String dadosFormulario;

    @Column(name = "created_at", updatable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
