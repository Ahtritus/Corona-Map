const url = "https://api.covid19india.org/data.json";

const mymap = L.map("CovidMap", { zoomControl: false }).setView(
  [23.0, 86.0],
  5
);

const attribution =
  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>';
const tileUrl =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";


function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function getCardData() {
  const response = await fetch(url);
  const data = await response.json();
  //console.log(data);
  var confirmed = data.statewise[0].confirmed;
  if (data.statewise[0].deltaconfirmed == 0) {
    var deltaConfirmed =
      data.cases_time_series[data.cases_time_series.length - 1].dailyconfirmed;
  } else {
    var deltaConfirmed = data.statewise[0].deltaconfirmed;
  }

  document.getElementById("confirmed").innerHTML =
    numberWithCommas(confirmed) +
    "<br> (+" +
    numberWithCommas(deltaConfirmed) +
    ")";

  var active = data.statewise[0].active;
  document.getElementById("active").innerHTML = numberWithCommas(active);

  var recovered = data.statewise[0].recovered;

  if (data.statewise[0].deltarecovered == 0) {
    var deltarecovered =
      data.cases_time_series[data.cases_time_series.length - 1].dailyrecovered;
  } else {
    var deltarecovered = data.statewise[0].deltarecovered;
  }

  document.getElementById("recovered").innerHTML =
    numberWithCommas(recovered) +
    "<br> (+" +
    numberWithCommas(deltarecovered) +
    ")";

  var deaths = data.statewise[0].deaths;

  if (data.statewise[0].deltadeaths == 0) {
    var deltadeaths =
      data.cases_time_series[data.cases_time_series.length - 1].dailydeceased;
  } else {
    var deltadeaths = data.statewise[0].deltadeaths;
  }
  document.getElementById("deceased").innerHTML =
    numberWithCommas(deaths) + "<br> (+" + numberWithCommas(deltadeaths) + ")";

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  var date = new Date();
  document.getElementById("time").innerHTML = date.toLocaleDateString(
    "en-US",
    options
  );
  /*var time = data.statewise[0].lastupdatedtime;
    console.log(new Date());
    */
}

function covData(
  statecode,
  state,
  population,
  active,
  confirmed,
  deaths,
  recovered,
  latitude,
  longitude
) {
  this.statecode = statecode;
  this.state = state;
  this.population = population;
  this.active = active;
  this.confirmed = confirmed;
  this.deaths = deaths;
  this.recovered = recovered;
  this.latitude = latitude;
  this.longitude = longitude;
}

var tiles = L.tileLayer(tileUrl, {
  //mapbox://styles/ahtritus/cknyzh0680u1317qmiuqukj2p
  attribution,
  //id: 'ahtritus/cknyzh0680u1317qmiuqukj2p',
  id: "ahtritus/cknzsfu080bno17plf2lm28bi",
  minZoom: 5,
  maxZoom: 5,
  accessToken:
    "pk.eyJ1IjoiYWh0cml0dXMiLCJhIjoiY2tueXFienRlMWl4djJvb2E4a2UweHZkdyJ9.WQhSyAWmhDTM08vfEE4QEw",
});
tiles.addTo(mymap);

mymap.setMaxBounds([
  [5, 70],
  [41, 90],
]);

mymap.on("load", function () {
  filterLayers("IN");
});


function filterLayers(worldview) {
  // The "admin-0-boundary-disputed" layer shows boundaries
  // at this level that are known to be disputed.
  mymap.setFilter("admin-0-boundary-disputed", [
    "all",
    ["==", ["get", "disputed"], "true"],
    ["==", ["get", "admin_level"], 0],
    ["==", ["get", "maritime"], "false"],
    ["match", ["get", "worldview"], ["all", worldview], true, false],
  ]);
  // The "admin-0-boundary" layer shows all boundaries at
  // this level that are not disputed.
  mymap.setFilter("admin-0-boundary", [
    "all",
    ["==", ["get", "admin_level"], 0],
    ["==", ["get", "disputed"], "false"],
    ["==", ["get", "maritime"], "false"],
    ["match", ["get", "worldview"], ["all", worldview], true, false],
  ]);
  // The "admin-0-boundary-bg" layer helps features in both
  // "admin-0-boundary" and "admin-0-boundary-disputed" stand
  // out visually.
  mymap.setFilter("admin-0-boundary-bg", [
    "all",
    ["==", ["get", "admin_level"], 0],
    ["==", ["get", "maritime"], "false"],
    ["match", ["get", "worldview"], ["all", worldview], true, false],
  ]);
}


