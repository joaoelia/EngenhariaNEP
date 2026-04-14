package com.aerogestor.repository;

import com.aerogestor.model.MateriaPrima;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MateriaPrimaRepository extends JpaRepository<MateriaPrima, Long> {
    Optional<MateriaPrima> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);

    @Query("""
            SELECT mp FROM MateriaPrima mp
            WHERE mp.certComposicao = :filename
               OR mp.relatorioPropriedades = :filename
               OR mp.laudoPenetrante = :filename
               OR mp.notaFiscal = :filename
               OR mp.imagens LIKE CONCAT('%', :filename, '%')
            """)
    Optional<MateriaPrima> findByAttachmentFilename(@Param("filename") String filename);
}
