package pl.jwojcik.adresy_dzialki;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class PortalController {

    private static final Logger log = LoggerFactory.getLogger(PortalController.class);

    private final PortalService portalService;

    @GetMapping("/province")
    public Map<String, Province> getProvinces() {
        return portalService.findAllProvinces();
    }

    @GetMapping("/county/{teryt}")
    public Map<String, County> getCounties(@PathVariable String teryt) {
        return portalService.findAllCounties(teryt);
    }

    @GetMapping("/commune/{teryt}")
    public Map<String, Commune> getCommunes(@PathVariable String teryt) {
        return portalService.findAllCommunes(teryt);
    }

    @GetMapping("/town/{teryt}")
    public Map<String, Town> getTowns(@PathVariable String teryt) {
        return portalService.findAllTowns(teryt);
    }
}
