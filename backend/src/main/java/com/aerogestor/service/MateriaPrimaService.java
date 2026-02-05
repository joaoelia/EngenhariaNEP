package com.aerogestor.service;

import com.aerogestor.model.MateriaPrima;
import com.aerogestor.repository.MateriaPrimaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MateriaPrimaService {

    private final MateriaPrimaRepository materiaPrimaRepository;

    public List<MateriaPrima> findAll() {
        return materiaPrimaRepository.findAll();
    }

    public MateriaPrima findById(Long id) {
        return materiaPrimaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matéria-prima não encontrada com id: " + id));
    }

    @Transactional
    public MateriaPrima create(MateriaPrima materiaPrima) {
        if (materiaPrimaRepository.existsByCodigo(materiaPrima.getCodigo())) {
            throw new RuntimeException("Código já cadastrado: " + materiaPrima.getCodigo());
        }
        return materiaPrimaRepository.save(materiaPrima);
    }

    @Transactional
    public MateriaPrima update(Long id, MateriaPrima materiaPrima) {
        MateriaPrima existing = findById(id);

        if (!existing.getCodigo().equals(materiaPrima.getCodigo()) &&
            materiaPrimaRepository.existsByCodigo(materiaPrima.getCodigo())) {
            throw new RuntimeException("Código já cadastrado: " + materiaPrima.getCodigo());
        }

        existing.setCodigo(materiaPrima.getCodigo());
        existing.setDescricao(materiaPrima.getDescricao());
        existing.setTipoMaterial(materiaPrima.getTipoMaterial());
        existing.setDensidade(materiaPrima.getDensidade());
        existing.setEspecificacao(materiaPrima.getEspecificacao());
        existing.setQuantidadeEstoque(materiaPrima.getQuantidadeEstoque());
        existing.setUnidadeMedida(materiaPrima.getUnidadeMedida());
        existing.setLote(materiaPrima.getLote());
        existing.setDataEntrada(materiaPrima.getDataEntrada());
        existing.setFornecedor(materiaPrima.getFornecedor());
        existing.setCertificadoQualidade(materiaPrima.getCertificadoQualidade());
        existing.setObservacoes(materiaPrima.getObservacoes());

        return materiaPrimaRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!materiaPrimaRepository.existsById(id)) {
            throw new RuntimeException("Matéria-prima não encontrada com id: " + id);
        }
        materiaPrimaRepository.deleteById(id);
    }

    @Transactional
    public MateriaPrima atualizarEstoque(Long id, Double quantidade) {
        MateriaPrima materiaPrima = findById(id);
        materiaPrima.setQuantidadeEstoque(quantidade);
        return materiaPrimaRepository.save(materiaPrima);
    }
}
