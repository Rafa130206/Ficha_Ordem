package br.com.ordem.ficha.controller;

import br.com.ordem.ficha.model.Ficha;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FichaController {

    @GetMapping("/ficha")
    public String exibirFicha(Model model) {
        Ficha ficha = new Ficha();
        model.addAttribute("ficha", ficha);
        return "ficha";
    }
}
