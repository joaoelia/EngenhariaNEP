package com.aerogestor.service;

import com.aerogestor.model.Consumivel;
import com.aerogestor.model.MateriaPrima;
import com.aerogestor.model.Peca;
import com.aerogestor.model.Retirada;
import com.aerogestor.repository.ConsumivelRepository;
import com.aerogestor.repository.MateriaPrimaRepository;
import com.aerogestor.repository.PecaRepository;
import com.aerogestor.repository.RetiradaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RetiradaService {

    private final RetiradaRepository retiradaRepository;
    private final ConsumivelRepository consumivelRepository;
    private final MateriaPrimaRepository materiaPrimaRepository;
    private final PecaRepository pecaRepository;

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
        // Validar tipo e atualizar quantidade do item
        switch (retirada.getTipoItem()) {
            case "consumivel":
                Consumivel consumivel = consumivelRepository.findById(retirada.getItemId())
                        .orElseThrow(() -> new RuntimeException("Consumível não encontrado com id: " + retirada.getItemId()));
                
                // Validar se há quantidade suficiente
                if (consumivel.getQuantidade() < retirada.getQuantidade()) {
                    throw new RuntimeException("Quantidade insuficiente. Disponível: " + consumivel.getQuantidade());
                }
                
                // Subtrair quantidade
                consumivel.setQuantidade((int)(consumivel.getQuantidade() - retirada.getQuantidade().intValue()));
                consumivelRepository.save(consumivel);
                break;

            case "materia-prima":
                MateriaPrima materiaPrima = materiaPrimaRepository.findById(retirada.getItemId())
                        .orElseThrow(() -> new RuntimeException("Matéria-Prima não encontrada com id: " + retirada.getItemId()));
                
                // Validar se há quantidade suficiente
                if (materiaPrima.getQuantidadeEstoque() < retirada.getQuantidade()) {
                    throw new RuntimeException("Quantidade insuficiente. Disponível: " + materiaPrima.getQuantidadeEstoque());
                }
                
                // Subtrair quantidade
                materiaPrima.setQuantidadeEstoque(materiaPrima.getQuantidadeEstoque() - retirada.getQuantidade());
                materiaPrimaRepository.save(materiaPrima);
                break;

            case "peca":
                Peca peca = pecaRepository.findById(retirada.getItemId())
                        .orElseThrow(() -> new RuntimeException("Peça não encontrada com id: " + retirada.getItemId()));
                
                // Validar se há quantidade suficiente
                if (peca.getQuantidadeProduzida() < retirada.getQuantidade()) {
                    throw new RuntimeException("Quantidade insuficiente. Disponível: " + peca.getQuantidadeProduzida());
                }
                
                // Subtrair quantidade
                peca.setQuantidadeProduzida((int)(peca.getQuantidadeProduzida() - retirada.getQuantidade().intValue()));
                pecaRepository.save(peca);
                break;

            default:
                throw new RuntimeException("Tipo de item inválido: " + retirada.getTipoItem());
        }

        return retiradaRepository.save(retirada);
    }

    @Transactional
    public void delete(Long id) {
        Retirada retirada = findById(id);
        
        // Reverter a quantidade do item ao deletar retirada
        switch (retirada.getTipoItem()) {
            case "consumivel":
                Consumivel consumivel = consumivelRepository.findById(retirada.getItemId())
                        .orElseThrow(() -> new RuntimeException("Consumível não encontrado"));
                consumivel.setQuantidade((int)(consumivel.getQuantidade() + retirada.getQuantidade().intValue()));
                consumivelRepository.save(consumivel);
                break;

            case "materia-prima":
                MateriaPrima materiaPrima = materiaPrimaRepository.findById(retirada.getItemId())
                        .orElseThrow(() -> new RuntimeException("Matéria-Prima não encontrada"));
                materiaPrima.setQuantidadeEstoque(materiaPrima.getQuantidadeEstoque() + retirada.getQuantidade());
                materiaPrimaRepository.save(materiaPrima);
                break;

            case "peca":
                Peca peca = pecaRepository.findById(retirada.getItemId())
                        .orElseThrow(() -> new RuntimeException("Peça não encontrada"));
                peca.setQuantidadeProduzida((int)(peca.getQuantidadeProduzida() + retirada.getQuantidade().intValue()));
                pecaRepository.save(peca);
                break;
        }
        
        retiradaRepository.deleteById(id);
    }
}
