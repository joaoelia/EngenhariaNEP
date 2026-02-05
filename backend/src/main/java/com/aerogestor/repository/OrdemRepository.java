package com.aerogestor.repository;

import com.aerogestor.model.Ordem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrdemRepository extends JpaRepository<Ordem, Long> {
    Optional<Ordem> findByNumeroOrdem(String numeroOrdem);
    boolean existsByNumeroOrdem(String numeroOrdem);
}
