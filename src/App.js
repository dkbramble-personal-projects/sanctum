import React, {useEffect, useState} from 'react';
import {BrowserRouter} from 'react-router-dom'
import { Tab, Tabs} from 'react-bootstrap';
import axios from 'axios';
import './App.css';
import MainTable from './components/MainTable';
import RumorTable from './components/RumorTable';
import TodoTable from './components/TodoTable';
import OngoingTable from './components/OngoingTable';
import SpoofyTable from './components/SpoofyTable';
import NewReleaseModal from './components/NewReleaseModal.jsx';
import NewRumorModal from './components/NewRumorModal.jsx';
import NewTodoModal from './components/NewTodoModal.jsx';
import NewOngoingModal from './components/NewOngoingModal.jsx';
import { client_id } from './data/spoofy_env';
import './data/releases.json'

function SortTypeAndTitle(a, b){
  if(a.type < b.type) { return -1; }
  if(a.type > b.type) { return 1; }
  if (a.type === b.type){
    if(a.title < b.title) { return -1; }
    if(a.title > b.title) { return 1; }
    return 0;
  }
  return 0;
}

function SortTitle(a, b){
  if(a.title < b.title) { return -1; }
  if(a.title > b.title) { return 1; }
  return 0;
}
// function SortArtist(a, b){
//   if(a.artist < b.artist) { return -1; }
//   if(a.artist > b.artist) { return 1; }
//   return 0;
// }

