// zmienne globalne
var globalNameProvince;
var globalNameCounty;
var globalNameCommune;
var globalNameTown;
var globalNameStreet;
var globalTable;
var globalNameAddress;
var globalX;
var globalY;
var globalNorth;
var globalEast;
var globalPostalCode;
var globalUserName;
var globalAddressList = {};


// odswieza liste wojewodztw przy wejsciu na strone
$(document).ready(function () {
    $.ajax({
        url: "/province", success: function (result) {
            var provinceSelect = document.getElementById("province");
            var i;
            var valueHTML = "";
            for (i = 0; i < result.length; i++) {
                valueHTML += "<option value='" + result[i].wojIdTeryt + "'>" + result[i].wojNazwa + "</option>";
            }
            provinceSelect.innerHTML = valueHTML;
            $("#province").trigger("change");
        }
    });
});

// odswieza liste powiatow przy zmianie wojewodztwa
$(document).ready(function () {
    $('#province').change(function () {
        var provinceSelect = document.getElementById("province");
        var provinceOptions = provinceSelect.options;
        var provinceValue = provinceOptions[provinceOptions.selectedIndex].value;
        globalAddressList.province = provinceValue;
        globalNameProvince = provinceOptions[provinceOptions.selectedIndex].innerHTML;
        $.ajax({
            url: "/county/" + provinceValue, success: function (result) {
                var countySelect = document.getElementById("county");
                var i;
                var valueHTML = "";
                for (i = 0; i < result.length; i++) {
                    valueHTML += "<option value='" + result[i].powIdTeryt + "'>" + result[i].powNazwa + "</option>";
                }
                countySelect.innerHTML = valueHTML;
                $("#county").trigger("change");
            }
        });
    })
});

// odswieza liste gmin przy zmianie powiatu
$(document).ready(function () {
    $('#county').change(function () {
        var countySelect = document.getElementById("county");
        var countyOptions = countySelect.options;
        var countyValue = countyOptions[countyOptions.selectedIndex].value;
        globalAddressList.county = countyValue;
        globalNameCounty = countyOptions[countyOptions.selectedIndex].innerHTML;
        $.ajax({
            url: "/commune/" + countyValue, success: function (result) {
                var communeSelect = document.getElementById("commune");
                var i;
                var valueHTML = "";
                for (i = 0; i < result.length; i++) {
                    valueHTML += "<option value='" + result[i].gmIdTeryt + "'>" + result[i].gmNazwa + "</option>";
                }
                communeSelect.innerHTML = valueHTML;
                $("#commune").trigger("change");
            }
        });
    })
});

// odswieza liste miejscowosci przy zmianie gminy
$(document).ready(function () {
    $('#commune').change(function () {
        var communeSelect = document.getElementById("commune");
        var communeOptions = communeSelect.options;
        var communeValue = communeOptions[communeOptions.selectedIndex].value;
        globalAddressList.commune = communeValue;
        globalNameCommune = communeOptions[communeOptions.selectedIndex].innerHTML;
        $.ajax({
            url: "/town/" + communeValue, success: function (result) {
                var townSelect = document.getElementById("town");
                var i;
                var valueHTML = "";
                for (i = 0; i < result.length; i++) {
                    valueHTML += "<option value='" + result[i].miejscIdTeryt + "'>" + result[i].miejscNazwa + "</option>";
                }
                townSelect.innerHTML = valueHTML;
                $("#town").trigger("change");
            }
        });
    })
});

// odswieza liste ulic przy zmianie miejscowosci
$(document).ready(function () {
    $('#town').change(function () {
        var communeSelect = document.getElementById("commune");
        var communeOptions = communeSelect.options;
        var communeValue = communeOptions[communeOptions.selectedIndex].value;
        var townSelect = document.getElementById("town");
        var townOptions = townSelect.options;
        var townValue = townOptions[townOptions.selectedIndex].value;
        globalAddressList.town = townValue;
        globalNameTown = townOptions[townOptions.selectedIndex].innerHTML;
        $.ajax({
            url: "/street/" + communeValue + "/" + townValue, success: function (result) {
                var streetSelect = document.getElementById("street");
                var i;
                var valueHTML = "<option value='brak'>----</option>";
                for (i = 0; i < result.length; i++) {
                    valueHTML += "<option value='" + result[i].ulIdTeryt + "'>" + result[i].ulNazwaGlowna + "</option>";
                }
                streetSelect.innerHTML = valueHTML;
                $("#street").trigger("change");
            }
        });
    })
});

