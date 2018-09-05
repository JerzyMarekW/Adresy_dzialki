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
var addressData = {};
var addressDataList;


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
        addressData.province = provinceValue;
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
        addressData.county = countyValue;
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
        addressData.commune = communeValue;
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
        addressData.town = townValue;
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
        addressData.street = streetValue;
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

// dodaje szukany adres do bazy danych
function addAddress() {
    addressData.address = globalNameAddress;
    addressData.townName = globalNameTown;
    addressData.streetName = globalNameStreet;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(addressData),
        url: "/user/" + globalUserName, success: function (result) {
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
                    $.ajax({
                        url: "/user/" + globalUserName, success: function (result) {
                            addressDataList = result;
                            var searchedListHTML = "Witaj " + globalUserName + ", twoje adresy: <form> <select id='selectAddressList'>";
                            var i;
                            var listOption;
                            for (i = 0; i < addressDataList.length; i++) {
                                listOption = addressDataList[i].townName + ", " + addressDataList[i].streetName + " " + addressDataList[i].address;
                                searchedListHTML += "<option value='" + i + "'>" + listOption + "</option>";
                            }
                            searchedListHTML += "</select></form>";
                            document.getElementById("searchedList").innerHTML = searchedListHTML;
                        }
                    });
                    document.getElementById("loginForm").innerHTML = "";
                    document.getElementById("registerUser").innerHTML = "";
                    document.getElementById("isLogged").innerHTML = "<button id=\"wyloguj\">Wyloguj się</button>";

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
        document.getElementById("loginForm").innerHTML = "Login:<input id=\"typedName\" type=\"text\" name=\"login\">\n" +
            "Hasło:<input id=\"typedPassword\" type=\"password\" name=\"hasło\">";
        document.getElementById("registerUser").innerHTML = "<button id=\"zarejestruj\">Zarejestruj się</button>";
        document.getElementById("isLogged").innerHTML = "<button id=\"zaloguj\">Zaloguj się</button>";
        document.getElementById("searchedList").innerHTML = "";
    })
});

// formularz rejestracji uzytkownika
$(document).ready(function () {
    $('body').on('click', '#zarejestruj', function () {
        document.getElementById("loginForm").innerHTML = "";
        document.getElementById("registerUser").innerHTML = "Email:<form><input id=\"registerEmail\" type=\"text\" name=\"email\">" +
            "Login:<form><input id=\"registerName\" type=\"text\" name=\"login\">" +
            "Hasło:<input id=\"registerPassword\" type=\"text\" name=\"password\">" +
            "</form> <button id='registerUserData'>Rejestracja</button>" +
            "<button id='anuluj'>Anuluj</button>";
        document.getElementById("isLogged").innerHTML = "";
    })

});

// rejestracja uzytkownika
$(document).ready(function () {
    $('body').on('click', '#registerUserData', function () {
        var givenRegisterData = {};
        givenRegisterData.email = document.getElementById("registerEmail").value;
        givenRegisterData.name = document.getElementById("registerName").value;
        givenRegisterData.password = document.getElementById("registerPassword").value;
        $.ajax({
            data: JSON.stringify(givenRegisterData),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/user", success: function (result) {
                if (result) {
                    document.getElementById("loginForm").innerHTML = "";
                    document.getElementById("registerUser").innerHTML = "";
                    document.getElementById("isLogged").innerHTML = "<button id=\"wyloguj\">Wyloguj się</button>";
                    var searchedListHTML = "Witaj " + globalUserName + ", twoje adresy: <form> <select id='selectAddressList'>";
                    var i;
                    var listOption;
                    for (i = 0; i < addressDataList.length; i++) {
                        listOption = addressDataList[i].townName + ", " + addressDataList[i].streetName + " " + addressDataList[i].address;
                        searchedListHTML += "<option value='" + i + "'>" + listOption + "</option>";
                    }
                    searchedListHTML += "</select></form>";
                    document.getElementById("searchedList").innerHTML = searchedListHTML;
                } else {
                    alert('Użytkownik o takim loginie już istnieje');
                }
            }
        })
    })
});

