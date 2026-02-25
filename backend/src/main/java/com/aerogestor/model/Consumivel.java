package com.aerogestor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Entity
@Table(name = "consumiveis")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consumivel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "part_number", nullable = false, unique = true)
    @JsonProperty("part_number")
    private String partNumber;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false)
    private String fornecedor;

    @Column(name = "local_estoque", nullable = false)
    @JsonProperty("local_estoque")
    private String localEstoque;

    @Column(name = "created_at", updatable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
