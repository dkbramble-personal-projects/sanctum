import React, {useEffect, useState} from 'react';
import {BrowserRouter} from 'react-router-dom'
import { Tab, Tabs} from 'react-bootstrap';
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
import { spoofyData } from './spoofyService.js';

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

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
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
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        if (new Date(val.releaseDate).getFullYear() < 2010){
          date = new Date((val.releaseDate) * 1000);
          date.setDate(date.getUTCDate());
          date.setHours(0,0,0,0);
          today.setDate(today.getUTCDate());
          today.setHours(0,0,0,0);
          val.daysLeft = Math.round(Math.abs((date - today) / oneDay));
        } else {
          date = new Date(val.releaseDate);
          date.setDate(date.getUTCDate());
          date.setHours(0,0,0,0);
          today.setDate(today.getUTCDate());
          today.setHours(0,0,0,0);
          val.daysLeft = Math.round(Math.abs((date - today) / oneDay));
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

    var dataArray = [];
    dataArray.push(mainDataResponse);
    dataArray.push(rumorDataResponse);
    dataArray.push(todoDataResponse);
    dataArray.push(ongoingDataResponse);

    if (data.length < 1 && spoofyToken !== null){
      const config = {
        headers: { Authorization: `Bearer ${spoofyToken}` }
      };

      //pushes spotify data to the dataArray and sets the data state
      spoofyData(sleep, config, SortReleaseDate, dataArray, setData);
    } 
    else if (data.length < 1) {
        setData(dataArray);
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
