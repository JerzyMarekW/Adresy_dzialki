package pl.jwojcik.adresy_dzialki;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PortalController {

    private static final Logger log = LoggerFactory.getLogger(PortalController.class);

    private final PortalService portalService;

    @GetMapping("/province")
    public Province[] getProvinces() {
        return portalService.findAllProvinces().values().toArray(new Province[0]);
    }

    @GetMapping("/county/{provinceTeryt}")
    public County[] getCounties(@PathVariable String provinceTeryt) {
        return portalService.findAllCounties(provinceTeryt).values().toArray(new County[0]);
    }

    @GetMapping("/commune/{countyTeryt}")
    public Commune[] getCommunes(@PathVariable String countyTeryt) {
        return portalService.findAllCommunes(countyTeryt).values().toArray(new Commune[0]);
    }

    @GetMapping("/town/{communeTeryt}")
    public Town[] getTowns(@PathVariable String communeTeryt) {
        return portalService.findAllTowns(communeTeryt).values().toArray(new Town[0]);
    }

    @GetMapping("/street/{communeTeryt}/{townTeryt}")
    public Street[] getStreets(@PathVariable String communeTeryt, @PathVariable String townTeryt) {
        return portalService.findAllStreets(communeTeryt, townTeryt).values().toArray(new Street[0]);
    }

    @GetMapping("/address/{communeTeryt}/{townTeryt}")
    public Address[] getAddresses(@PathVariable String communeTeryt, @PathVariable String townTeryt) {
        return portalService.findAllAddresses(communeTeryt, townTeryt).values().toArray(new Address[0]);
    }

    @GetMapping("/address2/{communeTeryt}/{townTeryt}/{streetTeryt}")
    public Address[] getAddressesFromStreet(@PathVariable String communeTeryt, @PathVariable String townTeryt, @PathVariable String streetTeryt) {
        return portalService.findAllAddressesFromStreet(communeTeryt, townTeryt, streetTeryt).values().toArray(new Address[0]);
    }
}
