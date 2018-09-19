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

$(document).ready(function () {
    setNotLoggedMenu();
    populateProvinceSelect(true);
});

$(document).ready(function () {
    $('#province').change(function () {
        populateCountySelect(true);
    })
});

$(document).ready(function () {
    $('#county').change(function () {
        populateCommuneSelect(true);
    })
});

$(document).ready(function () {
    $('#commune').change(function () {
        populateTownSelect(true);
    })
});

$(document).ready(function () {
    $('#town').change(function () {
        populateStreetSelect(true);
    })
});

$(document).ready(function () {
    $('#street').change(function () {
        populateAddressSelect();
    })
});

$(document).ready(function () {
    $('#address').change(function () {
        getAddressInfo();
    })
});

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
        addressInfo();
        markAddress();
    } else {
        alert('Nie wybrano adresu');
    }
}

function addAddress() {
    addressData.address = globalNameAddress;
    addressData.townName = globalNameTown;
    addressData.streetName = globalNameStreet;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(addressData),
        url: "/user/" + globalUserName,
        success: function (result) {
        }
    });
}

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

function addressInfo() {
    var valueHTML = "";
    valueHTML += "woj. " + globalNameProvince;
    valueHTML += ", pow. " + globalNameCounty;
    valueHTML += ", gm. " + globalNameCommune + " <br>";
    valueHTML += " " + globalNameTown;
    valueHTML += " " + globalNameStreet;
    valueHTML += " " + globalNameAddress + " <br>";
    valueHTML += "Kod pocztowy: " + globalPostalCode + " <br>";
    valueHTML += "Współrzędne: <br>";
    valueHTML += "X: " + globalX.toFixed(2);
    valueHTML += "--- N: " + transfromDecimalToMinutesSeconds(globalNorth) +"<br>";
    valueHTML += "Y: " + globalY.toFixed(2);
    valueHTML += "--- E: " + transfromDecimalToMinutesSeconds(globalEast) + "<br>";
    document.getElementById("infoAddress").innerHTML = valueHTML;
}

