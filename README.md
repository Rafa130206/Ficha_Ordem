# 🎲 Ficha Ordem Paranormal

Sistema web para criação e gerenciamento de fichas de personagens do RPG **Ordem Paranormal**.

## 📋 Sobre

Aplicação desenvolvida em Spring Boot que permite aos jogadores criar, editar e gerenciar suas fichas de personagens do sistema Ordem Paranormal. Cada usuário pode ter múltiplas fichas com informações completas sobre atributos, perícias, habilidades, inventário e muito mais.

## 🛠️ Tecnologias

- **Java 17**
- **Spring Boot 3.5.6**
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **MySQL/PostgreSQL** - Banco de dados
- **Thymeleaf** - Templates HTML
- **Lombok** - Redução de boilerplate

## 🚀 Como Executar

### Pré-requisitos

- Java 17 ou superior
- Maven
- MySQL ou PostgreSQL

### Passos

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd ficha-ordem
```

2. Configure o banco de dados no arquivo `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ficha_db
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

3. Execute a aplicação:
```bash
./mvnw spring-boot:run
```

4. Acesse no navegador:
```
http://localhost:8080
```

## 📁 Estrutura do Projeto

```
src/main/java/br/com/ordem/ficha/
├── controller/      # Controladores REST e MVC
├── model/          # Entidades JPA
├── repository/     # Repositórios de dados
├── service/        # Lógica de negócio
└── security/       # Configurações de segurança
```

## ✨ Funcionalidades

- ✅ Sistema de autenticação (login/registro)
- ✅ Criação e edição de fichas de personagem
- ✅ Gerenciamento de atributos e sub-atributos
- ✅ Sistema de perícias
- ✅ Inventário de itens
- ✅ Habilidades e ataques
- ✅ Upload de imagens
- ✅ Múltiplas fichas por usuário

