package com.aerogestor.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileController {

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

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

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
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
