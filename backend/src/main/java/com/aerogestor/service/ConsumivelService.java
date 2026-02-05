package com.aerogestor.service;

import com.aerogestor.model.Consumivel;
import com.aerogestor.repository.ConsumivelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsumivelService {

    private final ConsumivelRepository consumivelRepository;

    public List<Consumivel> findAll() {
        return consumivelRepository.findAll();
    }

    public Consumivel findById(Long id) {
        return consumivelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consumível não encontrado com id: " + id));
    }

    @Transactional
    public Consumivel create(Consumivel consumivel) {
        if (consumivelRepository.existsByPartNumber(consumivel.getPartNumber())) {
            throw new RuntimeException("Part Number já cadastrado: " + consumivel.getPartNumber());
        }
        return consumivelRepository.save(consumivel);
    }

    @Transactional
    public Consumivel update(Long id, Consumivel consumivel) {
        Consumivel existing = findById(id);
        
        if (!existing.getPartNumber().equals(consumivel.getPartNumber()) &&
            consumivelRepository.existsByPartNumber(consumivel.getPartNumber())) {
            throw new RuntimeException("Part Number já cadastrado: " + consumivel.getPartNumber());
        }

        existing.setNome(consumivel.getNome());
        existing.setPartNumber(consumivel.getPartNumber());
        existing.setQuantidade(consumivel.getQuantidade());
        existing.setFornecedor(consumivel.getFornecedor());
        existing.setLocalEstoque(consumivel.getLocalEstoque());

        return consumivelRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!consumivelRepository.existsById(id)) {
            throw new RuntimeException("Consumível não encontrado com id: " + id);
        }
        consumivelRepository.deleteById(id);
    }

    @Transactional
    public Consumivel atualizarQuantidade(Long id, Integer quantidade) {
        Consumivel consumivel = findById(id);
        consumivel.setQuantidade(quantidade);
        return consumivelRepository.save(consumivel);
    }
}
