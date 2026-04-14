package com.aerogestor.service;

import com.aerogestor.model.Ordem;
import com.aerogestor.repository.OrdemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdemService {

    private final OrdemRepository ordemRepository;
    private final FileUploadService fileUploadService;

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
    public Ordem createWithPdf(
            String tipoOrdem,
            String projeto,
            String partNumber,
            String status,
            String dataCriacao,
            String dadosFormulario,
            MultipartFile arquivoPdf
    ) throws IOException {
        // Gerar número de ordem automaticamente
        String numeroOrdem = gerarNumeroOrdem(tipoOrdem);

        // Upload do arquivo PDF se fornecido
        String pdfFileName = null;
        if (arquivoPdf != null && !arquivoPdf.isEmpty()) {
            pdfFileName = fileUploadService.uploadFile(arquivoPdf);
        }

        // Criar ordem
        Ordem ordem = new Ordem();
        ordem.setNumeroOrdem(numeroOrdem);
        ordem.setTipoOrdem(tipoOrdem);
        ordem.setProjeto(projeto);
        ordem.setPartNumber(partNumber);
        ordem.setStatus(status);
        ordem.setDataCriacao(java.time.LocalDate.parse(dataCriacao));
        ordem.setDadosFormulario(dadosFormulario);
        ordem.setArquivoPdf(pdfFileName);

        return ordemRepository.save(ordem);
    }

    private String gerarNumeroOrdem(String tipoOrdem) {
        String prefixo;
        switch (tipoOrdem.toUpperCase()) {
            case "FABRICACAO": prefixo = "OF"; break;
            case "PRODUCAO": prefixo = "OP"; break;
            case "PROJETO": prefixo = "OPR"; break;
            default: prefixo = "ORD";
        }
        
        long count = ordemRepository.count() + 1;
        return String.format("%s-%04d", prefixo, count);
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
    public Ordem updateWithPdf(
            Long id,
            String dadosFormulario,
            String projeto,
            String partNumber,
            String status,
            MultipartFile arquivoPdf
    ) throws IOException {
        Ordem existing = findById(id);

        // Update form data
        existing.setDadosFormulario(dadosFormulario);

        // Update main entity fields if provided
        if (projeto != null && !projeto.isBlank()) existing.setProjeto(projeto);
        if (partNumber != null && !partNumber.isBlank()) existing.setPartNumber(partNumber);
        if (status != null && !status.isBlank()) existing.setStatus(status);

        // Upload new PDF if provided
        if (arquivoPdf != null && !arquivoPdf.isEmpty()) {
            // Delete old PDF if exists
            if (existing.getArquivoPdf() != null && !existing.getArquivoPdf().isEmpty()) {
                try {
                    fileUploadService.deleteFile(existing.getArquivoPdf());
                } catch (Exception e) {
                    System.err.println("Erro ao deletar PDF antigo: " + e.getMessage());
                }
            }
            
            // Upload new PDF
            String newPdfFileName = fileUploadService.uploadFile(arquivoPdf);
            existing.setArquivoPdf(newPdfFileName);
        }

        return ordemRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!ordemRepository.existsById(id)) {
            throw new RuntimeException("Ordem não encontrada com id: " + id);
        }
        
        // Deletar arquivo PDF associado
        Ordem ordem = findById(id);
        if (ordem.getArquivoPdf() != null && !ordem.getArquivoPdf().isEmpty()) {
            try {
                fileUploadService.deleteFile(ordem.getArquivoPdf());
            } catch (Exception e) {
                // Log error but continue with deletion
                System.err.println("Erro ao deletar arquivo PDF: " + e.getMessage());
            }
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
