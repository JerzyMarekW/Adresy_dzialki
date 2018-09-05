package pl.jwojcik.adresy_dzialki.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.jwojcik.adresy_dzialki.model.AddressMetadata;
import pl.jwojcik.adresy_dzialki.model.User;
import pl.jwojcik.adresy_dzialki.service.UserService;

import java.util.Set;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/user")
    public Boolean createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/login")
    public Boolean validateLogin(@RequestParam String name, @RequestParam String password) {
        return userService.validateLogin(name, password);
    }

    @PostMapping("/user/{name}")
    public void addAddress(@RequestBody AddressMetadata addressMetadata, @PathVariable String name) {
        userService.addAddressToUser(addressMetadata, name);
    }

    @GetMapping("/user/{name}")
    public Set<AddressMetadata> getAddresses(@PathVariable String name) {
        return userService.getAddresses(name);
    }
}
