import requests
import pickle
import json

#Make sure you have these env files for authentication
authorization_token = pickle.load( open( "./src/data/igdb_env.p", "rb" ) )
client_id = pickle.load( open( "./src/data/igdb_env_client_id.p", "rb" ) )
client_secret = pickle.load( open( "./src/data/igdb_env_client_secret.p", "rb" ) )
igdb_url = 'https://api.igdb.com/v4/games'
releaseDates = {}

def manage_data(data):
  for game in data:
    if "first_release_date" in game.keys():
      releaseDates[game["name"]] = game["first_release_date"]
    else:
      releaseDates[game["name"]] = None

def pull_data(dataVal):
  global authorization_token
  global releaseDates
  data = 'fields name, first_release_date; where name = ' + dataVal
  print(dataVal)
  headers = {'Client-ID': client_id, 'Authorization':'Bearer ' +  authorization_token}
  response = requests.post(igdb_url, data=data, headers=headers)
  if response.status_code == 403:
    twitch_token_url= 'https://id.twitch.tv/oauth2/token?client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=client_credentials'
    token = requests.post(twitch_token_url)
    print("New Token:")
    print(token.json())
    authorization_token = token.json()['access_token']
    pickle.dump( authorization_token, open( "./src/data/igdb_env.p", "wb" ) )
    headers['Authorization'] = 'Bearer ' + authorization_token
    response = requests.post(igdb_url, data=data, headers=headers)
  manage_data(response.json())
  print("\n----------------------------------------------------------------\n")

with open('./src/data/releases.json') as f:
  jsonData = json.load(f)

count = 0
dataToGet = "("
for row in jsonData['releases']:
  if (row['checkDate'] == "Y"):
    dataToGet = dataToGet + '"' + row['title'] + '", '
    count = count + 1
  if (row['checkDate'] == "Y" and count % 10 == 0):
    dataToGet = dataToGet[:-2] + ');'
    pull_data(dataToGet)
    count = 0
    dataToGet = "("

if (count > 0):
  dataToGet = dataToGet[:-2] + ');'
  pull_data(dataToGet)

for game in releaseDates:
  print(game + " : " + str(releaseDates[game]))
  game_index = [i for i,x in enumerate(jsonData['releases']) if x["title"] == game][0]
  jsonData['releases'][game_index]['title'] = game
  jsonData['releases'][game_index]['releaseDate'] = releaseDates[game]

with open('./src/data/releases.json', 'w') as json_file:
  json.dump(jsonData, json_file, indent = 4, sort_keys=True)


