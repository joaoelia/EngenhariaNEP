package com.aerogestor.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Data
public class MateriaPrimaRequestDTO {
    private String nome;
    private Integer quantidade;
    private Integer estoqueMinimo;
    private Integer estoqueMaximo;
    private String fornecedor;
    private String lote;
    private Double altura;
    private Double largura;
    private Double espessura;
    private LocalDate dataEntrada;

    // Arquivos
    private MultipartFile certComposicao;
    private MultipartFile relatorioPropriedades;
    private MultipartFile laudoPenetrante;
    private MultipartFile notaFiscal;
    private MultipartFile[] imagens;

    // Remoção de arquivos existentes
    private Boolean removeCertComposicao;
    private Boolean removeRelatorioPropriedades;
    private Boolean removeLaudoPenetrante;
    private Boolean removeNotaFiscal;
    private List<String> removeImagens;
}
