package pl.jwojcik.adresy_dzialki.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Data
@Entity
public class AddressMetadata {
    @Id
    @GeneratedValue
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private Integer id;
    private String province;
    private String county;
    private String commune;
    private String town;
    private String street;
    private String address;
    private String townName;
    private String streetName;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    User user;
}
