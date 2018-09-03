package pl.jwojcik.adresy_dzialki.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import pl.jwojcik.adresy_dzialki.model.*;
import pl.jwojcik.adresy_dzialki.utils.ComplexNumber;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import static java.lang.Math.*;

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
            transform92ToWSG84(address);
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
            transform92ToWSG84(addressStreet);
            resultMap.put(addressStreet.getPktNumer(), addressStreet);
        }
        return resultMap;
    }

    private void transform92ToWSG84(Address address) {
        double xPuwg = address.getPktX();
        double yPuwg = address.getPktY();

        double L0deg = 19.0;
        double m0 = 0.9993;
        double x0 = -5300000.0;
        double y0 = 500000.0;
        double R0 = 6367449.14577;
        double sNorm = 2.0e-6;
        double xoPrim = 5765181.11148097;
        double b0 = 5760000;
        double b1 = 500199.26224125;
        double b2 = 63.88777449;
        double b3 = -0.82039170;
        double b4 = -0.13125817;
        double b5 = 0.00101782;
        double b6 = 0.00010778;
        double c2 = 0.0033565514856;
        double c4 = 0.0000065718731;
        double c6 = 0.0000000176466;
        double c8 = 0.0000000000540;

        double xGK = (xPuwg - x0) / m0;
        double yGK = (yPuwg - y0) / m0;
        ComplexNumber z = new ComplexNumber((xGK - xoPrim) * sNorm, yGK * sNorm);
        ComplexNumber zMerc = z.multiplyReal(b6)
                .addReal(b5)
                .multiply(z)
                .addReal(b4)
                .multiply(z)
                .addReal(b3)
                .multiply(z)
                .addReal(b2)
                .multiply(z)
                .addReal(b1)
                .multiply(z)
                .addReal(b0);
        double xMerc = zMerc.getReal();
        double yMerc = zMerc.getImaginary();
        double alfa = xMerc / R0;
        double beta = yMerc / R0;
        double w = 2.0 * atan(exp(beta)) - PI / 2.0;
        double fi = asin(cos(w) * sin(alfa));
        double dLambda = atan(tan(w) / cos(alfa));
        double B = fi + c2 * sin(2.0 * fi) + c4 * sin(4.0 * fi) + c6 * sin(6.0 * fi) + c8 * sin(8.0 * fi);
        double dLdeg = dLambda / PI * 180.0;

        address.setPktN(B / PI * 180.0);
        address.setPktE(dLdeg + L0deg);
    }
}
