package com.aerogestor.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class MateriaPrimaRequestDTO {
    private String nome;
    private Double quantidade;
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
}
