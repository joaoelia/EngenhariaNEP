package com.aerogestor.service;

import com.aerogestor.model.Peca;
import com.aerogestor.repository.PecaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PecaService {

    private final PecaRepository pecaRepository;
    private final FileUploadService fileUploadService;

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
        if (peca.getDataFabricacao() == null) {
            peca.setDataFabricacao(LocalDate.now());
        }
        if (peca.getStatusQualidade() == null || peca.getStatusQualidade().isBlank()) {
            peca.setStatusQualidade("Em_Inspecao");
        }
        if (peca.getQuantidadeProduzida() == null) {
            peca.setQuantidadeProduzida(1);
        }
        return pecaRepository.save(peca);
    }

    @Transactional
    public Peca createWithFiles(Peca peca, MultipartFile relatorioInspecao, MultipartFile[] fotos) throws IOException {
        if (pecaRepository.existsByCodigoPeca(peca.getCodigoPeca())) {
            throw new RuntimeException("Código de peça já cadastrado: " + peca.getCodigoPeca());
        }

        if (relatorioInspecao == null || relatorioInspecao.isEmpty()) {
            throw new RuntimeException("Relatório de inspeção é obrigatório");
        }

        String relatorioPath = fileUploadService.uploadFile(relatorioInspecao);
        peca.setRelatorioInspecao(relatorioPath);

        List<String> fotosPaths = new ArrayList<>();
        if (fotos != null && fotos.length > 0) {
            for (MultipartFile foto : fotos) {
                String fotoPath = fileUploadService.uploadFile(foto);
                if (fotoPath != null) {
                    fotosPaths.add(fotoPath);
                }
            }
        }

        if (!fotosPaths.isEmpty()) {
            peca.setFotos(new ObjectMapper().writeValueAsString(fotosPaths));
        }

        return create(peca);
    }

    @Transactional
    public Peca updateWithFiles(Long id, Peca pecaData, MultipartFile relatorioInspecao, MultipartFile[] fotos) throws IOException {
        Peca existing = findById(id);

        if (!existing.getCodigoPeca().equals(pecaData.getCodigoPeca()) &&
            pecaRepository.existsByCodigoPeca(pecaData.getCodigoPeca())) {
            throw new RuntimeException("Código de peça já cadastrado: " + pecaData.getCodigoPeca());
        }

        existing.setCodigoPeca(pecaData.getCodigoPeca());
        existing.setDescricao(pecaData.getDescricao());
        existing.setNumeroDesenho(pecaData.getNumeroDesenho());
        existing.setNumeroSerie(pecaData.getNumeroSerie());
        existing.setAeronaveInstalada(pecaData.getAeronaveInstalada());

        if (relatorioInspecao != null && !relatorioInspecao.isEmpty()) {
            String relatorioPath = fileUploadService.uploadFile(relatorioInspecao);
            existing.setRelatorioInspecao(relatorioPath);
        }

        if (fotos != null && fotos.length > 0) {
            List<String> fotosPaths = new ArrayList<>();
            for (MultipartFile foto : fotos) {
                String fotoPath = fileUploadService.uploadFile(foto);
                if (fotoPath != null) {
                    fotosPaths.add(fotoPath);
                }
            }
            if (!fotosPaths.isEmpty()) {
                existing.setFotos(new ObjectMapper().writeValueAsString(fotosPaths));
            }
        }

        return pecaRepository.save(existing);
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
        existing.setNumeroSerie(peca.getNumeroSerie());
        existing.setAeronaveInstalada(peca.getAeronaveInstalada());
        existing.setRevisao(peca.getRevisao());
        existing.setQuantidadeProduzida(peca.getQuantidadeProduzida());
        existing.setUnidadeMedida(peca.getUnidadeMedida());
        existing.setDataFabricacao(peca.getDataFabricacao());
        existing.setLoteProducao(peca.getLoteProducao());
        existing.setOperadorResponsavel(peca.getOperadorResponsavel());
        existing.setMaquinaUtilizada(peca.getMaquinaUtilizada());
        existing.setTempoFabricacaoHoras(peca.getTempoFabricacaoHoras());
        existing.setStatusQualidade(peca.getStatusQualidade());
        existing.setRelatorioInspecao(peca.getRelatorioInspecao());
        existing.setFotos(peca.getFotos());
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

    @Transactional
    public Peca atualizarStatus(Long id, String status) {
        Peca peca = findById(id);
        peca.setStatusQualidade(status);
        return pecaRepository.save(peca);
    }
}