// odsiweza liste adresow przy zmianie ulicy
$(document).ready(function () {
    $('#street').change(function () {
        var communeSelect = document.getElementById("commune");
        var communeOptions = communeSelect.options;
        var communeValue = communeOptions[communeOptions.selectedIndex].value;
        var townSelect = document.getElementById("town");
        var townOptions = townSelect.options;
        var townValue = townOptions[townOptions.selectedIndex].value;
        var streetSelect = document.getElementById("street");
        var streetOptions = streetSelect.options;
        var streetValue = streetOptions[streetOptions.selectedIndex].value;
        globalAddressList.street = streetValue;
        globalNameStreet = streetOptions[streetOptions.selectedIndex].innerHTML;
        var streetURL;
        if (streetValue === "brak") {
            streetURL = "/address/" + communeValue + "/" + townValue;
        } else {
            streetURL = "/address2/" + communeValue + "/" + townValue + "/" + streetValue;
        }
        $.ajax({
            url: streetURL, success: function (result) {
                var addressSelect = document.getElementById("address");
                var i;
                var valueHTML = "";
                for (i = 0; i < result.length; i++) {
                    valueHTML += "<option value='" + result[i].pktNumer + "'>" + result[i].pktNumer + "</option>";
                }
                if (result.length === 0) {
                    valueHTML += "<option value='brak'>brak adresów</option>"
                }
                addressSelect.innerHTML = valueHTML;
                globalTable = result;
                $("#address").trigger("change");
            }
        });
    })
});

// umieszcza w zamiennych dane wybranego adresu
$(document).ready(function () {
    $('#address').change(function () {
        var addressSelect = document.getElementById("address");
        var addressOptions = addressSelect.options;
        globalNameAddress = addressOptions[addressOptions.selectedIndex].value;
        if (globalNameAddress !== "brak") {
            var i;
            for (i = 0; i < globalTable.length; i++) {
                if (globalTable[i].pktNumer === globalNameAddress) {
                    globalPostalCode = globalTable[i].pktKodPocztowy;
                    globalX = globalTable[i].pktX;
                    globalY = globalTable[i].pktY;
                    globalNorth = globalTable[i].pktN;
                    globalEast = globalTable[i].pktE;
                    break;
                }
            }
        }
    })
});

// inicjalizuje API geoportalu
function initMap() {
    ILITEAPI.init({
        "divId": "iapi",
        "width": 600,
        "height": 400,
        "activeGpMapId": "gp4",
        "activeGpMaps": ["gp4"],
        "activeGpActions": ["pan", "fullExtent"]
    });
}

function processAddressRequest() {
    if (globalNameAddress !== "brak") {
        addAddress();
        info();
        markAddress();
    } else {
        alert('Nie wybrano adresu');
    }
}

function addAddress() {
    globalAddressList.address = globalNameAddress;
    globalAddressList.townName = globalNameTown;
    globalAddressList.streetName = globalNameStreet;
    alert(JSON.stringify(globalAddressList));
    $.ajax({
        type: "POST",
        data: JSON.stringify(globalAddressList),
        url: "/user/" + globalUserName, success: function (result) {
            alert(result);
        }
    });
}

// wyswietla mape adresu wraz z markerem
function markAddress() {
    var streetName = globalNameStreet;
    if (streetName === "---") {
        streetName = "";
    }
    var markerDesc = {
        id: undefined,
        title: globalNameTown,
        content: streetName + " " + globalNameAddress,
        show: true,
        deleteTime: undefined
    };
    // jakis kretyn nie wiedzial ze w geodezji wspolrzedne sa zamienione
    // trzeba zmienic w wywolaniu funkcji 'x' z 'y'
    ILITEAPI.showMarker(globalY, globalX, undefined, markerDesc);
}

