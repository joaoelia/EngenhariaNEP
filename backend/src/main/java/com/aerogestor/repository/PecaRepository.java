package com.aerogestor.repository;

import com.aerogestor.model.Peca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PecaRepository extends JpaRepository<Peca, Long> {
    Optional<Peca> findByCodigoPeca(String codigoPeca);
    boolean existsByCodigoPeca(String codigoPeca);
}
