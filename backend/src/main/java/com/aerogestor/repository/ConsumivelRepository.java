package com.aerogestor.repository;

import com.aerogestor.model.Consumivel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsumivelRepository extends JpaRepository<Consumivel, Long> {
    Optional<Consumivel> findByPartNumber(String partNumber);
    boolean existsByPartNumber(String partNumber);
}
