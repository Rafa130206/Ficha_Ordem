package br.com.ordem.ficha.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Ficha {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    private DetalhesPessoais detalhesPessoais;

    @OneToOne(cascade = CascadeType.ALL)
    private Atributos atributos;

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL)
    private List<Pericia> periciais = new ArrayList<>();

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL)
    private List<ItemInventario> inventario = new ArrayList<>();

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL)
    private List<Habilidade> habilidades = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    private Antecedentes antecedentes;

    @ManyToOne
    private Usuario usuario;
}
