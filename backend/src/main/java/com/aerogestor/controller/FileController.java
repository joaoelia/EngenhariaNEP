package com.aerogestor.controller;

import com.aerogestor.model.MateriaPrima;
import com.aerogestor.repository.MateriaPrimaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.text.Normalizer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    private final MateriaPrimaRepository materiaPrimaRepository;

    @GetMapping("/download/{filename}")
    public ResponseEntity<?> downloadFile(@PathVariable String filename) {
        try {
            // Sanitize filename to prevent directory traversal
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return ResponseEntity.badRequest().build();
            }

            Path filePath = Paths.get(uploadDir).resolve(filename);
            File file = filePath.toFile();

            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.notFound().build();
            }

            byte[] content = Files.readAllBytes(filePath);
            String mediaType = getMediaType(filename);
            String downloadName = getDownloadName(filename);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadName + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, mediaType)
                    .contentLength(content.length)
                    .body(content);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/view/{filename}")
    public ResponseEntity<?> viewFile(@PathVariable String filename) {
        try {
            // Sanitize filename to prevent directory traversal
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                return ResponseEntity.badRequest().build();
            }

            Path filePath = Paths.get(uploadDir).resolve(filename);
            File file = filePath.toFile();

            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.notFound().build();
            }

            byte[] content = Files.readAllBytes(filePath);
            String mediaType = getMediaType(filename);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, mediaType)
                    .contentLength(content.length)
                    .body(content);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String getDownloadName(String storedFilename) {
        var materiaPrima = materiaPrimaRepository.findByAttachmentFilename(storedFilename);
        if (materiaPrima.isEmpty()) {
            return storedFilename;
        }

        String extension = getFileExtension(storedFilename);
        String prefix = getMateriaPrimaPrefix(materiaPrima.get(), storedFilename);
        String baseName = buildMateriaPrimaBaseName(materiaPrima.get());
        return prefix + baseName + extension;
    }

    private String getMateriaPrimaPrefix(MateriaPrima materiaPrima, String storedFilename) {
        if (storedFilename.equals(materiaPrima.getCertComposicao())) {
            return "CCQ";
        }
        if (storedFilename.equals(materiaPrima.getRelatorioPropriedades())) {
            return "RPM";
        }
        if (storedFilename.equals(materiaPrima.getLaudoPenetrante())) {
            return "LEP";
        }
        if (storedFilename.equals(materiaPrima.getNotaFiscal())) {
            return "NF";
        }

        String imagens = materiaPrima.getImagens();
        if (imagens != null && !imagens.isBlank() && imagens.contains(storedFilename)) {
            return "IMG";
        }

        return "ARQ";
    }

    private String buildMateriaPrimaBaseName(MateriaPrima materiaPrima) {
        String item = sanitizeForFilename(materiaPrima.getDescricao());
        String fornecedor = sanitizeForFilename(materiaPrima.getFornecedor());

        if (item.isBlank()) {
            item = "item";
        }
        if (fornecedor.isBlank()) {
            fornecedor = "fornecedor";
        }

        return item + "_" + fornecedor;
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            return "";
        }
        return filename.substring(dotIndex);
    }

    private String sanitizeForFilename(String value) {
        if (value == null) {
            return "";
        }

        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT);

        return normalized
                .replaceAll("\\s+", "")
                .replaceAll("[^a-z0-9_-]", "");
    }

    private String getMediaType(String filename) {
        if (filename.endsWith(".pdf")) {
            return MediaType.APPLICATION_PDF_VALUE;
        } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG_VALUE;
        } else if (filename.endsWith(".png")) {
            return MediaType.IMAGE_PNG_VALUE;
        } else if (filename.endsWith(".doc") || filename.endsWith(".docx")) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (filename.endsWith(".xls") || filename.endsWith(".xlsx")) {
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }
        return MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }
}
