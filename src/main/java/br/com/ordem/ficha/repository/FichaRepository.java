package br.com.ordem.ficha.repository;

import br.com.ordem.ficha.model.Ficha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FichaRepository extends JpaRepository<Ficha, Long> {

    Optional<Ficha> findFirstByUsuario_Id(Long usuarioId);

}
