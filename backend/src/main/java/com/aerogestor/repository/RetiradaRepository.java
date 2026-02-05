package com.aerogestor.repository;

import com.aerogestor.model.Retirada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetiradaRepository extends JpaRepository<Retirada, Long> {
    List<Retirada> findByTipoItem(String tipoItem);
    List<Retirada> findByItemId(Long itemId);
}
