package pl.jwojcik.adresy_dzialki;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class PortalController {

    private static final Logger log = LoggerFactory.getLogger(PortalController.class);

    @GetMapping("/province/{teryt}")
    public List<Province> findAllProvinces() {
        RestTemplate restTemplate = new RestTemplate();
        Object provinceJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/woj.json", Object.class);
        List listOfProvinces = (List) ((Map) provinceJson).get("jednAdms");
        List<Province> resultList = new ArrayList<>();
        for (Object o : listOfProvinces) {
            Map outerMap = (Map) o;
            Map innerMap = (Map) outerMap.get("jednAdm");
            Province province = new Province();
            province.setWojNazwa((String) innerMap.get("wojNazwa"));
            province.setWojIdTeryt((String) innerMap.get("wojIdTeryt"));
            province.setWojIIPId((String) innerMap.get("wojIIPId"));
            resultList.add(province);
        }
        return resultList;
    }

    @GetMapping("/county/{teryt}")
    public List<County> findAllCounties(@PathVariable String teryt) {
        RestTemplate restTemplate = new RestTemplate();
        Object countyJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/pow/PL.PZGIK.200/" + teryt + "/skr.json", Object.class);
        List listOfCounties = (List) ((Map) countyJson).get("jednAdms");
        List<County> resultList = new ArrayList<>();
        for (Object o : listOfCounties) {
            Map outerMap = (Map) o;
            Map innerMap = (Map) outerMap.get("jednAdm");
            County county = new County();
            county.setPowNazwa((String) innerMap.get("powNazwa"));
            county.setPowIdTeryt((String) innerMap.get("powIdTeryt"));
            county.setPowIIPId((String) innerMap.get("powIIPId"));
            resultList.add(county);
        }
        return resultList;
    }

    @GetMapping("/commune/{teryt}")
    public List<Commune> findAllCommunes(@PathVariable String teryt) {
        RestTemplate restTemplate = new RestTemplate();
        Object communeJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/gmi/PL.PZGIK.200/" + teryt + "/skr.json", Object.class);
        List listOfCommunes = (List) ((Map) communeJson).get("jednAdms");
        List<Commune> resultList = new ArrayList<>();
        for (Object o : listOfCommunes) {
            Map outerMap = (Map) o;
            Map innerMap = (Map) outerMap.get("jednAdm");
            Commune commune = new Commune();
            commune.setGmNazwa((String) innerMap.get("gmNazwa"));
            commune.setGmIdTeryt((String) innerMap.get("gmIdTeryt"));
            commune.setGmIIPId((String) innerMap.get("gmIIPId"));
            resultList.add(commune);
        }
        return resultList;
    }

}
