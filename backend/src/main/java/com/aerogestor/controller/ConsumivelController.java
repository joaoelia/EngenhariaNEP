package com.aerogestor.controller;

import com.aerogestor.model.Consumivel;
import com.aerogestor.service.ConsumivelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consumiveis")
@RequiredArgsConstructor
public class ConsumivelController {

    private final ConsumivelService consumivelService;

    @GetMapping
    public ResponseEntity<List<Consumivel>> findAll() {
        return ResponseEntity.ok(consumivelService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consumivel> findById(@PathVariable Long id) {
        return ResponseEntity.ok(consumivelService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Consumivel> create(@RequestBody Consumivel consumivel) {
        return ResponseEntity.status(HttpStatus.CREATED).body(consumivelService.create(consumivel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consumivel> update(@PathVariable Long id, @RequestBody Consumivel consumivel) {
        return ResponseEntity.ok(consumivelService.update(id, consumivel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        consumivelService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/quantidade")
    public ResponseEntity<Consumivel> atualizarQuantidade(
            @PathVariable Long id,
            @RequestParam Integer quantidade) {
        return ResponseEntity.ok(consumivelService.atualizarQuantidade(id, quantidade));
    }
}
