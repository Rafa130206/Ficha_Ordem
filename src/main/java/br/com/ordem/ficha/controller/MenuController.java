package br.com.ordem.ficha.controller;

import br.com.ordem.ficha.model.Ficha;
import br.com.ordem.ficha.service.FichaService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
public class MenuController {

    private final FichaService fichaService;

    public MenuController(FichaService fichaService) {
        this.fichaService = fichaService;
    }

    @GetMapping("/menu")
    public String exibirMenu(Model model, @AuthenticationPrincipal User principal) {
        if (principal == null) {
            return "redirect:/login";
        }

        List<Ficha> fichas = fichaService.listarPorUsuarioEmail(principal.getUsername());
        model.addAttribute("fichas", fichas);
        return "menu";
    }

    @PostMapping("/menu/criar-ficha")
    public String criarFicha(@AuthenticationPrincipal User principal,
                             RedirectAttributes redirectAttributes) {
        try {
            if (principal == null) {
                return "redirect:/login";
            }

            Ficha novaFicha = fichaService.criarNovaFicha(principal.getUsername());
            redirectAttributes.addFlashAttribute("success", "Ficha criada com sucesso!");
            return "redirect:/ficha?id=" + novaFicha.getId();
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao criar ficha: " + e.getMessage());
            return "redirect:/menu";
        }
    }

    @PostMapping("/menu/excluir-ficha")
    public String excluirFicha(@RequestParam Long id,
                               @AuthenticationPrincipal User principal,
                               RedirectAttributes redirectAttributes) {
        try {
            if (principal == null) {
                return "redirect:/login";
            }

            fichaService.excluirFicha(id, principal.getUsername());
            redirectAttributes.addFlashAttribute("success", "Ficha excluída com sucesso!");
            return "redirect:/menu";
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/menu";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao excluir ficha: " + e.getMessage());
            return "redirect:/menu";
        }
    }
}