// anulowanie rejestracji
$(document).ready(function () {
    $('body').on('click', '#anuluj', function () {
        document.getElementById("loginForm").innerHTML = "Login:<input id=\"typedName\" type=\"text\" name=\"login\">\n" +
            "Hasło:<input id=\"typedPassword\" type=\"password\" name=\"hasło\">";
        document.getElementById("registerUser").innerHTML = "<button id=\"zarejestruj\" onclick=\"registerPopup()\">Zarejestruj się</button>";
        document.getElementById("isLogged").innerHTML = "<button id=\"zaloguj\">Zaloguj się</button>";
        document.getElementById("searchedList").innerHTML = "";
    })
});

// zmiana pozycji na liscie adresow
$(document).ready(function () {
    $('body').on('change', '#searchedList', function () {
        var selectList = document.getElementById("selectAddressList");
        var selectedIndex = selectList.options[selectList.selectedIndex].value;

        document.getElementById("province").value = addressDataList[selectedIndex].province;
        $.ajax({
            url: "/county/" + addressDataList[selectedIndex].province, success: function (result) {
                var countySelect = document.getElementById("county");
                var i;
                var valueHTML = "";
                for (i = 0; i < result.length; i++) {
                    valueHTML += "<option value='" + result[i].powIdTeryt + "'>" + result[i].powNazwa + "</option>";
                }
                countySelect.innerHTML = valueHTML;
                document.getElementById("county").value = addressDataList[selectedIndex].county;
            }
        });

        $.ajax({
            url: "/commune/" + addressDataList[selectedIndex].county, success: function (result) {
                var communeSelect = document.getElementById("commune");
                var i;
                var valueHTML = "";
                for (i = 0; i < result.length; i++) {
                    valueHTML += "<option value='" + result[i].gmIdTeryt + "'>" + result[i].gmNazwa + "</option>";
                }
                communeSelect.innerHTML = valueHTML;
                document.getElementById("commune").value = addressDataList[selectedIndex].commune;
            }
        });

        $.ajax({
            url: "/town/" + addressDataList[selectedIndex].commune, success: function (result) {
                var townSelect = document.getElementById("town");
                var i;
                var valueHTML = "";
                for (i = 0; i < result.length; i++) {
                    valueHTML += "<option value='" + result[i].miejscIdTeryt + "'>" + result[i].miejscNazwa + "</option>";
                }
                townSelect.innerHTML = valueHTML;
                document.getElementById("town").value = addressDataList[selectedIndex].town;
            }
        });

        $.ajax({
            url: "/street/" + addressDataList[selectedIndex].commune + "/" + addressDataList[selectedIndex].town,
            success: function (result) {
                var streetSelect = document.getElementById("street");
                var i;
                var valueHTML = "<option value='brak'>----</option>";
                for (i = 0; i < result.length; i++) {
                    valueHTML += "<option value='" + result[i].ulIdTeryt + "'>" + result[i].ulNazwaGlowna + "</option>";
                }
                streetSelect.innerHTML = valueHTML;
                document.getElementById("street").value = addressDataList[selectedIndex].street;
            }
        });

        var streetURL;
        if (addressDataList[selectedIndex].street === "brak") {
            streetURL = "/address/" + addressDataList[selectedIndex].commune + "/" + addressDataList[selectedIndex].town;
        } else {
            streetURL = "/address2/" + addressDataList[selectedIndex].commune + "/" + addressDataList[selectedIndex].town + "/" + addressDataList[selectedIndex].street;
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
                document.getElementById("address").value = addressDataList[selectedIndex].address;
                globalNameAddress = addressDataList[selectedIndex].address;
                if (addressDataList[selectedIndex].address !== "brak") {
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
            }
        });


    })
});
