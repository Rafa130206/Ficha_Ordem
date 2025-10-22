package br.com.ordem.ficha.controller;

import br.com.ordem.ficha.model.Usuario;
import br.com.ordem.ficha.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

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
    public String login(@RequestParam(value = "error", required = false) String error, Model model) {
        if (error != null) {
            model.addAttribute("error", "Usuário ou senha inválidos");
        }
        return "login";
    }

    @PostMapping("/login")
    public String loginSubmit(@RequestParam String username,
                              @RequestParam String password,
                              RedirectAttributes redirectAttributes) {
        try {
            Usuario usuario = usuarioService.buscarPorUsername(username);
            if (usuario != null && passwordEncoder.matches(password, usuario.getSenha())) {
                // Login bem-sucedido - redirecionar para a ficha
                return "redirect:/ficha";
            } else {
                redirectAttributes.addFlashAttribute("error", "Usuário ou senha inválidos");
                return "redirect:/login?error=true";
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao fazer login");
            return "redirect:/login?error=true";
        }
    }

    @GetMapping("/logout")
    public String logout() {
        return "redirect:/login";
    }

}
