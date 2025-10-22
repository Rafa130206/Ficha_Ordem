package br.com.ordem.ficha.controller;

import br.com.ordem.ficha.model.Ficha;
import br.com.ordem.ficha.service.FichaService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Controller
public class FichaController {

    private final FichaService fichaService;

    public FichaController(FichaService fichaService) {
        this.fichaService = fichaService;
    }

    @GetMapping("/ficha")
    public String exibirFicha(Model model, @AuthenticationPrincipal User principal) {
        Ficha ficha = (principal != null)
                ? fichaService.getOrCreateByUSerEmail(principal.getUsername())
                : new Ficha();
        model.addAttribute("ficha", ficha);
        return "ficha";
    }

    @PostMapping("/ficha/upload-avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file,
                                                            @AuthenticationPrincipal User principal) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Arquivo vazio"));
        }
        try {
            String uploadsDir = "uploads"; // pasta na raiz do projeto/servidor
            Path uploadPath = Paths.get(uploadsDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String original = file.getOriginalFilename();
            String ext = (original != null && original.contains(".")) ? original.substring(original.lastIndexOf('.')) : "";
            String filename = UUID.randomUUID() + ext;
            Path destination = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            String url = "/uploads/" + filename;

            if (principal != null) {
                Ficha ficha = fichaService.getOrCreateByUSerEmail(principal.getUsername());
                fichaService.updateAvatarUrl(ficha.getId(), url);
            }

            Map<String, String> body = new HashMap<>();
            body.put("url", url);
            return ResponseEntity.ok(body);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Falha ao salvar arquivo"));
        }
    }
}

