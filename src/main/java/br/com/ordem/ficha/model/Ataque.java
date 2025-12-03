package br.com.ordem.ficha.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ataque {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String tipo;
    private String dano;
    private Integer municaoAtual;
    private Integer municaoMaxima;
    private Integer qtdAtaques;
    private String alcance;
    private String defeito;
    private String area;

    @ManyToOne
    @JsonIgnore
    private Ficha ficha;
}

