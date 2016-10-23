let GeoJSON = require('geojson');
let fs = require('fs');
var arc = require('arc');

let teams = JSON.parse(fs.readFileSync('teams.json'));
let events = JSON.parse(fs.readFileSync('events.json'));


let eventTravel = {};

for (var eventKey in events) {
  let event = events[eventKey]
  let x = event.position[0];
  let y = event.position[1];
  let start = {x,y};
  eventTravel[eventKey] = event.teams.map((t) => {
      let team = teams[t] || {}
      if(!team.position) {
        return null;
      }
      let end = {x: team.position[0], y:team.position[1]};
      return generateArc(start, end, {name: `${t} to ${eventKey}`});

  })
  eventTravel[eventKey] = eventTravel[eventKey].filter((path) => path)
  fs.writeFile(`event_attendance/${event.event_district_string||"Regional"}_${eventKey}.geojson`,JSON.stringify({features: eventTravel[eventKey], type: 'FeatureCollection'}, null, 4));
}



function generateArc(start, end, props) {
  let generator = new arc.GreatCircle(start, end, props);
  return generator.Arc(30).json();
}
