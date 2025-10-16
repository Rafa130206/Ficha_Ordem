package br.com.ordem.ficha.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalhesPessoais {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String jogador;
    private String ocupacao;
    private int idade;
    private String sexo;
    private String localNascimento;
    private String localResidencia;
    private String imagemUrl;
}
