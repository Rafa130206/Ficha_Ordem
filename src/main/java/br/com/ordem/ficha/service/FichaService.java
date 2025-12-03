package br.com.ordem.ficha.service;

import br.com.ordem.ficha.model.DetalhesPessoais;
import br.com.ordem.ficha.model.Ficha;
import br.com.ordem.ficha.model.Usuario;
import br.com.ordem.ficha.repository.FichaRepository;
import br.com.ordem.ficha.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FichaService {

    @Autowired
    private FichaRepository fichaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Ficha getOrCreateByUSerEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        return fichaRepository.findFirstByUsuario_Id(usuario.getId())
                .orElseGet(() -> {
                    Ficha f = new Ficha();
                    f.setUsuario(usuario);
                    f.setDetalhesPessoais(new DetalhesPessoais());
                    return fichaRepository.save(f);
                });
    }

    @Transactional
    public Ficha updateAvatarUrl(Long fichaId, String url) {
        Ficha f = fichaRepository.findById(fichaId).orElseThrow();
        if (f.getDetalhesPessoais() == null) {
            f.setDetalhesPessoais(new DetalhesPessoais());
        }
        f.getDetalhesPessoais().setImagemUrl(url);
        return fichaRepository.save(f);
    }

    public java.util.List<Ficha> listarPorUsuarioEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        return fichaRepository.findByUsuario_IdOrderByIdDesc(usuario.getId());
    }

    @Transactional
    public Ficha criarNovaFicha(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        Ficha novaFicha = new Ficha();
        novaFicha.setUsuario(usuario);
        novaFicha.setDetalhesPessoais(new DetalhesPessoais());
        return fichaRepository.save(novaFicha);
    }

    @Transactional
    public void excluirFicha(Long fichaId, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        Ficha ficha = fichaRepository.findById(fichaId)
                .orElseThrow(() -> new IllegalArgumentException("Ficha não encontrada"));

        if (ficha.getUsuario().getId() != usuario.getId()) {
            throw new IllegalArgumentException("Você não tem permissão para excluir esta ficha");
        }

        fichaRepository.delete(ficha);
    }

    public Ficha buscarPorIdEUsuario(Long fichaId, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        Ficha ficha = fichaRepository.findById(fichaId)
                .orElseThrow(() -> new IllegalArgumentException("Ficha não encontrada"));

        if (ficha.getUsuario().getId() != usuario.getId()) {
            throw new IllegalArgumentException("Você não tem permissão para acessar esta ficha");
        }

        return ficha;
    }

    @Transactional
    public Ficha salvarFichaCompleta(Long fichaId, Ficha fichaAtualizada, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow();
        Ficha ficha = fichaRepository.findById(fichaId)
                .orElseThrow(() -> new IllegalArgumentException("Ficha não encontrada"));

        if (ficha.getUsuario().getId() != usuario.getId()) {
            throw new IllegalArgumentException("Você não tem permissão para editar esta ficha");
        }

        // Atualizar DetalhesPessoais
        if (fichaAtualizada.getDetalhesPessoais() != null) {
            if (ficha.getDetalhesPessoais() == null) {
                ficha.setDetalhesPessoais(new DetalhesPessoais());
            }
            DetalhesPessoais dp = ficha.getDetalhesPessoais();
            DetalhesPessoais dpAtualizado = fichaAtualizada.getDetalhesPessoais();
            if (dpAtualizado.getNome() != null) dp.setNome(dpAtualizado.getNome());
            if (dpAtualizado.getJogador() != null) dp.setJogador(dpAtualizado.getJogador());
            if (dpAtualizado.getOcupacao() != null) dp.setOcupacao(dpAtualizado.getOcupacao());
            dp.setIdade(dpAtualizado.getIdade());
            if (dpAtualizado.getSexo() != null) dp.setSexo(dpAtualizado.getSexo());
            if (dpAtualizado.getLocalNascimento() != null) dp.setLocalNascimento(dpAtualizado.getLocalNascimento());
            if (dpAtualizado.getLocalResidencia() != null) dp.setLocalResidencia(dpAtualizado.getLocalResidencia());
            if (dpAtualizado.getImagemUrl() != null) dp.setImagemUrl(dpAtualizado.getImagemUrl());
        }

        // Atualizar Atributos
        if (fichaAtualizada.getAtributos() != null) {
            if (ficha.getAtributos() == null) {
                ficha.setAtributos(new br.com.ordem.ficha.model.Atributos());
            }
            br.com.ordem.ficha.model.Atributos at = ficha.getAtributos();
            br.com.ordem.ficha.model.Atributos atAtualizado = fichaAtualizada.getAtributos();
            at.setAparencia(atAtualizado.getAparencia());
            at.setConstituicao(atAtualizado.getConstituicao());
            at.setDestreza(atAtualizado.getDestreza());
            at.setEducacao(atAtualizado.getEducacao());
            at.setForca(atAtualizado.getForca());
            at.setInteligencia(atAtualizado.getInteligencia());
            at.setPoder(atAtualizado.getPoder());
            at.setSorte(atAtualizado.getSorte());
            at.setTamanho(atAtualizado.getTamanho());
            at.setMovimento(atAtualizado.getMovimento());
        }

        // Atualizar SubAtributos
        if (fichaAtualizada.getSubAtributos() != null) {
            if (ficha.getSubAtributos() == null) {
                ficha.setSubAtributos(new br.com.ordem.ficha.model.SubAtributos());
            }
            br.com.ordem.ficha.model.SubAtributos sa = ficha.getSubAtributos();
            br.com.ordem.ficha.model.SubAtributos saAtualizado = fichaAtualizada.getSubAtributos();
            sa.setVidaAtual(saAtualizado.getVidaAtual());
            sa.setVidaMaxima(saAtualizado.getVidaMaxima());
            sa.setSanidadeAtual(saAtualizado.getSanidadeAtual());
            sa.setSanidadeMaxima(saAtualizado.getSanidadeMaxima());
            sa.setOcultismoAtual(saAtualizado.getOcultismoAtual());
            sa.setOcultismoMaximo(saAtualizado.getOcultismoMaximo());
            sa.setDanoExtra(saAtualizado.getDanoExtra());
            sa.setCorpo(saAtualizado.getCorpo());
            sa.setExposicaoParanormal(saAtualizado.getExposicaoParanormal());
        }

        // Atualizar Perícias
        if (fichaAtualizada.getPericiais() != null) {
            if (ficha.getPericiais() == null) {
                ficha.setPericiais(new br.com.ordem.ficha.model.Pericia());
            }
            br.com.ordem.ficha.model.Pericia per = ficha.getPericiais();
            br.com.ordem.ficha.model.Pericia perAtualizado = fichaAtualizada.getPericiais();
            // Copiar todos os campos de perícia
            per.setAntropologia(perAtualizado.getAntropologia());
            per.setAtirarPistolas(perAtualizado.getAtirarPistolas());
            per.setAtirarRifles(perAtualizado.getAtirarRifles());
            per.setAtirarEspingardas(perAtualizado.getAtirarEspingardas());
            per.setAtirarArcos(perAtualizado.getAtirarArcos());
            per.setArqueologia(perAtualizado.getArqueologia());
            per.setArremessar(perAtualizado.getArremessar());
            per.setArteOficio(perAtualizado.getArteOficio());
            per.setAvaliacao(perAtualizado.getAvaliacao());
            per.setCharme(perAtualizado.getCharme());
            per.setChaveiro(perAtualizado.getChaveiro());
            per.setCiencia(perAtualizado.getCiencia());
            per.setConsertosEletricos(perAtualizado.getConsertosEletricos());
            per.setConsertosMecanicos(perAtualizado.getConsertosMecanicos());
            per.setContabilidade(perAtualizado.getContabilidade());
            per.setDireito(perAtualizado.getDireito());
            per.setDirigirAuto(perAtualizado.getDirigirAuto());
            per.setDisfarce(perAtualizado.getDisfarce());
            per.setEncontrar(perAtualizado.getEncontrar());
            per.setEscutar(perAtualizado.getEscutar());
            per.setEscalar(perAtualizado.getEscalar());
            per.setEsquivar(perAtualizado.getEsquivar());
            per.setLabia(perAtualizado.getLabia());
            per.setIntimidacao(perAtualizado.getIntimidacao());
            per.setHistoria(perAtualizado.getHistoria());
            per.setFurtividade(perAtualizado.getFurtividade());
            per.setLinguaNatural(perAtualizado.getLinguaNatural());
            per.setLutar(perAtualizado.getLutar());
            per.setMedicina(perAtualizado.getMedicina());
            per.setMundoNatural(perAtualizado.getMundoNatural());
            per.setNatacao(perAtualizado.getNatacao());
            per.setNivelDeCredito(perAtualizado.getNivelDeCredito());
            per.setOcultismo(perAtualizado.getOcultismo());
            per.setPersuasao(perAtualizado.getPersuasao());
            per.setPrestidigitacao(perAtualizado.getPrestidigitacao());
            per.setPrimeirosSocorros(perAtualizado.getPrimeirosSocorros());
            per.setPsicanalise(perAtualizado.getPsicanalise());
            per.setPsicologia(perAtualizado.getPsicologia());
            per.setSaltar(perAtualizado.getSaltar());
            per.setRastrear(perAtualizado.getRastrear());
            per.setSobrevivencia(perAtualizado.getSobrevivencia());
            per.setUsarComputadores(perAtualizado.getUsarComputadores());
        }

        // Atualizar Antecedentes
        if (fichaAtualizada.getAntecedentes() != null) {
            if (ficha.getAntecedentes() == null) {
                ficha.setAntecedentes(new br.com.ordem.ficha.model.Antecedentes());
            }
            br.com.ordem.ficha.model.Antecedentes ant = ficha.getAntecedentes();
            br.com.ordem.ficha.model.Antecedentes antAtualizado = fichaAtualizada.getAntecedentes();
            if (antAtualizado.getDescricaoPessoal() != null) ant.setDescricaoPessoal(antAtualizado.getDescricaoPessoal());
            if (antAtualizado.getIdeologias() != null) ant.setIdeologias(antAtualizado.getIdeologias());
            if (antAtualizado.getPessoasSignificativas() != null) ant.setPessoasSignificativas(antAtualizado.getPessoasSignificativas());
            if (antAtualizado.getLocaisImportantes() != null) ant.setLocaisImportantes(antAtualizado.getLocaisImportantes());
            if (antAtualizado.getPertencesQueridos() != null) ant.setPertencesQueridos(antAtualizado.getPertencesQueridos());
            if (antAtualizado.getFobias() != null) ant.setFobias(antAtualizado.getFobias());
            if (antAtualizado.getPassado() != null) ant.setPassado(antAtualizado.getPassado());
        }

        // Atualizar Inventário
        // Limpar inventário existente (orphanRemoval=true garante deleção no banco)
        if (ficha.getInventario() != null) {
            ficha.getInventario().clear();
        } else {
            ficha.setInventario(new java.util.ArrayList<>());
        }
        // Criar novas instâncias de ItemInventario para garantir persistência correta
        if (fichaAtualizada.getInventario() != null && !fichaAtualizada.getInventario().isEmpty()) {
            System.out.println("Processando " + fichaAtualizada.getInventario().size() + " itens do inventário");
            for (br.com.ordem.ficha.model.ItemInventario itemAtualizado : fichaAtualizada.getInventario()) {
                if (itemAtualizado != null) {
                    String nome = itemAtualizado.getNome();
                    double peso = itemAtualizado.getPeso();
                    System.out.println("Item recebido - Nome: '" + nome + "', Peso: " + peso);

                    // Aceitar itens mesmo com nome vazio (pode ser preenchido depois)
                    // Mas pelo menos verificar se não é null
                    if (nome != null) {
                        // Criar nova instância para garantir que seja uma nova entidade JPA
                        br.com.ordem.ficha.model.ItemInventario novoItem = new br.com.ordem.ficha.model.ItemInventario();
                        novoItem.setNome(nome.trim());
                        novoItem.setPeso(peso);
                        novoItem.setFicha(ficha);
                        ficha.getInventario().add(novoItem);
                        System.out.println("Item adicionado ao inventário: " + novoItem.getNome());
                    } else {
                        System.out.println("Item ignorado: nome é null");
                    }
                }
            }
            System.out.println("Total de itens no inventário após processamento: " + ficha.getInventario().size());
        } else {
            System.out.println("Inventário vazio ou null recebido");
        }

        // Atualizar Habilidades
        // Limpar habilidades existentes (orphanRemoval=true garante deleção no banco)
        if (ficha.getHabilidades() != null) {
            ficha.getHabilidades().clear();
        } else {
            ficha.setHabilidades(new java.util.ArrayList<>());
        }
        // Criar novas instâncias de Habilidade para garantir persistência correta
        if (fichaAtualizada.getHabilidades() != null) {
            for (br.com.ordem.ficha.model.Habilidade habAtualizada : fichaAtualizada.getHabilidades()) {
                if (habAtualizada != null && habAtualizada.getNome() != null && !habAtualizada.getNome().trim().isEmpty()) {
                    // Criar nova instância para garantir que seja uma nova entidade JPA
                    br.com.ordem.ficha.model.Habilidade novaHabilidade = new br.com.ordem.ficha.model.Habilidade();
                    novaHabilidade.setNome(habAtualizada.getNome());
                    novaHabilidade.setDescricao(habAtualizada.getDescricao());
                    novaHabilidade.setCustoPO(habAtualizada.getCustoPO());
                    novaHabilidade.setCustoSAN(habAtualizada.getCustoSAN());
                    novaHabilidade.setFicha(ficha);
                    ficha.getHabilidades().add(novaHabilidade);
                }
            }
        }

        // Atualizar Ataques
        // Limpar ataques existentes (orphanRemoval=true garante deleção no banco)
        if (ficha.getAtaques() != null) {
            ficha.getAtaques().clear();
        } else {
            ficha.setAtaques(new java.util.ArrayList<>());
        }
        // Criar novas instâncias de Ataque para garantir persistência correta
        if (fichaAtualizada.getAtaques() != null && !fichaAtualizada.getAtaques().isEmpty()) {
            System.out.println("Processando " + fichaAtualizada.getAtaques().size() + " ataques");
            for (br.com.ordem.ficha.model.Ataque ataqueAtualizado : fichaAtualizada.getAtaques()) {
                if (ataqueAtualizado != null) {
                    String nome = ataqueAtualizado.getNome();
                    if (nome != null) {
                        // Criar nova instância para garantir que seja uma nova entidade JPA
                        br.com.ordem.ficha.model.Ataque novoAtaque = new br.com.ordem.ficha.model.Ataque();
                        novoAtaque.setNome(nome.trim());
                        novoAtaque.setTipo(ataqueAtualizado.getTipo());
                        novoAtaque.setDano(ataqueAtualizado.getDano());
                        novoAtaque.setMunicaoAtual(ataqueAtualizado.getMunicaoAtual());
                        novoAtaque.setMunicaoMaxima(ataqueAtualizado.getMunicaoMaxima());
                        novoAtaque.setQtdAtaques(ataqueAtualizado.getQtdAtaques());
                        novoAtaque.setAlcance(ataqueAtualizado.getAlcance());
                        novoAtaque.setDefeito(ataqueAtualizado.getDefeito());
                        novoAtaque.setArea(ataqueAtualizado.getArea());
                        novoAtaque.setFicha(ficha);
                        ficha.getAtaques().add(novoAtaque);
                        System.out.println("Ataque adicionado: " + novoAtaque.getNome());
                    }
                }
            }
            System.out.println("Total de ataques após processamento: " + ficha.getAtaques().size());
        }

        return fichaRepository.save(ficha);
    }
}
