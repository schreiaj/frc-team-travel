let GeoJSON = require('geojson');
let fs = require('fs');

let teams = JSON.parse(fs.readFileSync('teams.json'))

let allTeams = [];

for (var k in teams) {
  let t = teams[k];

  if(t.position) {
    t.lat = t.position[1];
    t.long = t.position[0];
    delete t.position;
    allTeams.push(t)
  }
}

let geoTeams = GeoJSON.parse(allTeams, {Point: ['lat', 'long']});
fs.writeFile('teams.geojson', JSON.stringify(geoTeams, null, 4));


let events = JSON.parse(fs.readFileSync('events.json'))

let allEvents = [];

for (var k in events) {
  let t = events[k];

  if(t.position) {
    t.lat = t.position[1];
    t.long = t.position[0];
    delete t.position;
    allEvents.push(t)
  }
}

let geoEvents = GeoJSON.parse(allEvents, {Point: ['lat', 'long']});
fs.writeFile('events.geojson', JSON.stringify(geoEvents, null, 4));
