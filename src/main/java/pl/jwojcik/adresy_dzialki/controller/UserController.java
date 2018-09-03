package pl.jwojcik.adresy_dzialki.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.jwojcik.adresy_dzialki.model.AddressMetadata;
import pl.jwojcik.adresy_dzialki.model.User;
import pl.jwojcik.adresy_dzialki.service.UserService;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/user")
    public String createUser(@RequestBody User user) {
        if (userService.createUser(user)) {
            return "Użytkownik o takim adresie email już istnieje";
        } else {
            return "Utworzono użytkownika";
        }
    }

    @GetMapping("/user/{id}")
    public User findById(@PathVariable Integer id) {
        return userService.findById(id).orElseGet(User::new);
    }

    @PostMapping("/user/{id}")
    public void addAddress(@RequestBody AddressMetadata addressMetadata, @PathVariable Integer id) {
        userService.addAddressToUser(addressMetadata, id);
    }
}
