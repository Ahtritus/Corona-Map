const mymap = L.map('CovidMap',{zoomControl: false}).setView([23.00, 86.00], 5);

const attribution = '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>';
const tileUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'

var tiles = L.tileLayer(tileUrl, 
    {
        //mapbox://styles/ahtritus/cknyzh0680u1317qmiuqukj2p
        //mapbox://styles/ahtritus/cknzsfu080bno17plf2lm28bi
        attribution,
        id: 'ahtritus/cknzsfu080bno17plf2lm28bi',
        minZoom: 5,
        maxZoom: 5,
        reuseTiles: true, 
        unloadInvisibleTiles: true,
        accessToken: "pk.eyJ1IjoiYWh0cml0dXMiLCJhIjoiY2tueXFienRlMWl4djJvb2E4a2UweHZkdyJ9.WQhSyAWmhDTM08vfEE4QEw"
    });
tiles.addTo(mymap);

mymap.setMaxBounds([[5,70], [41,90]]);

mymap.on('load', function () {
    filterLayers("IN");
});


function filterLayers(worldview) {
    // The "admin-0-boundary-disputed" layer shows boundaries
    // at this level that are known to be disputed.
    mymap.setFilter('admin-0-boundary-disputed', [
    'all',
    ['==', ['get', 'disputed'], 'true'],
    ['==', ['get', 'admin_level'], 0],
    ['==', ['get', 'maritime'], 'false'],
    ['match', ['get', 'worldview'], ['all', worldview], true, false]
    ]);
    // The "admin-0-boundary" layer shows all boundaries at
    // this level that are not disputed.
    mymap.setFilter('admin-0-boundary', [
    'all',
    ['==', ['get', 'admin_level'], 0],
    ['==', ['get', 'disputed'], 'false'],
    ['==', ['get', 'maritime'], 'false'],
    ['match', ['get', 'worldview'], ['all', worldview], true, false]
    ]);
    // The "admin-0-boundary-bg" layer helps features in both
    // "admin-0-boundary" and "admin-0-boundary-disputed" stand
    // out visually.
    mymap.setFilter('admin-0-boundary-bg', [
    'all',
    ['==', ['get', 'admin_level'], 0],
    ['==', ['get', 'maritime'], 'false'],
    ['match', ['get', 'worldview'], ['all', worldview], true, false]
    ]);
}

function getColour(count)
{
    var icon;
    if(count<5000){
        icon =new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
        return icon;
    }
        
    if(count<20000){
        icon =new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
        return icon;
        }
    if(count<100000){
        icon =new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
        return icon;
        }
        
    icon =new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
        });
    return icon;
}


 
async function getData() 
{
    var response = await fetch("https://api.covid19india.org/data.json");
	var corona = await response.json();

    var res = await fetch("State_details.json");
    var res2 = await res.json();
  
    var n = Object.keys(res2.State).length
    //console.log(n);
    //console.log(res2);
    
    var i;
    var a = corona.statewise;

    var covArr = [];


    for (i = 0; i<a.length-1; i++)
    {
        for (var j = 0; j<n; j++)
        {
            if(a[i].state == res2.State[j] || (i==0 && j == 0))
            {
                
                covArr[i] = new covData(a[i].statecode, a[i].state, res2.Population[j], a[i].active, a[i].confirmed, a[i].deaths, a[i].recovered, res2.Latitude[j], res2.Longitude[j] );
                if(i!=0)
                {
                    var popupContent = "<b>State: </b>"+covArr[i].state+"<br>"+"<b>Total Population:</b> "+covArr[i].population+"<br>"+"<b>Total Confirmed Cases:</b> "+covArr[i].tot_confirmed+"<br>"+"<b>Active Cases: </b>"+covArr[i].active+"<br>"+"<b>Total Deaths:</b> "+covArr[i].tot_deaths+"<br>"+"<b>Recovered: </b>"+covArr[i].tot_recovered;
                    marker[i]=L.marker([covArr[i].latitude, covArr[i].longitude], {icon: getColour(covArr[i].active)}).addTo(mymap).bindPopup(popupContent);;
                }
            }
        }
    }
    console.log(covArr); 

    

}

function covData(statecode, state, population, active, tot_confirmed, tot_deaths, tot_recovered, latitude, longitude){
    this.statecode=statecode;
    this.state=state;
    this.population=population;
    this.active=active;
    this.tot_confirmed=tot_confirmed;
    this.tot_deaths=tot_deaths;
    this.tot_recovered=tot_recovered;
    this.latitude=latitude;
    this.longitude=longitude;
}

function marker(lat, lon){
    this.lat=lat;
    this.lon=lon;
}

getData();
setInterval(getData, 600000);
