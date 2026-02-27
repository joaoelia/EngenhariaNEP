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

    @Column(name = "item_part_number")
    @JsonProperty("item_part_number")
    private String itemPartNumber;

    @Column(name = "item_fornecedor")
    @JsonProperty("item_fornecedor")
    private String itemFornecedor;

    @Column(name = "item_local_estoque")
    @JsonProperty("item_local_estoque")
    private String itemLocalEstoque;

    @Column(name = "item_lote")
    @JsonProperty("item_lote")
    private String itemLote;

    @Column(name = "item_data_entrada")
    @JsonProperty("item_data_entrada")
    private LocalDate itemDataEntrada;

    @Column(name = "item_altura")
    @JsonProperty("item_altura")
    private Double itemAltura;

    @Column(name = "item_largura")
    @JsonProperty("item_largura")
    private Double itemLargura;

    @Column(name = "item_espessura")
    @JsonProperty("item_espessura")
    private Double itemEspessura;

    @Column(name = "item_especificacao")
    @JsonProperty("item_especificacao")
    private String itemEspecificacao;

    @Column(name = "item_unidade_medida")
    @JsonProperty("item_unidade_medida")
    private String itemUnidadeMedida;

    @Column(name = "item_nota_fiscal")
    @JsonProperty("item_nota_fiscal")
    private String itemNotaFiscal;

    @Column(name = "item_cert_composicao")
    @JsonProperty("item_cert_composicao")
    private String itemCertComposicao;

    @Column(name = "item_relatorio_propriedades")
    @JsonProperty("item_relatorio_propriedades")
    private String itemRelatorioPropriedades;

    @Column(name = "item_laudo_penetrante")
    @JsonProperty("item_laudo_penetrante")
    private String itemLaudoPenetrante;

    @Column(name = "item_imagens", columnDefinition = "JSON")
    @JsonProperty("item_imagens")
    private String itemImagens;

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
