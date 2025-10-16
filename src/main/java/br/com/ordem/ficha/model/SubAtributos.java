package br.com.ordem.ficha.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubAtributos {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int vidaAtual;
    private int vidaMaxima;

    private int sanidadeAtual;
    private int sanidadeMaxima;

    private int ocultismoAtual;
    private int ocultismoMaximo;

    private int danoExtra;
    private int corpo;
    private int exposicaoParanormal;

}
