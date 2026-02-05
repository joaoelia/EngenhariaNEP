package com.aerogestor.controller;

import com.aerogestor.model.Ordem;
import com.aerogestor.service.OrdemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/{id}")
    public ResponseEntity<Ordem> update(@PathVariable Long id, @RequestBody Ordem ordem) {
        return ResponseEntity.ok(ordemService.update(id, ordem));
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
