package com.ia03.user_registration.repository;

import com.ia03.user_registration.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring Data JPA will automatically create this method for us
    // just based on its name.
    Optional<User> findByEmail(String email);
}
