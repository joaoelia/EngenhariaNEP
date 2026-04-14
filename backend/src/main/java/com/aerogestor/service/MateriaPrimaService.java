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
import com.fasterxml.jackson.core.type.TypeReference;
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

    private void validarLimitesEstoque(MateriaPrima materiaPrima) {
        if (materiaPrima.getEstoqueMinimo() != null && materiaPrima.getEstoqueMinimo() < 0) {
            throw new RuntimeException("Estoque mínimo não pode ser negativo");
        }
        if (materiaPrima.getEstoqueMaximo() != null && materiaPrima.getEstoqueMaximo() < 0) {
            throw new RuntimeException("Estoque máximo não pode ser negativo");
        }
        if (materiaPrima.getEstoqueMinimo() != null && materiaPrima.getEstoqueMaximo() != null
                && materiaPrima.getEstoqueMinimo() > materiaPrima.getEstoqueMaximo()) {
            throw new RuntimeException("Estoque mínimo não pode ser maior que o estoque máximo");
        }
    }

    private void validarQuantidade(MateriaPrima materiaPrima) {
        if (materiaPrima.getQuantidadeEstoque() == null || materiaPrima.getQuantidadeEstoque() <= 0) {
            throw new RuntimeException("Quantidade deve ser maior que zero");
        }
    }

    @Transactional
    public MateriaPrima create(MateriaPrima materiaPrima) {
        if (materiaPrimaRepository.existsByCodigo(materiaPrima.getCodigo())) {
            throw new RuntimeException("Código já cadastrado: " + materiaPrima.getCodigo());
        }
        validarQuantidade(materiaPrima);
        validarLimitesEstoque(materiaPrima);
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
        materiaPrima.setQuantidadeEstoque(dto.getQuantidade() != null ? dto.getQuantidade().intValue() : 0);
        materiaPrima.setEstoqueMinimo(dto.getEstoqueMinimo());
        materiaPrima.setEstoqueMaximo(dto.getEstoqueMaximo());
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

        validarQuantidade(materiaPrima);
        validarLimitesEstoque(materiaPrima);
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
        existing.setEstoqueMinimo(materiaPrima.getEstoqueMinimo());
        existing.setEstoqueMaximo(materiaPrima.getEstoqueMaximo());
        existing.setUnidadeMedida(materiaPrima.getUnidadeMedida());
        existing.setLote(materiaPrima.getLote());
        existing.setDataEntrada(materiaPrima.getDataEntrada());
        existing.setFornecedor(materiaPrima.getFornecedor());
        existing.setCertificadoQualidade(materiaPrima.getCertificadoQualidade());
        existing.setObservacoes(materiaPrima.getObservacoes());

        validarQuantidade(existing);
        validarLimitesEstoque(existing);
        return materiaPrimaRepository.save(existing);
    }

    @Transactional
    public MateriaPrima updateWithFiles(Long id, MateriaPrimaRequestDTO dto) throws IOException {
        MateriaPrima existing = findById(id);

        existing.setDescricao(dto.getNome());
        existing.setTipoMaterial(dto.getNome());
        existing.setQuantidadeEstoque(dto.getQuantidade() != null ? dto.getQuantidade().intValue() : 0);
        existing.setEstoqueMinimo(dto.getEstoqueMinimo());
        existing.setEstoqueMaximo(dto.getEstoqueMaximo());
        existing.setFornecedor(dto.getFornecedor());
        existing.setLote(dto.getLote());
        existing.setDataEntrada(dto.getDataEntrada());
        existing.setAltura(dto.getAltura());
        existing.setLargura(dto.getLargura());
        existing.setEspessura(dto.getEspessura());

        if (dto.getAltura() != null || dto.getLargura() != null || dto.getEspessura() != null) {
            existing.setEspecificacao(
                String.format("Altura: %.2fmm, Largura: %.2fmm, Espessura: %.2fmm",
                    dto.getAltura() != null ? dto.getAltura() : 0.0,
                    dto.getLargura() != null ? dto.getLargura() : 0.0,
                    dto.getEspessura() != null ? dto.getEspessura() : 0.0)
            );
        } else {
            existing.setEspecificacao(null);
        }

        if (Boolean.TRUE.equals(dto.getRemoveCertComposicao())) {
            if (existing.getCertComposicao() != null) {
                fileUploadService.deleteFile(existing.getCertComposicao());
            }
            existing.setCertComposicao(null);
        } else if (dto.getCertComposicao() != null && !dto.getCertComposicao().isEmpty()) {
            if (existing.getCertComposicao() != null) {
                fileUploadService.deleteFile(existing.getCertComposicao());
            }
            existing.setCertComposicao(fileUploadService.uploadFile(dto.getCertComposicao()));
        }

        if (Boolean.TRUE.equals(dto.getRemoveRelatorioPropriedades())) {
            if (existing.getRelatorioPropriedades() != null) {
                fileUploadService.deleteFile(existing.getRelatorioPropriedades());
            }
            existing.setRelatorioPropriedades(null);
        } else if (dto.getRelatorioPropriedades() != null && !dto.getRelatorioPropriedades().isEmpty()) {
            if (existing.getRelatorioPropriedades() != null) {
                fileUploadService.deleteFile(existing.getRelatorioPropriedades());
            }
            existing.setRelatorioPropriedades(fileUploadService.uploadFile(dto.getRelatorioPropriedades()));
        }

        if (Boolean.TRUE.equals(dto.getRemoveLaudoPenetrante())) {
            if (existing.getLaudoPenetrante() != null) {
                fileUploadService.deleteFile(existing.getLaudoPenetrante());
            }
            existing.setLaudoPenetrante(null);
        } else if (dto.getLaudoPenetrante() != null && !dto.getLaudoPenetrante().isEmpty()) {
            if (existing.getLaudoPenetrante() != null) {
                fileUploadService.deleteFile(existing.getLaudoPenetrante());
            }
            existing.setLaudoPenetrante(fileUploadService.uploadFile(dto.getLaudoPenetrante()));
        }

        if (Boolean.TRUE.equals(dto.getRemoveNotaFiscal())) {
            if (existing.getNotaFiscal() != null) {
                fileUploadService.deleteFile(existing.getNotaFiscal());
            }
            existing.setNotaFiscal(null);
        } else if (dto.getNotaFiscal() != null && !dto.getNotaFiscal().isEmpty()) {
            if (existing.getNotaFiscal() != null) {
                fileUploadService.deleteFile(existing.getNotaFiscal());
            }
            existing.setNotaFiscal(fileUploadService.uploadFile(dto.getNotaFiscal()));
        }

        List<String> imagensExistentes = new ArrayList<>();
        if (existing.getImagens() != null && !existing.getImagens().isBlank()) {
            try {
                imagensExistentes = new ObjectMapper().readValue(existing.getImagens(), new TypeReference<List<String>>() {});
            } catch (Exception ignored) {
                imagensExistentes = new ArrayList<>();
            }
        }

        if (dto.getRemoveImagens() != null && !dto.getRemoveImagens().isEmpty()) {
            dto.getRemoveImagens().forEach(fileUploadService::deleteFile);
            imagensExistentes.removeIf(dto.getRemoveImagens()::contains);
        }

        if (dto.getImagens() != null && dto.getImagens().length > 0) {
            for (MultipartFile imagem : dto.getImagens()) {
                if (imagem != null && !imagem.isEmpty()) {
                    String imagemPath = fileUploadService.uploadFile(imagem);
                    if (imagemPath != null) {
                        imagensExistentes.add(imagemPath);
                    }
                }
            }

        }

        if (imagensExistentes.isEmpty()) {
            existing.setImagens("[]");
        } else {
            existing.setImagens(new ObjectMapper().writeValueAsString(imagensExistentes));
        }

        validarQuantidade(existing);
        validarLimitesEstoque(existing);
        return materiaPrimaRepository.save(existing);
    }

    @Transactional
    public MateriaPrima deleteAttachment(Long id, String tipo, String nomeArquivo) {
        MateriaPrima existing = findById(id);

        switch (tipo) {
            case "certComposicao" -> {
                if (existing.getCertComposicao() != null) {
                    fileUploadService.deleteFile(existing.getCertComposicao());
                    existing.setCertComposicao(null);
                }
            }
            case "relatorioPropriedades" -> {
                if (existing.getRelatorioPropriedades() != null) {
                    fileUploadService.deleteFile(existing.getRelatorioPropriedades());
                    existing.setRelatorioPropriedades(null);
                }
            }
            case "laudoPenetrante" -> {
                if (existing.getLaudoPenetrante() != null) {
                    fileUploadService.deleteFile(existing.getLaudoPenetrante());
                    existing.setLaudoPenetrante(null);
                }
            }
            case "notaFiscal" -> {
                if (existing.getNotaFiscal() != null) {
                    fileUploadService.deleteFile(existing.getNotaFiscal());
                    existing.setNotaFiscal(null);
                }
            }
            case "imagem" -> {
                if (nomeArquivo == null || nomeArquivo.isBlank()) {
                    throw new RuntimeException("nomeArquivo é obrigatório para remover imagem");
                }

                List<String> imagensExistentes = new ArrayList<>();
                if (existing.getImagens() != null && !existing.getImagens().isBlank()) {
                    try {
                        imagensExistentes = new ObjectMapper().readValue(existing.getImagens(), new TypeReference<List<String>>() {});
                    } catch (Exception ignored) {
                        imagensExistentes = new ArrayList<>();
                    }
                }

                if (imagensExistentes.remove(nomeArquivo)) {
                    fileUploadService.deleteFile(nomeArquivo);
                }

                if (imagensExistentes.isEmpty()) {
                    existing.setImagens("[]");
                } else {
                    try {
                        existing.setImagens(new ObjectMapper().writeValueAsString(imagensExistentes));
                    } catch (Exception e) {
                        throw new RuntimeException("Erro ao atualizar lista de imagens", e);
                    }
                }
            }
            default -> throw new RuntimeException("Tipo de anexo inválido: " + tipo);
        }

        return materiaPrimaRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        delete(id, null, true);
    }

    @Transactional
    public void delete(Long id, Integer quantidade, boolean cancelarTudo) {
        MateriaPrima materiaPrima = materiaPrimaRepository.findById(id).orElse(null);
        if (materiaPrima == null) {
            return;
        }

        if (cancelarTudo) {
            materiaPrimaRepository.delete(materiaPrima);
            return;
        }

        if (quantidade == null || quantidade <= 0) {
            throw new RuntimeException("Informe uma quantidade válida para exclusão parcial");
        }

        int quantidadeAtual = materiaPrima.getQuantidadeEstoque() == null ? 0 : materiaPrima.getQuantidadeEstoque();

        if (quantidade >= quantidadeAtual) {
            materiaPrimaRepository.delete(materiaPrima);
            return;
        }

        materiaPrima.setQuantidadeEstoque(quantidadeAtual - quantidade);
        materiaPrimaRepository.save(materiaPrima);
    }

    @Transactional
    public MateriaPrima atualizarEstoque(Long id, Integer quantidade) {
        if (quantidade == null || quantidade <= 0) {
            throw new RuntimeException("Quantidade deve ser maior que zero");
        }
        MateriaPrima materiaPrima = findById(id);
        materiaPrima.setQuantidadeEstoque(quantidade);
        return materiaPrimaRepository.save(materiaPrima);
    }
}
