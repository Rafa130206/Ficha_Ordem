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
}
