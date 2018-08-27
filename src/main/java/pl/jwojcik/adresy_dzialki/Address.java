package pl.jwojcik.adresy_dzialki;

import lombok.Data;

@Data
public class Address {
    private String pktNumer;
    private String pktStatus;
    private String pktKodPocztowy;
    private Double pktX;
    private Double pktY;
    private String pktPrgIIPId;
}
