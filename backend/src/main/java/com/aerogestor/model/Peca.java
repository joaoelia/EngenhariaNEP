package com.aerogestor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pecas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Peca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_peca", nullable = false, unique = true)
    private String codigoPeca;

    @Column(nullable = false)
    private String descricao;

    @Column(name = "numero_desenho", nullable = false)
    private String numeroDesenho;

    private String revisao;

    @Column(name = "quantidade_produzida", nullable = false)
    private Integer quantidadeProduzida;

    @Column(name = "unidade_medida")
    private String unidadeMedida;

    @Column(name = "data_fabricacao", nullable = false)
    private LocalDate dataFabricacao;

    @Column(name = "lote_producao")
    private String loteProducao;

    @Column(name = "operador_responsavel")
    private String operadorResponsavel;

    @Column(name = "maquina_utilizada")
    private String maquinaUtilizada;

    @Column(name = "tempo_fabricacao_horas")
    private Double tempoFabricacaoHoras;

    @Column(name = "status_qualidade", nullable = false)
    private String statusQualidade;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
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
