package com.aerogestor.service;

import com.aerogestor.model.Ordem;
import com.aerogestor.repository.OrdemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdemService {

    private final OrdemRepository ordemRepository;

    public List<Ordem> findAll() {
        return ordemRepository.findAll();
    }

    public Ordem findById(Long id) {
        return ordemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordem não encontrada com id: " + id));
    }

    @Transactional
    public Ordem create(Ordem ordem) {
        if (ordemRepository.existsByNumeroOrdem(ordem.getNumeroOrdem())) {
            throw new RuntimeException("Número de ordem já cadastrado: " + ordem.getNumeroOrdem());
        }
        return ordemRepository.save(ordem);
    }

    @Transactional
    public Ordem update(Long id, Ordem ordem) {
        Ordem existing = findById(id);

        if (!existing.getNumeroOrdem().equals(ordem.getNumeroOrdem()) &&
            ordemRepository.existsByNumeroOrdem(ordem.getNumeroOrdem())) {
            throw new RuntimeException("Número de ordem já cadastrado: " + ordem.getNumeroOrdem());
        }

        existing.setNumeroOrdem(ordem.getNumeroOrdem());
        existing.setTipoOrdem(ordem.getTipoOrdem());
        existing.setProjeto(ordem.getProjeto());
        existing.setPartNumber(ordem.getPartNumber());
        existing.setStatus(ordem.getStatus());
        existing.setDataCriacao(ordem.getDataCriacao());
        existing.setDataConclusao(ordem.getDataConclusao());
        existing.setDescricao(ordem.getDescricao());
        existing.setObservacoes(ordem.getObservacoes());

        return ordemRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!ordemRepository.existsById(id)) {
            throw new RuntimeException("Ordem não encontrada com id: " + id);
        }
        ordemRepository.deleteById(id);
    }

    @Transactional
    public Ordem atualizarStatus(Long id, String status) {
        Ordem ordem = findById(id);
        ordem.setStatus(status);
        return ordemRepository.save(ordem);
    }
}
