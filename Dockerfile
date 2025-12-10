# Dockerfile para Fly.io ou outras plataformas Docker
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copiar arquivos Maven
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Baixar dependências
RUN ./mvnw dependency:go-offline

# Copiar código fonte
COPY src ./src

# Build da aplicação
RUN ./mvnw clean package -DskipTests

# Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar JAR
COPY --from=build /app/target/*.jar app.jar

# Criar diretório de uploads
RUN mkdir -p /app/uploads

# Expor porta
EXPOSE 8080

# Executar aplicação
# Usa variável de ambiente SPRING_PROFILES_ACTIVE ou padrão 'production'
ENTRYPOINT ["sh", "-c", "java -jar app.jar --spring.profiles.active=${SPRING_PROFILES_ACTIVE:-production}"]

