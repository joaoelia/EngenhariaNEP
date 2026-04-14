package com.aerogestor.controller;

import com.aerogestor.dto.MateriaPrimaRequestDTO;
import com.aerogestor.model.MateriaPrima;
import com.aerogestor.service.MateriaPrimaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/materia-prima")
@RequiredArgsConstructor
public class MateriaPrimaController {

    private final MateriaPrimaService materiaPrimaService;

    @GetMapping
    public ResponseEntity<List<MateriaPrima>> findAll() {
        return ResponseEntity.ok(materiaPrimaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MateriaPrima> findById(@PathVariable Long id) {
        return ResponseEntity.ok(materiaPrimaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<MateriaPrima> create(
            @RequestParam String nome,
            @RequestParam Integer quantidade,
            @RequestParam(required = false) Integer estoque_minimo,
            @RequestParam(required = false) Integer estoque_maximo,
            @RequestParam String fornecedor,
            @RequestParam(required = false) String lote,
            @RequestParam(required = false) Double altura,
            @RequestParam(required = false) Double largura,
            @RequestParam(required = false) Double espessura,
            @RequestParam(required = false) String data_entrada,
            @RequestParam(required = false) MultipartFile certComposicao,
            @RequestParam(required = false) MultipartFile relatorioPropriedades,
            @RequestParam(required = false) MultipartFile laudoPenetrante,
            @RequestParam(required = false) MultipartFile notaFiscal,
            @RequestParam(required = false) MultipartFile[] imagens) throws java.io.IOException {

        MateriaPrimaRequestDTO dto = new MateriaPrimaRequestDTO();
        dto.setNome(nome);
        dto.setQuantidade(quantidade);
        dto.setEstoqueMinimo(estoque_minimo);
        dto.setEstoqueMaximo(estoque_maximo);
        dto.setFornecedor(fornecedor);
        dto.setLote(lote);
        dto.setAltura(altura);
        dto.setLargura(largura);
        dto.setEspessura(espessura);
        
        if (data_entrada != null && !data_entrada.isEmpty()) {
            dto.setDataEntrada(LocalDate.parse(data_entrada));
        }
        
        dto.setCertComposicao(certComposicao);
        dto.setRelatorioPropriedades(relatorioPropriedades);
        dto.setLaudoPenetrante(laudoPenetrante);
        dto.setNotaFiscal(notaFiscal);
        dto.setImagens(imagens);

        return ResponseEntity.status(HttpStatus.CREATED).body(materiaPrimaService.createWithFiles(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MateriaPrima> update(@PathVariable Long id, @RequestBody MateriaPrima materiaPrima) {
        return ResponseEntity.ok(materiaPrimaService.update(id, materiaPrima));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MateriaPrima> updateWithFiles(
            @PathVariable Long id,
            @RequestParam String nome,
            @RequestParam Integer quantidade,
            @RequestParam(required = false) Integer estoque_minimo,
            @RequestParam(required = false) Integer estoque_maximo,
            @RequestParam String fornecedor,
            @RequestParam(required = false) String lote,
            @RequestParam(required = false) Double altura,
            @RequestParam(required = false) Double largura,
            @RequestParam(required = false) Double espessura,
            @RequestParam(required = false) String data_entrada,
            @RequestParam(required = false) MultipartFile certComposicao,
            @RequestParam(required = false) MultipartFile relatorioPropriedades,
            @RequestParam(required = false) MultipartFile laudoPenetrante,
            @RequestParam(required = false) MultipartFile notaFiscal,
            @RequestParam(required = false) MultipartFile[] imagens,
            @RequestParam(required = false, defaultValue = "false") Boolean removeCertComposicao,
            @RequestParam(required = false, defaultValue = "false") Boolean removeRelatorioPropriedades,
            @RequestParam(required = false, defaultValue = "false") Boolean removeLaudoPenetrante,
            @RequestParam(required = false, defaultValue = "false") Boolean removeNotaFiscal,
            @RequestParam(required = false) List<String> removeImagens) throws java.io.IOException {

        MateriaPrimaRequestDTO dto = new MateriaPrimaRequestDTO();
        dto.setNome(nome);
        dto.setQuantidade(quantidade);
        dto.setEstoqueMinimo(estoque_minimo);
        dto.setEstoqueMaximo(estoque_maximo);
        dto.setFornecedor(fornecedor);
        dto.setLote(lote);
        dto.setAltura(altura);
        dto.setLargura(largura);
        dto.setEspessura(espessura);

        if (data_entrada != null && !data_entrada.isEmpty()) {
            dto.setDataEntrada(LocalDate.parse(data_entrada));
        }

        dto.setCertComposicao(certComposicao);
        dto.setRelatorioPropriedades(relatorioPropriedades);
        dto.setLaudoPenetrante(laudoPenetrante);
        dto.setNotaFiscal(notaFiscal);
        dto.setImagens(imagens);
        dto.setRemoveCertComposicao(removeCertComposicao);
        dto.setRemoveRelatorioPropriedades(removeRelatorioPropriedades);
        dto.setRemoveLaudoPenetrante(removeLaudoPenetrante);
        dto.setRemoveNotaFiscal(removeNotaFiscal);
        dto.setRemoveImagens(removeImagens);

        return ResponseEntity.ok(materiaPrimaService.updateWithFiles(id, dto));
    }

    @DeleteMapping("/{id}/anexos")
    public ResponseEntity<MateriaPrima> deleteAnexo(
            @PathVariable Long id,
            @RequestParam String tipo,
            @RequestParam(required = false) String nomeArquivo) {
        return ResponseEntity.ok(materiaPrimaService.deleteAttachment(id, tipo, nomeArquivo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam(required = false) Integer quantidade,
            @RequestParam(name = "cancelar_tudo", required = false, defaultValue = "true") Boolean cancelarTudo) {
        materiaPrimaService.delete(id, quantidade, Boolean.TRUE.equals(cancelarTudo));
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estoque")
    public ResponseEntity<MateriaPrima> atualizarEstoque(
            @PathVariable Long id,
            @RequestParam Integer quantidade) {
        return ResponseEntity.ok(materiaPrimaService.atualizarEstoque(id, quantidade));
    }
}
