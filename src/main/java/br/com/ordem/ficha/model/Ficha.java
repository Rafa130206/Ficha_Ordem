package br.com.ordem.ficha.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ficha {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    private DetalhesPessoais detalhesPessoais;

    @OneToOne(cascade = CascadeType.ALL)
    private Atributos atributos;

    @OneToOne(cascade = CascadeType.ALL)
    private SubAtributos subAtributos;

    @OneToOne(cascade = CascadeType.ALL)
    private Pericia periciais;

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL)
    private List<ItemInventario> inventario = new ArrayList<>();

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL)
    private List<Habilidade> habilidades = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    private Antecedentes antecedentes;

    @ManyToOne
    private Usuario usuario;
}
