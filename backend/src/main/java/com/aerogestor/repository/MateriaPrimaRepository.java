package com.aerogestor.repository;

import com.aerogestor.model.MateriaPrima;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MateriaPrimaRepository extends JpaRepository<MateriaPrima, Long> {
    Optional<MateriaPrima> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
}
