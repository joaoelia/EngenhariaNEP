package com.aerogestor.controller;

import com.aerogestor.model.MateriaPrima;
import com.aerogestor.service.MateriaPrimaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<MateriaPrima> create(@RequestBody MateriaPrima materiaPrima) {
        return ResponseEntity.status(HttpStatus.CREATED).body(materiaPrimaService.create(materiaPrima));
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
