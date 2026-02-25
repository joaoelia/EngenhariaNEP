package com.aerogestor.config;

import com.aerogestor.model.Role;
import com.aerogestor.model.User;
import com.aerogestor.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, 
                                    PasswordEncoder passwordEncoder,
                                    Environment env) {
        return args -> {
            // Buscar credenciais admin das variáveis de ambiente (obrigatórias)
            String adminEmail = env.getProperty("APP_ADMIN_EMAIL");
            String adminPassword = env.getProperty("APP_ADMIN_PASSWORD");
            
            if (adminEmail == null || adminPassword == null) {
                log.error("✗ ERRO: Variáveis APP_ADMIN_EMAIL e APP_ADMIN_PASSWORD devem ser definidas!");
                return;
            }
            
            // Verificar se o usuário admin já existe
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);
                
                userRepository.save(admin);
                log.info("✓ Usuário administrador criado com sucesso");
                log.info("  Email: {}", adminEmail);
            } else {
                log.info("✓ Usuário administrador já existe no banco de dados");
            }
        };
    }
}
