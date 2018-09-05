package pl.jwojcik.adresy_dzialki.repository;

import org.springframework.data.repository.CrudRepository;
import pl.jwojcik.adresy_dzialki.model.User;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
}
