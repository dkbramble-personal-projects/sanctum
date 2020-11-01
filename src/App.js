import React, {useEffect, useState} from 'react';
import './App.css';
import MainTable from './components/MainTable';
import RumorTable from './components/RumorTable';
import TodoTable from './components/TodoTable';
import OngoingTable from './components/OngoingTable';
import './data/releases.json'
import { Tab, Tabs} from 'react-bootstrap';
import NewReleaseModal from './components/NewReleaseModal.jsx';
import NewRumorModal from './components/NewRumorModal.jsx';
import NewTodoModal from './components/NewTodoModal.jsx';
import NewOngoingModal from './components/NewOngoingModal.jsx';

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
function App() {
  const [mainData, setMainData] = useState();
  const [rumorData, setRumorData] = useState();
  const [todoData, setTodoData] = useState();
  const [ongoingData, setOngoingData] = useState();

  const [tabKey, setTabKey] = useState(
    sessionStorage.getItem('TabKey') || 'upcomingReleases'
  );
  console.log(tabKey);
  useEffect(() => {
    console.log("set to " + tabKey);
    sessionStorage.setItem('TabKey', tabKey);
  }, [tabKey]);

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
          val.daysLeft = Math.ceil((val.releaseDate - (today.getTime() / 1000)) / (60 * 60 * 24));
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

    setMainData(mainDataResponse);
    setRumorData(rumorDataResponse);
    setTodoData(todoDataResponse);
    setOngoingData(ongoingDataResponse);

  }

  useEffect(() => {
    getTableData();
  }, []);

  return (
    
    <div>
      <Tabs className="tab" activeKey={tabKey} unmountOnExit={true} transition={false} onSelect={(k) => setTabKey(k)} id="tableSelection">
        <Tab eventKey="upcomingReleases" title="Upcoming Releases">
          <div className="table-stuff">
            <NewReleaseModal></NewReleaseModal>
            <div className="table-time">
              <MainTable  data={mainData}/>
            </div>
          </div>
        </Tab>
        <Tab eventKey="rumors" title="Rumors/Untracked">
          <div className="table-stuff">
            <NewRumorModal></NewRumorModal>
            <div className="table-time">
              <RumorTable  data={rumorData}/>
            </div>
          </div>
        </Tab>
        <Tab eventKey="todos" title="Todos">
          <div className="table-stuff">
            <NewTodoModal></NewTodoModal>
            <div className="table-time">
              <TodoTable data={todoData}/>
            </div>
          </div>
        </Tab>
        <Tab eventKey="ongoing" title="Ongoing Shows">
          <div className="table-stuff">
            <NewOngoingModal></NewOngoingModal>
            <div className="table-time">
              <OngoingTable data={ongoingData}/>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
