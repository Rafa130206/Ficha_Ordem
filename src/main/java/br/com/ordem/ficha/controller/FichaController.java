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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
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
    public String exibirFicha(@RequestParam(required = false) Long id,
                              Model model,
                              @AuthenticationPrincipal User principal) {
        if (principal == null) {
            return "redirect:/login";
        }

        Ficha ficha;
        if (id != null) {
            // Buscar ficha específica por ID
            try {
                ficha = fichaService.buscarPorIdEUsuario(id, principal.getUsername());
            } catch (IllegalArgumentException e) {
                return "redirect:/menu";
            }
        } else {
            // Se não especificou ID, redirecionar para o menu
            return "redirect:/menu";
        }

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
                // Buscar a ficha pelo ID do request ou usar a primeira do usuário
                // Por enquanto, vamos precisar passar o ID via request
                // Para upload de avatar, assumimos que já estamos em uma ficha específica
                // Isso será melhorado se necessário
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

    @PostMapping(value = "/api/ficha/salvar", consumes = "application/json", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> salvarFicha(@RequestBody Ficha fichaAtualizada,
                                                           @AuthenticationPrincipal User principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Usuário não autenticado"));
            }

            if (fichaAtualizada.getId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "ID da ficha é obrigatório"));
            }

            Ficha fichaSalva = fichaService.salvarFichaCompleta(fichaAtualizada.getId(), fichaAtualizada, principal.getUsername());

            return ResponseEntity.ok(Map.of("success", true, "message", "Ficha salva com sucesso!", "id", fichaSalva.getId()));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao salvar ficha: " + e.getMessage()));
        }
    }
}

