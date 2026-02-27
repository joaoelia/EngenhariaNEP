package com.aerogestor.controller;

import com.aerogestor.model.Peca;
import com.aerogestor.service.PecaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/pecas")
@RequiredArgsConstructor
public class PecaController {

    private final PecaService pecaService;

    @GetMapping
    public ResponseEntity<List<Peca>> findAll() {
        return ResponseEntity.ok(pecaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Peca> findById(@PathVariable Long id) {
        return ResponseEntity.ok(pecaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Peca> create(@RequestBody Peca peca) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pecaService.create(peca));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Peca> createWithFiles(
            @RequestParam("part_number") String partNumber,
            @RequestParam("numero_serie") String numeroSerie,
            @RequestParam("descricao") String descricao,
            @RequestParam(value = "aeronave_instalada", required = false) String aeronaveInstalada,
            @RequestParam("relatorio_inspecao") MultipartFile relatorioInspecao,
            @RequestParam(value = "fotos", required = false) MultipartFile[] fotos
    ) throws IOException {
        Peca peca = new Peca();
        peca.setCodigoPeca(partNumber);
        peca.setNumeroSerie(numeroSerie);
        peca.setNumeroDesenho(numeroSerie);
        peca.setDescricao(descricao);
        peca.setAeronaveInstalada(aeronaveInstalada);
        peca.setQuantidadeProduzida(1);
        peca.setUnidadeMedida("un");
        peca.setDataFabricacao(LocalDate.now());
        peca.setLoteProducao(numeroSerie);
        peca.setOperadorResponsavel("Não informado");
        peca.setStatusQualidade("Em_Inspecao");

        return ResponseEntity.status(HttpStatus.CREATED).body(pecaService.createWithFiles(peca, relatorioInspecao, fotos));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Peca> updateWithFiles(
            @PathVariable Long id,
            @RequestParam("part_number") String partNumber,
            @RequestParam("numero_serie") String numeroSerie,
            @RequestParam("descricao") String descricao,
            @RequestParam(value = "aeronave_instalada", required = false) String aeronaveInstalada,
            @RequestParam(value = "relatorio_inspecao", required = false) MultipartFile relatorioInspecao,
            @RequestParam(value = "fotos", required = false) MultipartFile[] fotos
    ) throws IOException {
        Peca peca = new Peca();
        peca.setCodigoPeca(partNumber);
        peca.setNumeroSerie(numeroSerie);
        peca.setNumeroDesenho(numeroSerie);
        peca.setDescricao(descricao);
        peca.setAeronaveInstalada(aeronaveInstalada);

        return ResponseEntity.ok(pecaService.updateWithFiles(id, peca, relatorioInspecao, fotos));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Peca> update(@PathVariable Long id, @RequestBody Peca peca) {
        return ResponseEntity.ok(pecaService.update(id, peca));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pecaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/quantidade")
    public ResponseEntity<Peca> atualizarQuantidade(
            @PathVariable Long id,
            @RequestParam Integer quantidade) {
        return ResponseEntity.ok(pecaService.atualizarQuantidade(id, quantidade));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Peca> atualizarStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        return ResponseEntity.ok(pecaService.atualizarStatus(id, status));
    }
}