// zalogowanie uzytkownika
$(document).ready(function () {
    $('body').on('click', '#zaloguj', function () {
        var givenName = document.getElementById("typedName").value;
        var givenPassword = document.getElementById("typedPassword").value;
        $.ajax({
            data: {name: givenName, password: givenPassword},
            url: "/login",
            success: function (result) {
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

$(document).ready(function () {
    $('body').on('click', '#wyloguj', function () {
        setNotLoggedMenu();
    })
});

$(document).ready(function () {
    $('body').on('click', '#zarejestruj', function () {
        setRegisterUserMenu();
    })

});

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
                    globalUserName = givenRegisterData.name;
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

$(document).ready(function () {
    $('body').on('click', '#anuluj', function () {
        setNotLoggedMenu();
    })
});

// zmiana pozycji na liscie adresow
$(document).ready(function () {
    $('body').on('change', '#searchedList', function () {
        var selectList = document.getElementById("selectAddressList");
        var selectedIndex = selectList.options[selectList.selectedIndex].value;

        document.getElementById("province").value = addressDataList[selectedIndex].province;
        populateCountySelect(false);
        // globalNameProvince = document.getElementById("province").options[document.getElementById("province").selectedIndex].innerHTML;
        // addressData.province = addressDataList[selectedIndex].province;
        // $.ajax({
        //     url: "/county/" + addressDataList[selectedIndex].province, success: function (result) {
        //         var countySelect = document.getElementById("county");
        //         var i;
        //         var valueHTML = "";
        //         for (i = 0; i < result.length; i++) {
        //             valueHTML += "<option value='" + result[i].powIdTeryt + "'>" + result[i].powNazwa + "</option>";
        //         }
        //         countySelect.innerHTML = valueHTML;
                document.getElementById("county").value = addressDataList[selectedIndex].county;
        //         addressData.county = addressDataList[selectedIndex].county;
        //         globalNameCounty = document.getElementById("county").options[document.getElementById("county").selectedIndex].innerHTML;
        //     }
        // });

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
                addressData.commune = addressDataList[selectedIndex].commune;
                globalNameCommune = document.getElementById("commune").options[document.getElementById("commune").selectedIndex].innerHTML;
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
                addressData.town = addressDataList[selectedIndex].town;
                globalNameTown = document.getElementById("town").options[document.getElementById("town").selectedIndex].innerHTML;
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
                addressData.street = addressDataList[selectedIndex].street;
                globalNameStreet = document.getElementById("street").options[document.getElementById("street").selectedIndex].innerHTML;
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

function populateProvinceSelect(triggerProvince) {
    $.ajax({
        url: "/province",
        success: function (result) {
            var valueHTML = "";
            for (var i = 0; i < result.length; i++) {
                valueHTML += "<option value='" + result[i].wojIdTeryt + "'>" + result[i].wojNazwa + "</option>";
            }
            document.getElementById("province").innerHTML = valueHTML;
            if (triggerProvince) {
                $("#province").trigger("change");
            }
        }
    });
}

function populateCountySelect(triggerCounty) {
    var provinceValue = document.getElementById("province").options[document.getElementById("province").options.selectedIndex].value;
    globalNameProvince = document.getElementById("province").options[document.getElementById("province").options.selectedIndex].innerHTML;
    addressData.province = provinceValue;
    $.ajax({
        url: "/county/" + provinceValue,
        success: function (result) {
            var valueHTML = "";
            for (var i = 0; i < result.length; i++) {
                valueHTML += "<option value='" + result[i].powIdTeryt + "'>" + result[i].powNazwa + "</option>";
            }
            document.getElementById("county").innerHTML = valueHTML;
            if (triggerCounty) {
                $("#county").trigger("change");
            }
        }
    });
}

function populateCommuneSelect(triggerCommune) {
    var countyValue = document.getElementById("county").options[document.getElementById("county").options.selectedIndex].value;
    globalNameCounty = document.getElementById("county").options[document.getElementById("county").options.selectedIndex].innerHTML;
    addressData.county = countyValue;
    $.ajax({
        url: "/commune/" + countyValue,
        success: function (result) {
            var valueHTML = "";
            for (var i = 0; i < result.length; i++) {
                valueHTML += "<option value='" + result[i].gmIdTeryt + "'>" + result[i].gmNazwa + "</option>";
            }
            document.getElementById("commune").innerHTML = valueHTML;
            if (triggerCommune) {
                $("#commune").trigger("change");
            }
        }
    });
}

function populateTownSelect(triggerTown) {
    var communeValue = document.getElementById("commune").options[document.getElementById("commune").options.selectedIndex].value;
    globalNameCommune = document.getElementById("commune").options[document.getElementById("commune").options.selectedIndex].innerHTML;
    addressData.commune = communeValue;
    $.ajax({
        url: "/town/" + communeValue,
        success: function (result) {
            var valueHTML = "";
            for (var i = 0; i < result.length; i++) {
                valueHTML += "<option value='" + result[i].miejscIdTeryt + "'>" + result[i].miejscNazwa + "</option>";
            }
            document.getElementById("town").innerHTML = valueHTML;
            if (triggerTown) {
                $("#town").trigger("change");
            }
        }
    });
}

function populateStreetSelect(triggerStreet) {
    var communeValue = document.getElementById("commune").options[document.getElementById("commune").options.selectedIndex].value;
    var townValue = document.getElementById("town").options[document.getElementById("town").options.selectedIndex].value;
    globalNameTown = document.getElementById("town").options[document.getElementById("town").options.selectedIndex].innerHTML;
    addressData.town = townValue;
    $.ajax({
        url: "/street/" + communeValue + "/" + townValue,
        success: function (result) {
            var valueHTML = "<option value='brak'>----</option>";
            for (var i = 0; i < result.length; i++) {
                valueHTML += "<option value='" + result[i].ulIdTeryt + "'>" + result[i].ulNazwaGlowna + "</option>";
            }
            document.getElementById("street").innerHTML = valueHTML;
            if (triggerStreet) {
                $("#street").trigger("change");
            }
        }
    });
}

function populateAddressSelect() {
    var communeValue = document.getElementById("commune").options[document.getElementById("commune").options.selectedIndex].value;
    var townValue = document.getElementById("town").options[document.getElementById("town").options.selectedIndex].value;
    var streetValue = document.getElementById("street").options[document.getElementById("street").options.selectedIndex].value;
    globalNameStreet = document.getElementById("street").options[document.getElementById("street").options.selectedIndex].innerHTML;
    addressData.street = streetValue;
    var streetURL;
    if (streetValue === "brak") {
        streetURL = "/address/" + communeValue + "/" + townValue;
    } else {
        streetURL = "/address2/" + communeValue + "/" + townValue + "/" + streetValue;
    }
    $.ajax({
        url: streetURL,
        success: function (result) {
            var valueHTML = "";
            for (var i = 0; i < result.length; i++) {
                valueHTML += "<option value='" + result[i].pktNumer + "'>" + result[i].pktNumer + "</option>";
            }
            if (result.length === 0) {
                valueHTML += "<option value='brak'>brak adresów</option>"
            }
            document.getElementById("address").innerHTML = valueHTML;
            globalTable = result;
            $("#address").trigger("change");
        }
    });
}

function getAddressInfo() {
    globalNameAddress = document.getElementById("address").options[document.getElementById("address").options.selectedIndex].value;
    if (globalNameAddress !== "brak") {
        for (var i = 0; i < globalTable.length; i++) {
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

function transfromDecimalToMinutesSeconds(decimalValue) {
    var minutes = Math.floor((decimalValue - Math.floor(decimalValue)) * 60.0);
    var seconds = ((((decimalValue - Math.floor(decimalValue)) * 60.0) - minutes) * 60.0).toFixed(2);
    return Math.floor(decimalValue) + "° " + minutes + "' " + seconds + "\"";
}

function setNotLoggedMenu() {
    document.getElementById("loginForm").innerHTML = "Login:<input id=\"typedName\" type=\"text\" name=\"login\">\n" +
        "Hasło:<input id=\"typedPassword\" type=\"password\" name=\"hasło\">";
    document.getElementById("registerUser").innerHTML = "<button id=\"zarejestruj\">Zarejestruj się</button>";
    document.getElementById("isLogged").innerHTML = "<button id=\"zaloguj\">Zaloguj się</button>";
    document.getElementById("searchedList").innerHTML = "";
}

function setRegisterUserMenu() {
    document.getElementById("loginForm").innerHTML = "";
    document.getElementById("registerUser").innerHTML = "Email:<form><input id=\"registerEmail\" type=\"text\" name=\"email\">" +
        "Login:<form><input id=\"registerName\" type=\"text\" name=\"login\">" +
        "Hasło:<input id=\"registerPassword\" type=\"text\" name=\"password\">" +
        "</form> <button id='registerUserData'>Rejestracja</button>" +
        "<button id='anuluj'>Anuluj</button>";
    document.getElementById("isLogged").innerHTML = "";
}

function setLoggedInMenu(addressList) {
    document.getElementById("loginForm").innerHTML = "";
    document.getElementById("registerUser").innerHTML = "";
    document.getElementById("isLogged").innerHTML = "<button id=\"wyloguj\">Wyloguj się</button>";
    var searchedListHTML = "Witaj " + globalUserName + ", twoje adresy: <form> <select id='selectAddressList'>";
    var listOption;
    for (var i = 0; i < addressDataList.length; i++) {
        listOption = addressDataList[i].townName + ", " + addressDataList[i].streetName + " " + addressDataList[i].address;
        searchedListHTML += "<option value='" + i + "'>" + listOption + "</option>";
    }
    searchedListHTML += "</select></form>";
    document.getElementById("searchedList").innerHTML = searchedListHTML;
}