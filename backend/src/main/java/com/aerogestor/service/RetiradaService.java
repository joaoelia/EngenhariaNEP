package com.aerogestor.service;

import com.aerogestor.model.Retirada;
import com.aerogestor.repository.RetiradaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RetiradaService {

    private final RetiradaRepository retiradaRepository;

    public List<Retirada> findAll() {
        return retiradaRepository.findAll();
    }

    public List<Retirada> findByTipoItem(String tipoItem) {
        return retiradaRepository.findByTipoItem(tipoItem);
    }

    public List<Retirada> findByItemId(Long itemId) {
        return retiradaRepository.findByItemId(itemId);
    }

    public Retirada findById(Long id) {
        return retiradaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Retirada não encontrada com id: " + id));
    }

    @Transactional
    public Retirada create(Retirada retirada) {
        return retiradaRepository.save(retirada);
    }

    @Transactional
    public void delete(Long id) {
        if (!retiradaRepository.existsById(id)) {
            throw new RuntimeException("Retirada não encontrada com id: " + id);
        }
        retiradaRepository.deleteById(id);
    }
}
