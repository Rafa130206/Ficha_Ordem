package br.com.ordem.ficha.controller;

import br.com.ordem.ficha.model.Usuario;
import br.com.ordem.ficha.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("usuario", new Usuario());
        return "register";
    }

    @PostMapping("/register")
    public String registerSubmit(@ModelAttribute Usuario usuario) {
        usuarioService.salvar(usuario);
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

}
