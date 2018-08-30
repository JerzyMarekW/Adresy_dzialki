package pl.jwojcik.adresy_dzialki;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class PortalService {

    public Map<String, Province> findAllProvinces() {
        RestTemplate restTemplate = new RestTemplate();
        Object provinceJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/woj.json", Object.class);
        List listOfProvinces = (List) ((Map) provinceJson).get("jednAdms");
        Map<String, Province> resultMap = new TreeMap<>();
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

    public Map<String, County> findAllCounties(String provinceTeryt) {
        RestTemplate restTemplate = new RestTemplate();
        String provinceId = findAllProvinces().get(provinceTeryt).getWojIIPId();
        Object countyJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/pow/PL.PZGIK.200/" + provinceId + "/skr.json", Object.class);
        List listOfCounties = (List) ((Map) countyJson).get("jednAdms");
        Map<String, County> resultMap = new TreeMap<>();
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

    public Map<String, Commune> findAllCommunes(String countyTeryt) {
        RestTemplate restTemplate = new RestTemplate();
        String countyId = findAllCounties(countyTeryt.substring(0, 2)).get(countyTeryt).getPowIIPId();
        Object communeJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/gmi/PL.PZGIK.200/" + countyId + "/skr.json", Object.class);
        List listOfCommunes = (List) ((Map) communeJson).get("jednAdms");
        Map<String, Commune> resultMap = new TreeMap<>();
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

    public Map<String, Town> findAllTowns(String communeTeryt) {
        RestTemplate restTemplate = new RestTemplate();
        String communeId = findAllCommunes(communeTeryt.substring(0, 4)).get(communeTeryt).getGmIIPId();
        Object townJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/miejsc/PL.PZGIK.200/" + communeId + "/skr.json", Object.class);
        List listOfTowns = (List) ((Map) townJson).get("miejscowosci");
        Map<String, Town> resultMap = new TreeMap<>();
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

    public Map<String, Street> findAllStreets(String communeTeryt, String townTeryt) {
        RestTemplate restTemplate = new RestTemplate();
        String townId = findAllTowns(communeTeryt).get(townTeryt).getMiejscIIPId();
        Object streetJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/ul/PL.PZGIK.200/" + townId + "/skr.json", Object.class);
        List listOfStreets = (List) ((Map) streetJson).get("ulice");
        Map<String, Street> resultMap = new TreeMap<>();
        for (Object o : listOfStreets) {
            Map outerMap = (Map) o;
            Map innerMap = (Map) outerMap.get("ulica");
            Street street = new Street();
            StringBuilder fullName = new StringBuilder();
            if (innerMap.get("ulNazwaPrzed1") != null) {
                fullName.append(innerMap.get("ulNazwaPrzed1")).append(" ");
            }
            if (innerMap.get("ulNazwaPrzed2") != null) {
                fullName.append(innerMap.get("ulNazwaPrzed2")).append(" ");
            }
            if (innerMap.get("ulNazwaCzesc") != null) {
                fullName.append(innerMap.get("ulNazwaCzesc")).append(" ");
            }
            fullName.append((String) innerMap.get("ulNazwaGlowna"));
            street.setUlNazwaGlowna(fullName.toString());
            street.setUlIdTeryt((String) innerMap.get("ulIdTeryt"));
            street.setUlIIPId((String) innerMap.get("ulIIPId"));
            if (street.getUlIdTeryt() != null) {
                resultMap.put(street.getUlIdTeryt(), street);
            }
        }
        return resultMap;
    }

    public Map<String, Address> findAllAddresses(String communeTeryt, String townTeryt) {
        RestTemplate restTemplate = new RestTemplate();
        String townId = findAllTowns(communeTeryt).get(townTeryt).getMiejscIIPId();
        Object addressJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/adr/miejsc/PL.PZGIK.200/" + townId + "/skr.json", Object.class);
        List listOfAddresses = (List) ((Map) addressJson).get("adresy");
        Map<String, Address> resultMap = new TreeMap<>();
        for (Object o : listOfAddresses) {
            Map outerMap = (Map) o;
            Map innerMap = (Map) outerMap.get("adres");
            Address address = new Address();
            address.setPktNumer((String) innerMap.get("pktNumer"));
            address.setPktStatus((String) innerMap.get("pktStatus"));
            address.setPktKodPocztowy((String) innerMap.get("pktKodPocztowy"));
            address.setPktX((Double) innerMap.get("pktX"));
            address.setPktY((Double) innerMap.get("pktY"));
            address.setPktPrgIIPId((String) innerMap.get("pktPrgIIPId"));
            resultMap.put(address.getPktNumer(), address);
        }
        return resultMap;
    }

    public Map<String, Address> findAllAddressesFromStreet(String communeTeryt, String townTeryt, String streetTeryt) {
        RestTemplate restTemplate = new RestTemplate();
        String streetId = findAllStreets(communeTeryt, townTeryt).get(streetTeryt).getUlIIPId();
        Object addressStreetJson = restTemplate.getForObject("http://mapy.geoportal.gov.pl/wss/service/SLN/guest/sln/adr/ul/PL.PZGIK.200/" + streetId + "/skr.json", Object.class);
        List listOfAddressesStreet = (List) ((Map) addressStreetJson).get("adresy");
        Map<String, Address> resultMap = new TreeMap<>();
        for (Object o : listOfAddressesStreet) {
            Map outerMap = (Map) o;
            Map innerMap = (Map) outerMap.get("adres");
            Address addressStreet;
            addressStreet = new Address();
            addressStreet.setPktNumer((String) innerMap.get("pktNumer"));
            addressStreet.setPktStatus((String) innerMap.get("pktStatus"));
            addressStreet.setPktKodPocztowy((String) innerMap.get("pktKodPocztowy"));
            addressStreet.setPktX((Double) innerMap.get("pktX"));
            addressStreet.setPktY((Double) innerMap.get("pktY"));
            addressStreet.setPktPrgIIPId((String) innerMap.get("pktPrgIIPId"));
            resultMap.put(addressStreet.getPktNumer(), addressStreet);
        }
        return resultMap;
    }
}
