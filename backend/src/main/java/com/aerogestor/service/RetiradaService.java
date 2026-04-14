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
        if (retirada.getData() == null) {
            retirada.setData(java.time.LocalDate.now());
        }

        if (retirada.getQuantidade() == null || retirada.getQuantidade() <= 0) {
            throw new RuntimeException("Quantidade da retirada deve ser maior que zero");
        }

        // Validar tipo e atualizar quantidade do item
        switch (retirada.getTipoItem()) {
            case "consumivel":
                Consumivel consumivel = consumivelRepository.findById(retirada.getItemId())
                        .orElseThrow(() -> new RuntimeException("Consumível não encontrado com id: " + retirada.getItemId()));

                retirada.setItemNome(consumivel.getNome());
                retirada.setItemPartNumber(consumivel.getPartNumber());
                retirada.setItemFornecedor(consumivel.getFornecedor());
                retirada.setItemLocalEstoque(consumivel.getLocalEstoque());
                
                // Validar se há quantidade suficiente
                if (consumivel.getQuantidade() < retirada.getQuantidade()) {
                    throw new RuntimeException("Quantidade insuficiente. Disponível: " + consumivel.getQuantidade());
                }
                
                // Subtrair quantidade
                int novaQuantidade = consumivel.getQuantidade() - retirada.getQuantidade();
                consumivel.setQuantidade(Math.max(novaQuantidade, 0));
                consumivelRepository.save(consumivel);
                break;

            case "materia-prima":
                MateriaPrima materiaPrima = materiaPrimaRepository.findById(retirada.getItemId())
                        .orElseThrow(() -> new RuntimeException("Matéria-Prima não encontrada com id: " + retirada.getItemId()));

                retirada.setItemNome(materiaPrima.getDescricao());
                retirada.setItemPartNumber(materiaPrima.getCodigo());
                retirada.setItemFornecedor(materiaPrima.getFornecedor());
                retirada.setItemLote(materiaPrima.getLote());
                retirada.setItemDataEntrada(materiaPrima.getDataEntrada());
                retirada.setItemAltura(materiaPrima.getAltura());
                retirada.setItemLargura(materiaPrima.getLargura());
                retirada.setItemEspessura(materiaPrima.getEspessura());
                retirada.setItemEspecificacao(materiaPrima.getEspecificacao());
                retirada.setItemUnidadeMedida(materiaPrima.getUnidadeMedida());
                retirada.setItemNotaFiscal(materiaPrima.getNotaFiscal());
                retirada.setItemCertComposicao(materiaPrima.getCertComposicao());
                retirada.setItemRelatorioPropriedades(materiaPrima.getRelatorioPropriedades());
                retirada.setItemLaudoPenetrante(materiaPrima.getLaudoPenetrante());
                retirada.setItemImagens(materiaPrima.getImagens());
                
                // Validar se há quantidade suficiente
                if (materiaPrima.getQuantidadeEstoque() < retirada.getQuantidade()) {
                    throw new RuntimeException("Quantidade insuficiente. Disponível: " + materiaPrima.getQuantidadeEstoque());
                }
                
                // Subtrair quantidade
                int novaQuantidadeMp = materiaPrima.getQuantidadeEstoque() - retirada.getQuantidade();
                materiaPrima.setQuantidadeEstoque(Math.max(novaQuantidadeMp, 0));
                materiaPrimaRepository.save(materiaPrima);
                break;

            case "peca":
                Peca peca = pecaRepository.findById(retirada.getItemId())
                        .orElseThrow(() -> new RuntimeException("Peça não encontrada com id: " + retirada.getItemId()));

                retirada.setItemNome(peca.getDescricao());
                retirada.setItemPartNumber(peca.getCodigoPeca());
                retirada.setItemLote(peca.getNumeroSerie());
                retirada.setItemUnidadeMedida(peca.getUnidadeMedida());
                retirada.setItemLocalEstoque(peca.getAeronaveInstalada());
                retirada.setItemCertComposicao(peca.getRelatorioInspecao());
                retirada.setItemImagens(peca.getFotos());
                retirada.setItemEspecificacao(peca.getStatusQualidade());
                
                // Validar se há quantidade suficiente
                if (peca.getQuantidadeProduzida() < retirada.getQuantidade()) {
                    throw new RuntimeException("Quantidade insuficiente. Disponível: " + peca.getQuantidadeProduzida());
                }
                
                // Subtrair quantidade
                int novaQuantidadePeca = peca.getQuantidadeProduzida() - retirada.getQuantidade();
                peca.setQuantidadeProduzida(Math.max(novaQuantidadePeca, 0));
                pecaRepository.save(peca);
                break;

            default:
                throw new RuntimeException("Tipo de item inválido: " + retirada.getTipoItem());
        }

        var retiradaExistenteMesmoDia = retiradaRepository
            .findTopByTipoItemAndItemIdAndDataAndPessoaOrderByIdDesc(
                        retirada.getTipoItem(),
                        retirada.getItemId(),
                retirada.getData(),
                retirada.getPessoa()
                );

        if (retiradaExistenteMesmoDia.isPresent()) {
            Retirada retiradaExistente = retiradaExistenteMesmoDia.get();
            retiradaExistente.setQuantidade(retiradaExistente.getQuantidade() + retirada.getQuantidade());

            if (retiradaExistente.getObservacoes() == null || retiradaExistente.getObservacoes().isBlank()) {
                retiradaExistente.setObservacoes(retirada.getObservacoes());
            }

            return retiradaRepository.save(retiradaExistente);
        }

        return retiradaRepository.save(retirada);
    }

    @Transactional
    public void delete(Long id) {
        cancelar(id, null, true);
    }

    @Transactional
    public void cancelar(Long id, Integer quantidade, boolean cancelarTudo) {
        Retirada retirada = findById(id);

        int quantidadeRegistrada = retirada.getQuantidade() != null ? retirada.getQuantidade() : 0;
        if (quantidadeRegistrada <= 0) {
            throw new RuntimeException("Retirada inválida: quantidade registrada deve ser maior que zero");
        }

        int quantidadeParaCancelar;
        if (cancelarTudo) {
            quantidadeParaCancelar = quantidadeRegistrada;
        } else {
            if (quantidade == null) {
                throw new RuntimeException("Informe a quantidade que deseja cancelar");
            }
            if (quantidade <= 0) {
                throw new RuntimeException("Quantidade para cancelamento deve ser maior que zero");
            }
            if (quantidade > quantidadeRegistrada) {
                throw new RuntimeException("Quantidade para cancelamento não pode ser maior que a retirada registrada");
            }
            quantidadeParaCancelar = quantidade;
        }

        reverterQuantidadeDoItem(retirada, quantidadeParaCancelar);

        boolean removerRegistro = cancelarTudo || quantidadeParaCancelar >= quantidadeRegistrada;
        if (removerRegistro) {
            retiradaRepository.deleteById(id);
            return;
        }

        retirada.setQuantidade(quantidadeRegistrada - quantidadeParaCancelar);
        retiradaRepository.save(retirada);
    }

    private void reverterQuantidadeDoItem(Retirada retirada, Integer quantidadeReversao) {
        // Reverter a quantidade do item ao cancelar retirada
        switch (retirada.getTipoItem()) {
            case "consumivel":
                Consumivel consumivel = consumivelRepository.findById(retirada.getItemId()).orElse(null);
                if (consumivel == null && retirada.getItemPartNumber() != null && !retirada.getItemPartNumber().isBlank()) {
                    consumivel = consumivelRepository.findByPartNumber(retirada.getItemPartNumber()).orElse(null);
                }
                if (consumivel == null && retirada.getItemNome() != null && !retirada.getItemNome().isBlank()) {
                    consumivel = consumivelRepository.findByNome(retirada.getItemNome()).orElse(null);
                }

                if (consumivel == null) {
                    Consumivel novoConsumivel = new Consumivel();
                    novoConsumivel.setNome(retirada.getItemNome());
                    novoConsumivel.setPartNumber(retirada.getItemPartNumber());
                    novoConsumivel.setFornecedor(retirada.getItemFornecedor());
                    novoConsumivel.setLocalEstoque(retirada.getItemLocalEstoque());
                    novoConsumivel.setQuantidade(quantidadeReversao);
                    consumivelRepository.save(novoConsumivel);
                } else {
                    consumivel.setQuantidade(consumivel.getQuantidade() + quantidadeReversao);
                    consumivelRepository.save(consumivel);
                }
                break;

            case "materia-prima":
                MateriaPrima materiaPrima = materiaPrimaRepository.findById(retirada.getItemId()).orElse(null);
                if (materiaPrima == null) {
                    MateriaPrima novaMateriaPrima = new MateriaPrima();
                    String codigo = retirada.getItemPartNumber() != null && !retirada.getItemPartNumber().isBlank()
                            ? retirada.getItemPartNumber()
                            : "MP-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                    novaMateriaPrima.setCodigo(codigo);
                    novaMateriaPrima.setDescricao(retirada.getItemNome());
                    novaMateriaPrima.setTipoMaterial(retirada.getItemNome());
                    novaMateriaPrima.setQuantidadeEstoque(quantidadeReversao);
                    novaMateriaPrima.setUnidadeMedida(retirada.getItemUnidadeMedida() != null ? retirada.getItemUnidadeMedida() : "peças");
                    novaMateriaPrima.setFornecedor(retirada.getItemFornecedor() != null ? retirada.getItemFornecedor() : "Desconhecido");
                    novaMateriaPrima.setLote(retirada.getItemLote());
                    novaMateriaPrima.setDataEntrada(retirada.getItemDataEntrada());
                    novaMateriaPrima.setAltura(retirada.getItemAltura());
                    novaMateriaPrima.setLargura(retirada.getItemLargura());
                    novaMateriaPrima.setEspessura(retirada.getItemEspessura());
                    novaMateriaPrima.setEspecificacao(retirada.getItemEspecificacao());
                    novaMateriaPrima.setCertComposicao(retirada.getItemCertComposicao());
                    novaMateriaPrima.setRelatorioPropriedades(retirada.getItemRelatorioPropriedades());
                    novaMateriaPrima.setLaudoPenetrante(retirada.getItemLaudoPenetrante());
                    novaMateriaPrima.setImagens(retirada.getItemImagens());
                    novaMateriaPrima.setNotaFiscal(retirada.getItemNotaFiscal() != null ? retirada.getItemNotaFiscal() : "restaurado");
                    materiaPrimaRepository.save(novaMateriaPrima);
                } else {
                    materiaPrima.setQuantidadeEstoque(materiaPrima.getQuantidadeEstoque() + quantidadeReversao);
                    materiaPrimaRepository.save(materiaPrima);
                }
                break;

            case "peca":
                Peca peca = pecaRepository.findById(retirada.getItemId()).orElse(null);
                if (peca == null) {
                    Peca novaPeca = new Peca();
                    String codigo = retirada.getItemPartNumber() != null && !retirada.getItemPartNumber().isBlank()
                            ? retirada.getItemPartNumber()
                            : "PC-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                    String numeroSerie = retirada.getItemLote() != null && !retirada.getItemLote().isBlank()
                        ? retirada.getItemLote()
                        : codigo;
                    novaPeca.setCodigoPeca(codigo);
                    novaPeca.setDescricao(retirada.getItemNome());
                    novaPeca.setNumeroSerie(numeroSerie);
                    novaPeca.setNumeroDesenho(numeroSerie);
                    novaPeca.setQuantidadeProduzida(quantidadeReversao.intValue());
                    novaPeca.setUnidadeMedida(retirada.getItemUnidadeMedida() != null ? retirada.getItemUnidadeMedida() : "un");
                    novaPeca.setDataFabricacao(retirada.getData());
                    novaPeca.setStatusQualidade(retirada.getItemEspecificacao() != null && !retirada.getItemEspecificacao().isBlank() 
                            ? retirada.getItemEspecificacao() 
                            : "Em_Inspecao");
                    novaPeca.setAeronaveInstalada(retirada.getItemLocalEstoque());
                    novaPeca.setRelatorioInspecao(retirada.getItemCertComposicao());
                    novaPeca.setFotos(retirada.getItemImagens());
                    pecaRepository.save(novaPeca);
                } else {
                    peca.setQuantidadeProduzida((int) (peca.getQuantidadeProduzida() + quantidadeReversao.intValue()));
                    pecaRepository.save(peca);
                }
                break;
        }
    }
}
