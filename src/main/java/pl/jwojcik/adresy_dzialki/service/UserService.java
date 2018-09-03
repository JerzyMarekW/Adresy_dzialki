package pl.jwojcik.adresy_dzialki.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.jwojcik.adresy_dzialki.model.AddressMetadata;
import pl.jwojcik.adresy_dzialki.model.User;
import pl.jwojcik.adresy_dzialki.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public boolean createUser(User user) {
        if (findByEmail(user.getEmail()).isPresent()) {
            return false;
        } else {
            userRepository.save(user);
            return true;
        }
    }

    public void addAddressToUser(AddressMetadata addressMetadata, Integer id) {
        findById(id).ifPresent(user -> {});
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
