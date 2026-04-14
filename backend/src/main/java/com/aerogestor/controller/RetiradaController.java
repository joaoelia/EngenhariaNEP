package com.aerogestor.controller;

import com.aerogestor.model.Retirada;
import com.aerogestor.service.RetiradaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/retiradas")
@RequiredArgsConstructor
public class RetiradaController {

    private final RetiradaService retiradaService;

    @GetMapping
    public ResponseEntity<List<Retirada>> findAll() {
        return ResponseEntity.ok(retiradaService.findAll());
    }

    @GetMapping("/tipo/{tipoItem}")
    public ResponseEntity<List<Retirada>> findByTipoItem(@PathVariable String tipoItem) {
        return ResponseEntity.ok(retiradaService.findByTipoItem(tipoItem));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<Retirada>> findByItemId(@PathVariable Long itemId) {
        return ResponseEntity.ok(retiradaService.findByItemId(itemId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Retirada> findById(@PathVariable Long id) {
        return ResponseEntity.ok(retiradaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Retirada> create(@RequestBody Retirada retirada) {
        return ResponseEntity.status(HttpStatus.CREATED).body(retiradaService.create(retirada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam(name = "quantidade", required = false) Integer quantidade,
            @RequestParam(name = "cancelar_tudo", required = false, defaultValue = "true") Boolean cancelarTudo) {
        retiradaService.cancelar(id, quantidade, Boolean.TRUE.equals(cancelarTudo));
        return ResponseEntity.noContent().build();
    }
}
