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
public class Atributos {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int aparencia;
    private int constituicao;
    private int destreza;
    private int educacao;
    private int forca;
    private int inteligencia;
    private int poder;
    private int sorte;
    private int tamanho;
    private int movimento;
}
