package pl.jwojcik.adresy_dzialki;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class MVCController {

    private final PortalService portalService;

    @GetMapping("/search")
    public String search(Model model) {

        Map<String, Province> provinces = portalService.findAllProvinces();
        model.addAttribute("provinces", provinces);

        Map<String, County> counties = portalService.findAllCounties("06");
        model.addAttribute("counties", counties);

        Map<String, Commune> communes = portalService.findAllCommunes("0609");
        model.addAttribute("communes", communes);

        Map<String, Town> towns = portalService.findAllTowns("0609082");
        model.addAttribute("towns", towns);

//        Map<String, Address> addresses = portalService.findAllAddresses("");

        return "search";
    }

    @PostMapping("/result")
    public String result(Model model) {

        return "result";
    }
}
