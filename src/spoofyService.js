
import axios from 'axios';
async function getSpoofyReleases (id, config) {
    var stop = false;
    var artistList = [];
    var offset = 0; // needed too get more than 50 releases since I can't filter by release date
    while (!stop){
      var getUrl = "https://api.spotify.com/v1/artists/" + id + "/albums?include_groups=album,single&country=US&limit=50";
      if (offset > 0){
        getUrl = getUrl + "&offset=" + offset;
      }

      var getResults = await axios.get( 
        getUrl,
        config
      ).then((s)=> {
        return s['data']['items'];
      }).catch(console.log);

      artistList.push(getResults); 

      if ((artistList.length > 0 && artistList[0].length % 50 !== 0) || getResults.length === 0){
        stop = true;
      } else {
        //NOTE: if you ever see repeats, its probably because of the offset. Not sure when the next index is relative to the offset.
        offset = offset + 49;
      }
    }
    
    return artistList[0];
  };

  async function getSpoofyArtists (bonus, config) {
    var artistResponse = await axios.get( 
      "https://api.spotify.com/v1/me/following?type=artist&limit=50" + bonus,
      config
    ).catch(console.log);
    var badTime = [];
    if (typeof artistResponse !== 'undefined'){
        if (artistResponse['status'] === 200){
            return artistResponse['data']['artists']['items'];
        } else {
            return badTime;
        }

    } else {
        return badTime;
    }
  };

  function storeSpoofyArtists (artists, artistDictionary, artistIdArray, artistArray) {
    if (typeof artists !== 'undefined'){
      var arArr = [];
      artists.forEach((artist) => {
        artistDictionary[artist.id] = artist.name;
        arArr.push(artist.id);
        artistIdArray.push(artist.id);
      });
      artistArray.push(arArr.pop());
      return false;
    } else {
      return true;
    }
  };

  async function getSpoofyData(sleep, config, SortReleaseDate, dataArray, setData){

    var artistDictionary = {};
    var artistArray = [];
    var artistIdArray = [];

    var stop = false;
    var artistLimit = false;
    var count = -1;
    var bonus = "";

    while (!stop && !artistLimit){
      if (artistArray.length > 0){
        bonus = "&after=" + artistArray[count];
      }
      if (typeof artistArray[count] !== 'undefined' || bonus === ""){
        var artists = await getSpoofyArtists(bonus, config);
        if (artists.length > 0){
            stop = storeSpoofyArtists(artists, artistDictionary, artistIdArray, artistArray)
        } else {
            //stop = true;
        }
      } else {
        artistLimit = true;
      }
      count = count + 1;
    }
    
    if (!stop){
      var promises = [];
      artistIdArray.forEach(async (id) => {
        //console.log(artistDictionary[id]);
        sleep(10); //spoofy api sucks, have to make like 5000 calls to get the right information and they have call rate limits.
        promises.push(getSpoofyReleases(id, config).then((releases) => {
          //console.log(releases);
          if (typeof releases !== 'undefined'){
            var releaseArr = [];
            releases.forEach((release)=>{
              //console.log(release);
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

        if (jsonDict.length > 0){
          jsonDict.sort(SortReleaseDate);
          dataArray.push(jsonDict);
          setData(dataArray);
        }

      });
  }
}

export const spoofyData = (sleep, config, SortReleaseDate, dataArray, data, setData)=>{
    getSpoofyData(sleep, config, SortReleaseDate, dataArray, data, setData);
}