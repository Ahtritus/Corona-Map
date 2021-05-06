const mymap = L.map("CovidMap", { zoomControl: false }).setView(
  [23.0, 86.0],
  5
);

const attribution =
  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>';
const tileUrl =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";

var tiles = L.tileLayer(tileUrl, {
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

  //var i;
  var statewise = APIData.statewise;

  var data = [];

  for (var i = 0; i < statewise.length - 1; i++) {
    for (var j = 0; j < resourceLength; j++) {
      if (statewise[i].state == resource.State[j] || (i == 0 && j == 0)) {
        data[i] = new covData(
          statewise[i].statecode,
          statewise[i].state,
          resource.Population[i],
          statewise[i].active,
          statewise[i].confirmed,
          statewise[i].deaths,
          statewise[i].recovered,
          resource.Latitude[j],
          resource.Longitude[j]
        );/*
        if (i != 0) {
          var popupContent =
            "<b>State: </b>" +
            data[i].state +
            "<br>" +
            "<b>Total Population:</b> " +
            data[i].population +
            "<br>" +
            "<b>Total Confirmed Cases:</b> " +
            data[i].tot_confirmed +
            "<br>" +
            "<b>Active Cases: </b>" +
            data[i].active +
            "<br>" +
            "<b>Total Deaths:</b> " +
            data[i].tot_deaths +
            "<br>" +
            "<b>Recovered: </b>" +
            data[i].tot_recovered;
          marker[i] = L.marker([data[i].latitude, data[i].longitude], {
            icon: getColour(data[i].active),
          })
            .addTo(mymap)
            .bindPopup(popupContent);
        }*/
      }
    }
  }
  //console.log(covArr);
  getPopupContent(data, statewise.length, resourceLength);
  return data;
}
function getPopupContent(data, statewiseLength,resourceLength) {
    for (var i = 0; i < statewiseLength - 1; i++) {
        for (var j = 0; j < resourceLength; j++) {
            if (i != 0) {
                var popupContent =
                  "<b>State: </b>" +
                  data[i].state +
                  "<br>" +
                  "<b>Total Population:</b> " +
                  data[i].population +
                  "<br>" +
                  "<b>Total Confirmed Cases:</b> " +
                  data[i].tot_confirmed +
                  "<br>" +
                  "<b>Active Cases: </b>" +
                  data[i].active +
                  "<br>" +
                  "<b>Total Deaths:</b> " +
                  data[i].tot_deaths +
                  "<br>" +
                  "<b>Recovered: </b>" +
                  data[i].tot_recovered;
                marker[i] = L.marker([data[i].latitude, data[i].longitude], {
                  icon: getColour(data[i].active),
                })
                  .addTo(mymap)
                  .bindPopup(popupContent);
              }
            }
        }
}


function covData(
  statecode,
  state,
  population,
  active,
  tot_confirmed,
  tot_deaths,
  tot_recovered,
  latitude,
  longitude
) {
  this.statecode = statecode;
  this.state = state;
  this.population = population;
  this.active = active;
  this.tot_confirmed = tot_confirmed;
  this.tot_deaths = tot_deaths;
  this.tot_recovered = tot_recovered;
  this.latitude = latitude;
  this.longitude = longitude;
}

function marker(lat, lon) {
  this.lat = lat;
  this.lon = lon;
}

getData();
setInterval(getData, 600000);
