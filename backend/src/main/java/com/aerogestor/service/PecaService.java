package com.aerogestor.service;

import com.aerogestor.model.Peca;
import com.aerogestor.repository.PecaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PecaService {

    private final PecaRepository pecaRepository;

    public List<Peca> findAll() {
        return pecaRepository.findAll();
    }

    public Peca findById(Long id) {
        return pecaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Peça não encontrada com id: " + id));
    }

    @Transactional
    public Peca create(Peca peca) {
        if (pecaRepository.existsByCodigoPeca(peca.getCodigoPeca())) {
            throw new RuntimeException("Código de peça já cadastrado: " + peca.getCodigoPeca());
        }
        return pecaRepository.save(peca);
    }

    @Transactional
    public Peca update(Long id, Peca peca) {
        Peca existing = findById(id);

        if (!existing.getCodigoPeca().equals(peca.getCodigoPeca()) &&
            pecaRepository.existsByCodigoPeca(peca.getCodigoPeca())) {
            throw new RuntimeException("Código de peça já cadastrado: " + peca.getCodigoPeca());
        }

        existing.setCodigoPeca(peca.getCodigoPeca());
        existing.setDescricao(peca.getDescricao());
        existing.setNumeroDesenho(peca.getNumeroDesenho());
        existing.setRevisao(peca.getRevisao());
        existing.setQuantidadeProduzida(peca.getQuantidadeProduzida());
        existing.setUnidadeMedida(peca.getUnidadeMedida());
        existing.setDataFabricacao(peca.getDataFabricacao());
        existing.setLoteProducao(peca.getLoteProducao());
        existing.setOperadorResponsavel(peca.getOperadorResponsavel());
        existing.setMaquinaUtilizada(peca.getMaquinaUtilizada());
        existing.setTempoFabricacaoHoras(peca.getTempoFabricacaoHoras());
        existing.setStatusQualidade(peca.getStatusQualidade());
        existing.setObservacoes(peca.getObservacoes());

        return pecaRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!pecaRepository.existsById(id)) {
            throw new RuntimeException("Peça não encontrada com id: " + id);
        }
        pecaRepository.deleteById(id);
    }

    @Transactional
    public Peca atualizarQuantidade(Long id, Integer quantidade) {
        Peca peca = findById(id);
        peca.setQuantidadeProduzida(quantidade);
        return pecaRepository.save(peca);
    }
}
