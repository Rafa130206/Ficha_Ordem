package br.com.ordem.ficha.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Antecedentes {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "int default 0")
    private int valor = 0;

    private String descricaoPessoal;
    private String ideologias;
    private String pessoasSignificativas;
    private String locaisImportantes;
    private String pertencesQueridos;
    private String fobias;
    private String passado;
}
