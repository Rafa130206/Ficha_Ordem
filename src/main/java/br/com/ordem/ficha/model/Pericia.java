package br.com.ordem.ficha.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pericia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int antropologia;
    private int atirarPistolas;
    private int atirarRifles;
    private int atirarEspingardas;
    private int atirarArcos;
    private int arqueologia;
    private int arremessar;
    private int arteOficio;
    private int avaliacao;
    private int charme;
    private int chaveiro;
    private int ciencia;
    private int consertosEletricos;
    private int consertosMecanicos;
    private int contabilidade;
    private int direito;
    private int dirigirAuto;
    private int disfarce;
    private int encontrar;
    private int escutar;
    private int escalar;
    private int esquivar;
    private int labia;
    private int intimidacao;
    private int historia;
    private int furtividade;
    private int linguaNatural;
    private int lutar;
    private int medicina;
    private int mundoNatural;
    private int natacao;
    private int nivelDeCredito;
    private int ocultismo;
    private int persuasao;
    private int prestidigitacao;
    private int primeirosSocorros;
    private int psicanalise;
    private int psicologia;
    private int saltar;
    private int rastrear;
    private int sobrevivencia;
    private int usarComputadores;
}
