package br.com.ordem.ficha.service;

import br.com.ordem.ficha.model.Usuario;
import br.com.ordem.ficha.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        return User.withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .roles("USER")
                .build();
    }

    public void salvar(Usuario usuario) {
        if (repo.existsByEmail((usuario.getEmail()))) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        usuario.setSenha(new BCryptPasswordEncoder().encode(usuario.getSenha()));
        repo.save(usuario);
    }

}
