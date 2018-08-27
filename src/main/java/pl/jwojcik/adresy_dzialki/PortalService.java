package pl.jwojcik.adresy_dzialki;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PortalService {

    public Map<String, Province> findAllProvinces() {
        RestTemplate restTemplate = new RestTemplate();
        Object provinceJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/woj.json", Object.class);
        List listOfProvinces = (List) ((Map) provinceJson).get("jednAdms");
        Map<String, Province> resultMap = new HashMap<>();
        for (Object o : listOfProvinces) {
            Map outerMap = (Map) o;
            Map innerMap = (Map) outerMap.get("jednAdm");
            Province province = new Province();
            province.setWojNazwa((String) innerMap.get("wojNazwa"));
            province.setWojIdTeryt((String) innerMap.get("wojIdTeryt"));
            province.setWojIIPId((String) innerMap.get("wojIIPId"));
            resultMap.put(province.getWojIdTeryt(), province);
        }
        return resultMap;
    }

    public Map<String, County> findAllCounties(String teryt) {
        RestTemplate restTemplate = new RestTemplate();
        String countyId = findAllProvinces().get(teryt).getWojIIPId();
        Object countyJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/pow/PL.PZGIK.200/" + countyId + "/skr.json", Object.class);
        List listOfCounties = (List) ((Map) countyJson).get("jednAdms");
        Map<String, County> resultMap = new HashMap<>();
        for (Object o : listOfCounties) {
            Map outerMap = (Map) o;
            Map innerMap = (Map) outerMap.get("jednAdm");
            County county = new County();
            county.setPowNazwa((String) innerMap.get("powNazwa"));
            county.setPowIdTeryt((String) innerMap.get("powIdTeryt"));
            county.setPowIIPId((String) innerMap.get("powIIPId"));
            resultMap.put(county.getPowIdTeryt(), county);
        }
        return resultMap;
    }

    public Map<String, Commune> findAllCommunes(String teryt) {
        RestTemplate restTemplate = new RestTemplate();
        String communeId = findAllCounties(teryt.substring(0, 2)).get(teryt).getPowIIPId();
        Object communeJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/gmi/PL.PZGIK.200/" + communeId + "/skr.json", Object.class);
        List listOfCommunes = (List) ((Map) communeJson).get("jednAdms");
        Map<String, Commune> resultMap = new HashMap<>();
        for (Object o : listOfCommunes) {
            Map outerMap = (Map) o;
            Map innerMap = (Map) outerMap.get("jednAdm");
            Commune commune = new Commune();
            commune.setGmNazwa((String) innerMap.get("gmNazwa"));
            commune.setGmIdTeryt((String) innerMap.get("gmIdTeryt"));
            commune.setGmIIPId((String) innerMap.get("gmIIPId"));
            resultMap.put(commune.getGmIdTeryt(), commune);
        }
        return resultMap;
    }

    public Map<String, Town> findAllTowns(String teryt) {
        RestTemplate restTemplate = new RestTemplate();
        String townId = findAllCommunes(teryt.substring(0, 4)).get(teryt).getGmIIPId();
        Object townJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/miejsc/PL.PZGIK.200/" + townId + "/skr.json", Object.class);
        List listOfTowns = (List) ((Map) townJson).get("miejscowosci");
        Map<String, Town> resultMap = new HashMap<>();
        for (Object o : listOfTowns) {
            Map outerMap = (Map) o;
            Map innerMap = (Map) outerMap.get("miejscowosc");
            Town town = new Town();
            town.setMiejscNazwa((String) innerMap.get("miejscNazwa"));
            town.setMiejscRodzaj((String) innerMap.get("miejscRodzaj"));
            town.setMiejscIdTeryt((String) innerMap.get("miejscIdTeryt"));
            town.setMiejscIIPId((String) innerMap.get("miejscIIPId"));
            resultMap.put(town.getMiejscIdTeryt(), town);
        }
        return resultMap;
    }
}
