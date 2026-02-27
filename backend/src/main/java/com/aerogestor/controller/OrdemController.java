package com.aerogestor.controller;

import com.aerogestor.model.Ordem;
import com.aerogestor.service.OrdemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/ordens")
@RequiredArgsConstructor
public class OrdemController {

    private final OrdemService ordemService;

    @GetMapping
    public ResponseEntity<List<Ordem>> findAll() {
        return ResponseEntity.ok(ordemService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ordem> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ordemService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Ordem> create(@RequestBody Ordem ordem) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ordemService.create(ordem));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Ordem> createWithPdf(
            @RequestParam("tipo_ordem") String tipoOrdem,
            @RequestParam("projeto") String projeto,
            @RequestParam("part_number") String partNumber,
            @RequestParam("status") String status,
            @RequestParam("dados_formulario") String dadosFormulario,
            @RequestParam(value = "arquivo_pdf", required = false) MultipartFile arquivoPdf
    ) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ordemService.createWithPdf(tipoOrdem, projeto, partNumber, status, dadosFormulario, arquivoPdf)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ordem> update(@PathVariable Long id, @RequestBody Ordem ordem) {
        return ResponseEntity.ok(ordemService.update(id, ordem));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Ordem> updateWithPdf(
            @PathVariable Long id,
            @RequestParam("dados_formulario") String dadosFormulario,
            @RequestParam(value = "arquivo_pdf", required = false) MultipartFile arquivoPdf
    ) throws IOException {
        return ResponseEntity.ok(ordemService.updateWithPdf(id, dadosFormulario, arquivoPdf));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ordemService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ordem> atualizarStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(ordemService.atualizarStatus(id, status));
    }
}
