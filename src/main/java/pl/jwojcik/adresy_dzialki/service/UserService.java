package pl.jwojcik.adresy_dzialki.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.jwojcik.adresy_dzialki.model.AddressMetadata;
import pl.jwojcik.adresy_dzialki.model.User;
import pl.jwojcik.adresy_dzialki.repository.UserRepository;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

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

    public void addAddressToUser(AddressMetadata addressMetadata, String name) {
        userRepository.findByName(name).ifPresent(user -> {
            user.getAddresses().add(addressMetadata);
            userRepository.save(user);
        });
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean validateLogin(String name, String password) {
        Optional<User> optionalUser = userRepository.findByName(name);
        return optionalUser.map(user -> user.getPassword().equals(password)).orElse(false);
    }

    public Set<AddressMetadata> getAddresses(String name) {
        Optional<User> optionalUser = userRepository.findByName(name);
        return optionalUser.map(User::getAddresses).orElse(new HashSet<>());
    }
}