// wyswietla google street view dla wybranego adresu
function loadStreetView() {
    if (globalNameAddress !== "brak") {
        var streetViewURL = "http://maps.google.com/maps?q=&layer=c&cbll=";
        streetViewURL += globalNorth + "," + globalEast;
        var win = window.open(streetViewURL, '_blank');
        win.focus();
    } else {
        alert('Nie wybrano adresu');
    }
}

// wyswietla informacje o adresie
function info() {
    var valueHTML = "";
    var addressInfo = document.getElementById("infoAddress");
    valueHTML += "Województwo: " + globalNameProvince + " <br>";
    valueHTML += "Powiat: " + globalNameCounty + " <br>";
    valueHTML += "Gmina: " + globalNameCommune + " <br>";
    valueHTML += "Miejscowość: " + globalNameTown + " <br>";
    valueHTML += "Ulica: " + globalNameStreet + " <br>";
    valueHTML += "Adres: " + globalNameAddress + " <br>";
    valueHTML += "Kod pocztowy: " + globalPostalCode + " <br>";
    valueHTML += "Współrzędne (układ 92): <br>";
    valueHTML += "X: " + globalX.toFixed(2) + " <br>";
    valueHTML += "Y: " + globalY.toFixed(2) + " <br>";
    valueHTML += "N:" + globalNorth.toFixed(6) + "<br>";
    valueHTML += "E:" + globalEast.toFixed(6) + "<br>";
    addressInfo.innerHTML = valueHTML;
}

function registerPopup() {
    var popup = document.getElementById("registerForm");
    var popupCont = document.getElementById("registerContainer");
    // popupCont.style.visibility = ""
}

// zalogowanie uzytkownika
$(document).ready(function () {
    $('body').on('click', '#zaloguj', function () {
        var givenName = document.getElementById("typedName").value;
        var givenPassword = document.getElementById("typedPassword").value;
        $.ajax({
            data: {name: givenName, password: givenPassword},
            url: "/login", success: function (result) {
                if (result) {
                    globalUserName = givenName;
                    // $.ajax({
                    //     url: "/user/" + globalUserName, success: function (result) {
                    //
                    //         alert(JSON.stringify(result))
                    //     }
                    // });
                    document.getElementById("loginForm").innerHTML = "";
                    document.getElementById("registerUser").innerHTML = "";
                    document.getElementById("isLogged").innerHTML = "<button id=\"wyloguj\">Wyloguj się</button>";
                    var searchedListHTML = "Witaj " + globalUserName + ", twoje adresy: <form> <select>";
                    var i;
                    for (i = 0; i < 2; i++) {
                        searchedListHTML += "<option value='" + i + "'>" + i + "</option>";
                    }
                    searchedListHTML += "</select></form>";
                    document.getElementById("searchedList").innerHTML = searchedListHTML;
                } else {
                    alert("Nieprawidłowy login lub hasło");
                }
            }
        });
    })
});

// wylogowanie uzytkownika
$(document).ready(function () {
    $('body').on('click', '#wyloguj', function () {
        document.getElementById("registerUser").innerHTML = "<button id=\"zarejestruj\" onclick=\"registerPopup()\">Zarejestruj się</button>";
        document.getElementById("isLogged").innerHTML = "<button id=\"zaloguj\">Zaloguj się</button>";
        document.getElementById("loginForm").innerHTML = "Login:\n" +
            "            <input id=\"typedName\" type=\"text\" name=\"login\">\n" +
            "            Hasło:\n" +
            "            <input id=\"typedPassword\" type=\"text\" name=\"hasło\">";
        document.getElementById("searchedList").innerHTML = "";
    })
});

$(document).ready(function () {
    $('body').on('click', '#zarejestruj', function () {
        alert('test zarejestruj')
    })
});