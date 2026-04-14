package com.aerogestor.repository;

import com.aerogestor.model.Retirada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RetiradaRepository extends JpaRepository<Retirada, Long> {
    List<Retirada> findByTipoItem(String tipoItem);
    List<Retirada> findByItemId(Long itemId);
    Optional<Retirada> findTopByTipoItemAndItemIdAndDataAndPessoaOrderByIdDesc(
            String tipoItem,
            Long itemId,
            java.time.LocalDate data,
            String pessoa
    );
}
