package com.aerogestor.service;

import com.aerogestor.dto.MateriaPrimaRequestDTO;
import com.aerogestor.model.MateriaPrima;
import com.aerogestor.repository.MateriaPrimaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MateriaPrimaService {

    private final MateriaPrimaRepository materiaPrimaRepository;
    private final FileUploadService fileUploadService;

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
    public MateriaPrima createWithFiles(MateriaPrimaRequestDTO dto) throws IOException {
        MateriaPrima materiaPrima = new MateriaPrima();

        // Gerar código único se não fornecido
        String codigo = "MP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        materiaPrima.setCodigo(codigo);

        // Definir campos básicos
        materiaPrima.setDescricao(dto.getNome());
        materiaPrima.setTipoMaterial(dto.getNome());
        materiaPrima.setQuantidadeEstoque(dto.getQuantidade());
        materiaPrima.setUnidadeMedida("peças");
        materiaPrima.setFornecedor(dto.getFornecedor());
        materiaPrima.setLote(dto.getLote());
        materiaPrima.setDataEntrada(dto.getDataEntrada());

        // Salvar dimensões individuais
        materiaPrima.setAltura(dto.getAltura());
        materiaPrima.setLargura(dto.getLargura());
        materiaPrima.setEspessura(dto.getEspessura());

        // Processar dimensões
        if (dto.getAltura() != null) {
            materiaPrima.setEspecificacao(
                String.format("Altura: %.2fmm, Largura: %.2fmm, Espessura: %.2fmm",
                    dto.getAltura(),
                    dto.getLargura() != null ? dto.getLargura() : 0.0,
                    dto.getEspessura() != null ? dto.getEspessura() : 0.0)
            );
        }

        // Processar uploads de arquivo
        String certComposicao = null;
        String relatorioPropriedades = null;
        String laudoPenetrante = null;
        String notaFiscal = null;
        List<String> imagens = new ArrayList<>();

        try {
            if (dto.getCertComposicao() != null) {
                certComposicao = fileUploadService.uploadFile(dto.getCertComposicao());
            }
            if (dto.getRelatorioPropriedades() != null) {
                relatorioPropriedades = fileUploadService.uploadFile(dto.getRelatorioPropriedades());
            }
            if (dto.getLaudoPenetrante() != null) {
                laudoPenetrante = fileUploadService.uploadFile(dto.getLaudoPenetrante());
            }
            if (dto.getNotaFiscal() != null) {
                notaFiscal = fileUploadService.uploadFile(dto.getNotaFiscal());
            }
            if (dto.getImagens() != null && dto.getImagens().length > 0) {
                for (MultipartFile imagem : dto.getImagens()) {
                    String imagemPath = fileUploadService.uploadFile(imagem);
                    if (imagemPath != null) {
                        imagens.add(imagemPath);
                    }
                }
            }
        } catch (IOException e) {
            throw new IOException("Erro ao processar arquivos: " + e.getMessage());
        }

        // Salvar caminhos dos arquivos
        materiaPrima.setCertComposicao(certComposicao);
        materiaPrima.setRelatorioPropriedades(relatorioPropriedades);
        materiaPrima.setLaudoPenetrante(laudoPenetrante);
        materiaPrima.setNotaFiscal(notaFiscal);

        if (!imagens.isEmpty()) {
            try {
                materiaPrima.setImagens(new ObjectMapper().writeValueAsString(imagens));
            } catch (Exception e) {
                materiaPrima.setImagens("[]");
            }
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
