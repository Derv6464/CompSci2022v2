from Google import Create_Service
import pandas as pd

CLIENT_SECRET_FILE = 'client_secret.json'
API_NAME = 'drive'
API_VERSION = 'v3'
SCOPES = ['https://www.googleapis.com/auth/drive']

service = Create_Service(CLIENT_SECRET_FILE,API_NAME,API_VERSION,SCOPES)

folder_id = 'my-drive'

query = f"parents = '{folder_id}'"
response = service.files().list(q=query).execute()
files = response.get('files')
nextPageToken = response.get('nextPageToken')

while nextPageToken:
    response = service.files().list(q=query,pageToken=nextPageToken).execute()
    files.extend(response.get('files'))
    nextPageToken = response.get('nextPageToken')
    
df = pd.DataFrame(files)
print(df)

print(files)
filename = 'testPhoto.jpg'
for i in files:
    if i['name'] == filename:
        print(i['name'])
        idSend = i['id']
        
