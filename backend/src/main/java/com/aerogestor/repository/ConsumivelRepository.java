package com.aerogestor.repository;

import com.aerogestor.model.Consumivel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsumivelRepository extends JpaRepository<Consumivel, Long> {
    Optional<Consumivel> findByPartNumber(String partNumber);
    Optional<Consumivel> findByNome(String nome);
    boolean existsByPartNumber(String partNumber);
    boolean existsByNome(String nome);
}
