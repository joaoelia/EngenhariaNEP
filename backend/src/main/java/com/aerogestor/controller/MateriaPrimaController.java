package com.aerogestor.controller;

import com.aerogestor.dto.MateriaPrimaRequestDTO;
import com.aerogestor.model.MateriaPrima;
import com.aerogestor.service.MateriaPrimaService;
import lombok.RequiredArgsConstructor;
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
            @RequestParam Double quantidade,
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        materiaPrimaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estoque")
    public ResponseEntity<MateriaPrima> atualizarEstoque(
            @PathVariable Long id,
            @RequestParam Double quantidade) {
        return ResponseEntity.ok(materiaPrimaService.atualizarEstoque(id, quantidade));
    }
}
