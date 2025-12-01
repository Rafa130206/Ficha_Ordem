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
    public String registerSubmit(@ModelAttribute Usuario usuario,
                                 RedirectAttributes redirectAttributes) {
        try {
            // Validações básicas
            if (usuario.getNome() == null || usuario.getNome().trim().isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Nome é obrigatório");
                return "redirect:/register";
            }

            if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "E-mail é obrigatório");
                return "redirect:/register";
            }

            if (usuario.getSenha() == null || usuario.getSenha().length() < 6) {
                redirectAttributes.addFlashAttribute("error", "Senha deve ter pelo menos 6 caracteres");
                return "redirect:/register";
            }

            usuarioService.salvar(usuario);
            redirectAttributes.addFlashAttribute("success", "Conta criada com sucesso! Faça login para continuar.");
            return "redirect:/login";

        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/register";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erro interno do servidor. Tente novamente.");
            return "redirect:/register";
        }
    }

    @GetMapping("/login")
    public String login(@RequestParam(value = "error", required = false) String error,
                        Model model) {
        if (error != null) {
            model.addAttribute("error", "Usuário ou senha inválidos");
        }
        // Mensagens flash (success) já são adicionadas via RedirectAttributes em outros métodos
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

    @GetMapping("/forgot-password")
    public String forgotPasswordForm() {
        return "forgot-password";
    }

    @PostMapping("/forgot-password")
    public String forgotPasswordSubmit(@RequestParam String email,
                                       RedirectAttributes redirectAttributes) {
        try {
            if (email == null || email.trim().isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "E-mail é obrigatório");
                return "redirect:/forgot-password";
            }

            // Por segurança, sempre redirecionar para a página de redefinição
            // Não informar se o email existe ou não
            return "redirect:/reset-password?email=" + email.trim();

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao processar solicitação. Tente novamente.");
            return "redirect:/forgot-password";
        }
    }

    @GetMapping("/reset-password")
    public String resetPasswordForm(@RequestParam(required = false) String email,
                                    Model model) {
        if (email == null || email.trim().isEmpty()) {
            return "redirect:/forgot-password";
        }

        model.addAttribute("email", email.trim());
        return "reset-password";
    }

    @PostMapping("/reset-password")
    public String resetPasswordSubmit(@RequestParam String email,
                                      @RequestParam String senha,
                                      RedirectAttributes redirectAttributes) {
        try {
            if (email == null || email.trim().isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "E-mail é obrigatório");
                return "redirect:/forgot-password";
            }

            if (senha == null || senha.length() < 6) {
                redirectAttributes.addFlashAttribute("error", "Senha deve ter pelo menos 6 caracteres");
                return "redirect:/reset-password?email=" + email.trim();
            }

            // Verificar se o email existe antes de tentar atualizar
            if (!usuarioService.existePorEmail(email.trim())) {
                // Por segurança, mostrar mensagem genérica mesmo que o email não exista
                redirectAttributes.addFlashAttribute("success",
                        "Se o e-mail estiver cadastrado, a senha foi redefinida com sucesso. Faça login com sua nova senha.");
                return "redirect:/login";
            }

            // Atualizar senha
            usuarioService.atualizarSenha(email.trim(), senha);

            redirectAttributes.addFlashAttribute("success", "Senha redefinida com sucesso! Faça login com sua nova senha.");
            return "redirect:/login";

        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/reset-password?email=" + email.trim();
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao redefinir senha. Tente novamente.");
            return "redirect:/reset-password?email=" + email.trim();
        }
    }

}
