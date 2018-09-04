package pl.jwojcik.adresy_dzialki.controller;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import pl.jwojcik.adresy_dzialki.model.AddressMetadata;
import pl.jwojcik.adresy_dzialki.model.User;
import pl.jwojcik.adresy_dzialki.service.UserService;

import java.util.Set;

@RestController
@RequiredArgsConstructor
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(PortalController.class);

    private final UserService userService;

    @PostMapping("/user")
    public String createUser(@RequestBody User user) {
        if (userService.createUser(user)) {
            return "Użytkownik o takim adresie email już istnieje";
        } else {
            return "Utworzono użytkownika";
        }
    }

    @GetMapping("/login")
    public Boolean validateLogin(@RequestParam String name, @RequestParam String password) {
        return userService.validateLogin(name, password);
    }

//    @PostMapping(value = "/user/{name}", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @PostMapping("/user/{name}")
    public void addAddress(@RequestBody AddressMetadata addressMetadata, @PathVariable String name) {
        userService.addAddressToUser(addressMetadata, name);
    }

    @GetMapping("/user/{name}")
    public Set<AddressMetadata> getAddresses(@PathVariable String name) {
        return userService.getAddresses(name);
    }
}
