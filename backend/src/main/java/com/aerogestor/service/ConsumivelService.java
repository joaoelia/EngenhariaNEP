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

    private void validarLimitesEstoque(Consumivel consumivel) {
        if (consumivel.getEstoqueMinimo() != null && consumivel.getEstoqueMinimo() < 0) {
            throw new RuntimeException("Estoque mínimo não pode ser negativo");
        }
        if (consumivel.getEstoqueMaximo() != null && consumivel.getEstoqueMaximo() < 0) {
            throw new RuntimeException("Estoque máximo não pode ser negativo");
        }
        if (consumivel.getEstoqueMinimo() != null && consumivel.getEstoqueMaximo() != null
                && consumivel.getEstoqueMinimo() > consumivel.getEstoqueMaximo()) {
            throw new RuntimeException("Estoque mínimo não pode ser maior que o estoque máximo");
        }
    }

    private void validarQuantidade(Consumivel consumivel) {
        if (consumivel.getQuantidade() == null || consumivel.getQuantidade() <= 0) {
            throw new RuntimeException("Quantidade deve ser maior que zero");
        }
    }

    @Transactional
    public Consumivel create(Consumivel consumivel) {
        if (consumivelRepository.existsByPartNumber(consumivel.getPartNumber())) {
            throw new RuntimeException("Part Number já cadastrado: " + consumivel.getPartNumber());
        }
        if (consumivelRepository.existsByNome(consumivel.getNome())) {
            throw new RuntimeException("Nome já cadastrado: " + consumivel.getNome());
        }
        validarQuantidade(consumivel);
        validarLimitesEstoque(consumivel);
        return consumivelRepository.save(consumivel);
    }

    @Transactional
    public Consumivel update(Long id, Consumivel consumivel) {
        Consumivel existing = findById(id);
        
        if (!existing.getPartNumber().equals(consumivel.getPartNumber()) &&
            consumivelRepository.existsByPartNumber(consumivel.getPartNumber())) {
            throw new RuntimeException("Part Number já cadastrado: " + consumivel.getPartNumber());
        }

        if (!existing.getNome().equals(consumivel.getNome()) &&
                consumivelRepository.existsByNome(consumivel.getNome())) {
            throw new RuntimeException("Nome já cadastrado: " + consumivel.getNome());
        }

        existing.setNome(consumivel.getNome());
        existing.setPartNumber(consumivel.getPartNumber());
        existing.setQuantidade(consumivel.getQuantidade());
        existing.setEstoqueMinimo(consumivel.getEstoqueMinimo());
        existing.setEstoqueMaximo(consumivel.getEstoqueMaximo());
        existing.setFornecedor(consumivel.getFornecedor());
        existing.setLocalEstoque(consumivel.getLocalEstoque());

        validarQuantidade(existing);
        validarLimitesEstoque(existing);

        return consumivelRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        delete(id, null, true);
    }

    @Transactional
    public void delete(Long id, Integer quantidade, boolean cancelarTudo) {
        Consumivel consumivel = consumivelRepository.findById(id).orElse(null);
        if (consumivel == null) {
            return;
        }

        if (cancelarTudo) {
            consumivelRepository.delete(consumivel);
            return;
        }

        if (quantidade == null || quantidade <= 0) {
            throw new RuntimeException("Informe uma quantidade válida para exclusão parcial");
        }

        int quantidadeAtual = consumivel.getQuantidade() == null ? 0 : consumivel.getQuantidade();

        if (quantidade >= quantidadeAtual) {
            consumivelRepository.delete(consumivel);
            return;
        }

        consumivel.setQuantidade(quantidadeAtual - quantidade);
        consumivelRepository.save(consumivel);
    }

    @Transactional
    public Consumivel atualizarQuantidade(Long id, Integer quantidade) {
        if (quantidade == null || quantidade <= 0) {
            throw new RuntimeException("Quantidade deve ser maior que zero");
        }
        Consumivel consumivel = findById(id);
        consumivel.setQuantidade(quantidade);
        return consumivelRepository.save(consumivel);
    }
}
