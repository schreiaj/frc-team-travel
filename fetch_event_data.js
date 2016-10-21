"use strict";

var request = require('sync-request');
var sleep = require('sleep');
var fs = require('fs');

const MAPZEN_KEY = process.env.MAPZEN_KEY || '';
if (MAPZEN_KEY==='') {
  console.warn("We use Mapzen to handle geocoding, encoding lots of events and teams may result in API overages without a key\nWe do cache locally and repeated calls will probably hit a Mapzen cache so it may not be an issue, but the keys are free. We look for a MAPZEN_KEY environment variable");
}

const currentYear = process.argv[2] || (new Date()).getFullYear();
console.log(`Loading data for ${currentYear}`);

const headers = {'X-TBA-App-Id': 'schreiaj:team_travel:0.0.1'};

function getEventTeams(eventKey) {
    console.log(`Getting teams for ${eventKey}`);
    let res = request('GET', `https://www.thebluealliance.com/api/v2/event/${eventKey}/teams`, { headers });
    let teams = JSON.parse(res.getBody());
    teams.map((t) => allTeams[t.key] = t)
    return teams.map((t) => t.key);
}


let allTeams = {};
let allEvents = {};
let res = request('GET', `https://www.thebluealliance.com/api/v2/events/${currentYear}`, { headers });

let events = JSON.parse(res.getBody());

events.map((e) => {

    e.teams = getEventTeams(e.key);
    allEvents[e.key] = e;
});

// console.log(allEvents);
// console.log(allTeams);

for (var k in allTeams) {
  try {
    if(!allTeams[k].location) { continue }
    let res = request('get', `https://search.mapzen.com/v1/search?text=${encodeURIComponent(allTeams[k].location)}&size=1&api_key=${MAPZEN_KEY}`);
    allTeams[k].position = JSON.parse(res.getBody()).features[0].geometry.coordinates;
    sleep.usleep(0.17*1000000)
    console.log(allTeams[k]);
  } catch (e) {

  }
}

for (var k in allEvents) {
  try {
    let res = request('get', `https://search.mapzen.com/v1/search?text=${encodeURIComponent(allEvents[k].location)}&size=1&api_key=${MAPZEN_KEY}`);
    allEvents[k].position = JSON.parse(res.getBody()).features[0].geometry.coordinates;
    sleep.usleep(0.17*1000000)
    console.log(allEvents[k]);
  } catch (e) {

  }
}

fs.writeFile('teams.json', JSON.stringify(allTeams, null, 4));
fs.writeFile('events.json', JSON.stringify(allEvents, null, 4));
