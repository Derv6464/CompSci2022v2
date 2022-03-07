from datetime import datetime
#from picamera import PiCamera
from time import sleep
import requests
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
from Google import Create_Service

#camera = PiCamera()
filename = "{0:%Y}-{0:%m}-{0:%d},{0:%H}.{0:%M}.{0:%S}".format(datetime.now())
date = "{0:%Y}-{0:%m}-{0:%d}".format(datetime.now())
time = "{0:%H}.{0:%M}.{0:%S}".format(datetime.now())
baseUrl = ""

gauth = GoogleAuth()
gauth.LocalWebserverAuth()
drive = GoogleDrive(gauth)

def takePic(filename):
    camera.start_preview()
    sleep(2)
    camera.capture('/home/pi/Documents/compSci2022/CompSci2022-main/pictures/'+filename+'.jpg')
    camera.stop_preview()
    
def dataToGlitch(time,date,driveID,idSend):
    myobj = {'field':time,'value':date,'value':idSend}
    print(time,date)
    baseurl = 'https://compsci2022.glitch.me/addData'
    x = requests.post(baseurl,data = myobj)
    print(x.text)

def dataToDrive(filename):
    upload_file = filename +".jpg"
    gfile = drive.CreateFile({'parents': [{'id': '1NCFFaZNpje1TVBFKee4ATiz0wLzLRJPD'}]})
    gfile.SetContentFile(upload_file)
    gfile.Upload()
    
def getDriveID(filename):
    CLIENT_SECRET_FILE = 'client_secret.json'
    API_NAME = 'drive'
    API_VERSION = 'v3'
    SCOPES = ['https://www.googleapis.com/auth/drive']

    service = Create_Service(CLIENT_SECRET_FILE,API_NAME,API_VERSION,SCOPES)

    folder_id = '1NCFFaZNpje1TVBFKee4ATiz0wLzLRJPD'

    query = f"parents = '{folder_id}'"
    response = service.files().list(q=query).execute()
    files = response.get('files')
    nextPageToken = response.get('nextPageToken')

    while nextPageToken:
        response = service.files().list(q=query,pageToken=nextPageToken).execute()
        files.extend(response.get('files'))
        nextPageToken = response.get('nextPageToken')
    
    for i in files:
        if i['name'] == filename:
            print(i['name'])
            idSend = i['id']
    return(idSend)


    
#sending file name/time to database
# when motion detected:
    #led.on()
    filename = "{0:%Y}-{0:%m}-{0:%d},{0:%H}.{0:%M}.{0:%S}".format(datetime.now())
    date = "{0:%Y}-{0:%m}-{0:%d}".format(datetime.now())
    time = "{0:%H}.{0:%M}.{0:%S}".format(datetime.now())
    #takePic(filename)
    #dataToDrive(filename)
   # idSend = getDriveID(filename)
   # dataToGlitch(time,date,idSend)
    #LED.off()
    
    