function getColour(count) {
  var icon;
  if (count < 5000) {
    icon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    return icon;
  }

  if (count < 20000) {
    icon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    return icon;
  }
  if (count < 100000) {
    icon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    return icon;
  }

  icon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  return icon;
}

async function getData() {
  var response = await fetch("https://api.covid19india.org/data.json");
  var APIData = await response.json();

  var fetchResource = await fetch("State_details.json");
  var resource = await fetchResource.json();

  var resourceLength = Object.keys(resource.State).length;
  //console.log(n);
  //console.log(res2);
  /*
  for (var i = 0; i < resourceLength; i++) {
    resource.Latitude[i] += "°N";
    resource.Longitude[i] += "°E";
  }
  */
  var statewise = APIData.statewise;

  var data = [];
  for (var i = 0; i < statewise.length - 1; i++) {
    for (var j = 0; j < resourceLength; j++) {
      if (statewise[i].state == resource.State[j] || (i == 0 && j == 0)) {
        data[i] = new covData(
          statewise[i].statecode,
          statewise[i].state,
          resource.Population[j],
          statewise[i].active,
          statewise[i].confirmed,
          statewise[i].deaths,
          statewise[i].recovered,
          resource.Latitude[j],
          resource.Longitude[j]
        );
      }
    }
  }

  //console.log(data);
  //getPopupContent(data, statewise.length, resourceLength);
  return data;
}

async function getPopupContent() {
  var data = await getData();
  console.log(data);
  for (var i = 0; i < 37; i++) {
    for (var j = 0; j < 37; j++) {
      if (i != 0) {
        var popupContent =
          "<b>State: </b>" +
          data[i].state +
          "<br>" +
          "<b>Total Population:</b> " +
          data[i].population +
          "<br>" +
          "<b>Total Confirmed Cases:</b> " +
          data[i].confirmed +
          "<br>" +
          "<b>Active Cases: </b>" +
          data[i].active +
          "<br>" +
          "<b>Total Deaths:</b> " +
          data[i].deaths +
          "<br>" +
          "<b>Recovered: </b>" +
          data[i].recovered;
        marker[i] = L.marker([data[i].latitude, data[i].longitude], {
          icon: getColour(data[i].active),
        })
          .addTo(mymap)
          .bindPopup(popupContent);
      }
    }
  }
}

async function updateTable() {
  let sortDirection = false;
  var data = await getData();

  loadTableData(data);

  function loadTableData(dataArray) {
    //console.log(dataArray);
    const tableBody = document.getElementById("table--data");
    let dataHtml = "";

    dataArray.forEach(function (item) {
      dataHtml += `<tr><th>${item.state}</th><td>${numberWithCommas(
        item.confirmed
      )}</td><td>${numberWithCommas(item.active)}</td><td>${numberWithCommas(
        item.recovered
      )}</td><td>${numberWithCommas(item.deaths)}</td><td>${numberWithCommas(
        item.population
      )}</td></tr>`;
      //console.log(item.comfirmed);
      //dataHtml += `<tr><th>${item.state}</th><td>${item.confirmed}</td><td>${item.active}</td><td>${item.recovered}</td><td>${item.deaths}</td><td>${item.population}</td></tr>`;
    });

    //console.log(dataHtml);
    tableBody.innerHTML = dataHtml;
  }
}

let states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
];

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

async function searchEnter() {
  var input = document.getElementById("myInput");
  input.addEventListener("keyup", async function (event) {
    if (event.keyCode === 13) {
      var stateName = document.getElementById("myInput").value;
      //console.log(stateName);
      var data = await getData();
      //console.log(data);
      for(var i = 0; i<data.length; i++) {
        if(data[i].state.toUpperCase() == stateName.toUpperCase()){
          console.log("Match");
          updateCard(data[i].confirmed, data[i].active, data[i].recovered, data[i].deaths);
          break;
        }
      }
    }
  });
}

async function updateCard(confirmed, active, recovered, deaths){
  document.getElementById("confirmed").innerHTML = numberWithCommas(confirmed);
  document.getElementById("active").innerHTML = numberWithCommas(active);
  document.getElementById("recovered").innerHTML = numberWithCommas(recovered);
  document.getElementById("deceased").innerHTML = numberWithCommas(deaths);
}

function marker(lat, lon) {
  this.lat = lat;
  this.lon = lon;
}


searchEnter();
getPopupContent();
autocomplete(document.getElementById("myInput"), states);
updateTable();
getCardData();
setInterval(getCardData, 60000);
setInterval(updateTable, 60000);
