package com.aerogestor.controller;

import com.aerogestor.model.Peca;
import com.aerogestor.service.PecaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
