package pl.jwojcik.adresy_dzialki.model;

import lombok.Data;

@Data
public class Address {
    private String pktNumer;
    private String pktStatus;
    private String pktKodPocztowy;
    private Double pktX;
    private Double pktY;
    private Double pktN;
    private Double pktE;
    private String pktPrgIIPId;
}
