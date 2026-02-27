package com.aerogestor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "materia_prima")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MateriaPrima {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private String descricao;

    @Column(name = "tipo_material", nullable = false)
    @JsonProperty("tipo_material")
    private String tipoMaterial;

    private Double densidade;

    private String especificacao;

    private Double altura;

    private Double largura;

    private Double espessura;

    @Column(name = "quantidade_estoque", nullable = false)
    @JsonProperty("quantidade_estoque")
    private Double quantidadeEstoque;

    @Column(name = "unidade_medida", nullable = false)
    @JsonProperty("unidade_medida")
    private String unidadeMedida;

    private String lote;

    @Column(name = "data_entrada")
    @JsonProperty("data_entrada")
    private LocalDate dataEntrada;

    @Column(nullable = false)
    private String fornecedor;

    @Column(name = "certificado_qualidade")
    @JsonProperty("certificado_qualidade")
    private String certificadoQualidade;

    @Column(name = "cert_composicao")
    @JsonProperty("cert_composicao")
    private String certComposicao;

    @Column(name = "relatorio_propriedades")
    @JsonProperty("relatorio_propriedades")
    private String relatorioPropriedades;

    @Column(name = "laudo_penetrante")
    @JsonProperty("laudo_penetrante")
    private String laudoPenetrante;

    @Column(name = "nota_fiscal")
    @JsonProperty("nota_fiscal")
    private String notaFiscal;

    @Column(columnDefinition = "JSON")
    private String imagens;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

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
