package pl.jwojcik.adresy_dzialki.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.Set;

@Data
@Entity
public class User {
    @Id
    @GeneratedValue
    private Integer id;
    private String name;
    private String email;
    private String password;

    @OneToMany(mappedBy = "user")
    private Set<AddressMetadata> addresses;
}