function SortReleaseDate(a, b){
  var aDate = new Date(a.release_date);
  var bDate = new Date(b.release_date);

  if(aDate > bDate) { return -1; }
  if(aDate < bDate) { return 1; }
  return 0;
}
function App() {
  const [data, setData] = useState([]);

  const [tabKey, setTabKey] = useState(
    sessionStorage.getItem('TabKey') || 'upcomingReleases'
  );
  useEffect(() => {
    sessionStorage.setItem('TabKey', tabKey);
  }, [tabKey]);

  const [spoofyToken, setSpoofyToken] = useState(
    sessionStorage.getItem('spoofyToken')
  );

  var spoofyUrl = "https://accounts.spotify.com/authorize?client_id=" + client_id + "&response_type=token&redirect_uri=http://localhost:3000/spoofy/&scope=user-follow-read";
  var id = window.location.href.replace("http://localhost:3000/spoofy/#access_token=", "");
  var splitUrl = id.split("&")[0];
  if (spoofyToken == null && !splitUrl.includes("http://localhost:3000/")){
    setSpoofyToken(splitUrl);
  }

  async function getTableData () {
    var json = require('./data/releases.json');
    var mainDataResponse = json['releases'];
    mainDataResponse.sort(SortTitle);

    mainDataResponse.forEach((val) => {
      if (val.releaseDate !== null){
        var today = new Date();
        var date = new Date();
        var dateString = "";
        if (new Date(val.releaseDate).getFullYear() < 2010){
          date = new Date((val.releaseDate + 86400) * 1000);
          val.daysLeft = Math.ceil((date.getTime() - (today.getTime())) / (1000 * 60 * 60 * 24));
        } else {
          date = new Date(val.releaseDate);
          date.setDate(date.getUTCDate());
          val.daysLeft = Math.ceil((date.getTime() - (today.getTime())) / (1000 * 60 * 60 * 24));
        }
        dateString = date.toDateString().slice(4)
        val.releaseDate = dateString;
      }
    });
    mainDataResponse.sort(function DateSort(a, b) { 
      var first = (a.daysLeft === null || typeof a.daysLeft === 'undefined') ? 100000 : Number( a.daysLeft);
      var second = (b.daysLeft === null || typeof b.daysLeft === 'undefined') ? 100000 : Number( b.daysLeft);

        if (first > second) {
          return 1;
        } else if (second > first) {
          return -1;
        } else {
          return 0;
        }
    });

    var rumorDataResponse = json['rumors'].sort(SortTypeAndTitle);
    var todoDataResponse = json['todos'].sort(SortTypeAndTitle);
    var ongoingDataResponse = json['ongoing'].sort(SortTitle);

    const config = {
      headers: { Authorization: `Bearer ${spoofyToken}` }
    };

    var artistDictionary = {};
    var artistArray = [];
    var artistIdArray = [];

    async function getSpoofyArtists (bonus) {
      return axios.get( 
        "https://api.spotify.com/v1/me/following?type=artist&limit=50" + bonus,
        config
      ).then((s)=> {
        return s['data']['artists']['items'];
      }).catch(console.log); 
    };

    async function getSpoofyReleases (id) {
      return axios.get( 
        "https://api.spotify.com/v1/artists/" + id + "/albums?include_groups=album,single&country=US&limit=5",
        config
      ).then((s)=> {
        return s['data']['items'];
      }).catch(console.log); 
    };


    if (data.length < 1){
      //TODO: Find a better way to chain promises conditionally. Or be lazy and add another promise if you hit artist max
      await getSpoofyArtists("").then((artists) => {
        if (typeof artists !== 'undefined'){
          var arArr = [];
          artists.forEach((artist) => {
            artistDictionary[artist.id] = artist.name;
            arArr.push(artist.id);
            artistIdArray.push(artist.id);
          });
          artistArray.push(arArr.pop());
        } else {
          // alert("Get a new token");
        }
      });

      var bonus = "&after=" + artistArray[0];
      var stop = false;
      if (typeof artistArray[0] !== 'undefined'){
        await getSpoofyArtists(bonus).then((artists) => {
          if (typeof artists !== 'undefined'){
            var arArr = [];
            artists.forEach((artist) => {
              artistDictionary[artist.id] = artist.name;
              arArr.push(artist.id);
              artistIdArray.push(artist.id);
            });
            artistArray.push(arArr.pop());
          } 
        });
      } else {
        stop = true;
      }


      bonus = "&after=" + artistArray[1];
      if (typeof artistArray[1] !== 'undefined'){
        await getSpoofyArtists(bonus).then((artists) => {
          if (typeof artists !== 'undefined'){
            var arArr = [];
            artists.forEach((artist) => {
              artistDictionary[artist.id] = artist.name;
              arArr.push(artist.id);
              artistIdArray.push(artist.id);
            });
            artistArray.push(arArr.pop());
          }
        });
      }

      bonus = "&after=" + artistArray[2];
      if (typeof artistArray[2] !== 'undefined'){
        await getSpoofyArtists(bonus).then((artists) => {
          if (typeof artists !== 'undefined'){
            var arArr = [];
            artists.forEach((artist) => {
              artistDictionary[artist.id] = artist.name;
              arArr.push(artist.id);
              artistIdArray.push(artist.id);
            });
            artistArray.push(arArr.pop());
          } 
        });
      }

      bonus = "&after=" + artistArray[3];
      if (typeof artistArray[3] !== 'undefined'){
        await getSpoofyArtists(bonus).then((artists) => {
          if (typeof artists !== 'undefined'){
            var arArr = [];
            artists.forEach((artist) => {
              artistDictionary[artist.id] = artist.name;
              arArr.push(artist.id);
              artistIdArray.push(artist.id);
            });
            artistArray.push(arArr.pop());
          } 
        });
      }

      bonus = "&after=" + artistArray[4];
      if (typeof artistArray[4] !== 'undefined'){
        await getSpoofyArtists(bonus).then((artists) => {
          if (typeof artists !== 'undefined'){
            var arArr = [];
            artists.forEach((artist) => {
              artistDictionary[artist.id] = artist.name;
              arArr.push(artist.id);
              artistIdArray.push(artist.id);
            });
            artistArray.push(arArr.pop());
          } 
        });
      }

      bonus = "&after=" + artistArray[5];
      if (typeof artistArray[5] !== 'undefined'){
        await getSpoofyArtists(bonus).then((artists) => {
          if (typeof artists !== 'undefined'){
            var arArr = [];
            artists.forEach((artist) => {
              artistDictionary[artist.id] = artist.name;
              arArr.push(artist.id);
              artistIdArray.push(artist.id);
            });
            artistArray.push(arArr.pop());
          } 
        });
      }

      if (!stop){
        var promises = [];
        if (artistIdArray.length % 50 === 0){
          alert("Artist count may have hit max: " + artistIdArray.length);
        }
        artistIdArray.forEach(async (id) => {
          promises.push(getSpoofyReleases(id).then((releases) => {
            if (typeof releases !== 'undefined'){
              var releaseArr = [];
              releases.forEach((release)=>{
                var shouldGet = false;
                if (release['release_date_precision'] === "day"){
                  var releaseDate = new Date(release['release_date']);
                  var currentDate = new Date();
                  releaseDate.setDate(releaseDate.getDate());
                  currentDate.setDate(currentDate.getDate() - 14);
                  if (currentDate <= releaseDate){
                      shouldGet = true;
                  }
                }
                if (shouldGet){
                  var date = new Date(release['release_date']);
                  date.setDate(date.getDate() + 1);
                  var dateString = date.toDateString().slice(4)
                  var strJson = "{ \"name\" : \"" + release['name'] + "\", \"artist\" : \"" + artistDictionary[id] + "\", \"type\" : \"" + release['album_type'] + "\", \"release_date\" : \"" + dateString + "\"}"; 
                  releaseArr.push(JSON.parse(strJson));
                }
              });

              return releaseArr;
            }
            return [];
          }));
        })
        Promise.all(promises).then((releaseSet) => {
          var jsonDict = [];
          releaseSet.forEach((releases) => {
            releases.forEach((release) => {
              if (release.length !== 0){
                jsonDict.push(release);
              }
            });
          });
          var dataArray = [];
          dataArray.push(mainDataResponse);
          dataArray.push(rumorDataResponse);
          dataArray.push(todoDataResponse);
          dataArray.push(ongoingDataResponse);
          jsonDict.sort(SortReleaseDate);
          dataArray.push(jsonDict);
          if (data.length < 1){
            setData(dataArray);
          }

        });
      } else {
        var dataArray = []; //cool naming conventions huh
        dataArray.push(mainDataResponse);
        dataArray.push(rumorDataResponse);
        dataArray.push(todoDataResponse);
        dataArray.push(ongoingDataResponse);
        if (data.length < 1){
          setData(dataArray);
        }
      }
    }
  }

  useEffect(() => {
    getTableData();
  });

  return (
    <BrowserRouter>
    <div>
      <Tabs className="tab" activeKey={tabKey} unmountOnExit={true} transition={false} onSelect={(k) => setTabKey(k)} id="tableSelection">
        <Tab eventKey="upcomingReleases" title="Upcoming Releases">
          <div className="table-stuff">
            <NewReleaseModal inTableButton={false}></NewReleaseModal>
            <div className="table-time">
              <MainTable  data={data[0]}/>
            </div>
          </div>
        </Tab>
        <Tab eventKey="rumors" title="Rumors/Untracked">
          <div className="table-stuff">
            <NewRumorModal inTableButton={false}></NewRumorModal>
            <div className="table-time">
              <RumorTable  data={data[1]}/>
            </div>
          </div>
        </Tab>
        <Tab eventKey="todos" title="Todos">
          <div className="table-stuff">
            <NewTodoModal inTableButton={false}></NewTodoModal>
            <div className="table-time">
              <TodoTable data={data[2]}/>
            </div>
          </div>
        </Tab>
        <Tab eventKey="ongoing" title="Ongoing Shows">
          <div className="table-stuff">
            <NewOngoingModal inTableButton={false}></NewOngoingModal>
            <div className="table-time">
              <OngoingTable data={data[3]}/>
            </div>
          </div>
        </Tab>
        <Tab eventKey="spoofy" title="Music Updates">
          <div className="table-stuff">
          <a href={spoofyUrl} className="btn-sm btn btn-new my-4 link-new">Get Data</a>
            <div className="table-time">
              <SpoofyTable data={data[4]}/>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
    </BrowserRouter>
  );
}


export default App;
