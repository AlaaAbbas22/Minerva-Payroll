import os
from flask import Flask, request, session
from flask_session import Session
from flask_cors import CORS
from datetime import timedelta
from uuid import uuid4
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import datetime
#from dotenv import load_dotenv

#load_dotenv()




app = Flask(__name__)

app.config["SECRET_KEY"] = os.environ["secret-key"]
app.config["SESSION_TYPE"] = 'filesystem'
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='None',
)
app.permanent_session_lifetime = timedelta(days=1000)
CORS(app, supports_credentials=True)
Session(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["db"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)





class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    session_ids = relationship('Session_Id', backref='Users', lazy=True)
    manager = db.Column(db.String(255), nullable=False)

class Session_Id(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(50))
    email_session = db.Column(db.String(120), db.ForeignKey('users.email'), nullable=False)
    manager = db.Column(db.String(255), nullable=False)



session_ids = {}

import gspread
from google.oauth2.service_account import Credentials

scopes = [
    "https://www.googleapis.com/auth/spreadsheets"
]
creds= {
  "type": "service_account",
  "project_id": "mipay-415819",
  "private_key_id": os.environ["private_key_id"],
  "private_key": "-----BEGIN PRIVATE KEY-----\n"+os.environ["f1"]+"\n"+os.environ["f2"]+"\n"+os.environ["f3"]+"\n"+os.environ["f4"]+"\n"+os.environ["f5"]+"\n"+os.environ["f6"]+"\n"+os.environ["f7"]+"\n"+os.environ["f8"]+"\n"+os.environ["f9"]+"\n"+os.environ["f10"]+"\n"+os.environ["f11"]+"\n"+os.environ["f12"]+"\n"+os.environ["f13"]+"\n"+os.environ["f14"]+"\n"+os.environ["f15"]+"\n"+os.environ["f16"]+"\n"+os.environ["f17"]+"\n"+os.environ["f18"]+"\n"+os.environ["f19"]+"\n"+os.environ["f20"]+"\n"+os.environ["f21"]+"\n"+os.environ["f22"]+"\n"+os.environ["f23"]+"\n"+os.environ["f24"]+"\n"+os.environ["f25"]+"\n"+os.environ["f26"]+"\n-----END PRIVATE KEY-----\n",
  "client_email": os.environ["client_email"],
  "client_id": os.environ["client_id"],
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/alaa-590%40mipay-415819.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

cred = Credentials.from_service_account_info(creds, scopes=scopes)
client = gspread.authorize(cred)
SPREADSHEET_ID = "1rhLtwfyrqGNReC-BqZoUWLUYodTcWXBii1uZCkekU5U"



def spreadsheetgetter():
    return client.open_by_key(SPREADSHEET_ID)
    
@app.route("/getcurrentpp", methods=["GET"])
def get_current_PP():
    return {"result":current_PPgetter()}

@app.route("/dummy", methods=["GET"])
def dummy():
    return {"result":1}

@app.route("/ytdintern", methods=["GET"])
def ytd():
    session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
    email = session_id1.email_session
    spreadsheet = spreadsheetgetter()
    ytd_sheet = spreadsheet.worksheet("YTD Analysis")
    cell = ytd_sheet.find(email,in_column=3)
    row = ytd_sheet.row_values(cell.row)[0:23]
    return {"result": row}

@app.route("/ytdmanager", methods=["GET"])
def managerytd():
    session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"]), manager="manager").first()
    email = session_id1.email_session
    spreadsheet = spreadsheetgetter()
    ytd_sheet = spreadsheet.worksheet("YTD Analysis")
    print(email)
    cells = ytd_sheet.findall(email, in_column=31)
    interns = []
    for cell in cells:
        interns.append(ytd_sheet.row_values(cell.row)[0:23])
    return {"result": interns}

@app.route("/gettimecard", methods=["POST"])
def gettimecard():
    spreadsheet = spreadsheetgetter()
    start_date = datetime.datetime(2023,8,26)
    start_date += datetime.timedelta(days=14)*int(int(request.json["PP"][2:])-1)
    end_date = start_date + datetime.timedelta(days=13)
    try:
        session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
        email = session_id1.email_session
        print(email)
        PP_sheet = spreadsheet.worksheet(request.json["PP"])
        cell = PP_sheet.find(email, in_column=2)
        row = PP_sheet.row_values(cell.row)
        print(row)
        return {"result": row[2:4],"manager_approval": row[8],"tasks": row[6],"start":str(start_date.strftime('%m/%d/%Y')), "end":str(end_date.strftime('%m/%d/%Y'))}
    except:
        print("Error in getting sheet")
        return {"result": [0,0]}

@app.route("/gettimecardmanagers", methods=["POST"])
def gettimecardmanagers():
    spreadsheet = spreadsheetgetter()

    try:
        session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"]), manager="manager").first()
        
        email = session_id1.email_session
        print(request.json["PP"])
        PP_sheet = spreadsheet.worksheet(request.json["PP"])
        
        cells = PP_sheet.findall(email, in_column=11)
        names = []
        emails = []
        for cell in cells:
            row = PP_sheet.row_values(cell.row)
            names.append(row[0])
            emails.append(row[1])
            #interns.append({row[0]:{"result": row[2:4],"manager_approval": row[8],"tasks": row[6],"start":str(start_date.strftime('%m/%d/%Y')), "end":str(end_date.strftime('%m/%d/%Y'))}})
        return {"names":names,"emails":emails}
    except:
        print("Error in getting sheet")
        return {"result": [0,0]}
@app.route("/managercardgetter", methods=["POST"])
def gettimecardselected():
    spreadsheet = spreadsheetgetter()
    start_date = datetime.datetime(2023,8,26)
    start_date += datetime.timedelta(days=14)*int(int(request.json["PP"][2:])-1)
    end_date = start_date + datetime.timedelta(days=13)
    deadline = end_date + datetime.timedelta(days=3)
    print(deadline)
    session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
    email = session_id1.email_session
    PP_sheet = spreadsheet.worksheet(request.json["PP"])
    cell = PP_sheet.find(request.json["intern"], in_column=2)
    row = PP_sheet.row_values(cell.row)
    if email == row[10]:
        return {"result": row[2:4],"manager_approval": row[8],"deadline":str(deadline.strftime('%m/%d/%Y')),"managercomments": row[9],"tasks": row[6],"start":str(start_date.strftime('%m/%d/%Y')), "end":str(end_date.strftime('%m/%d/%Y'))}
    else:
        return {"status":"Unauthorized"}

def current_PPgetter():
    spreadsheet = spreadsheetgetter()
    config_sheet = spreadsheet.worksheet("Config")
    current_PP = config_sheet.cell(4, 2).value 
    return int(current_PP)

@app.route("/updatetimecard", methods=["POST"])
def updatetimecard():
    spreadsheet = spreadsheetgetter()
    current_PP = current_PPgetter()
    intended_PP = int(request.json["PP"][2:])
    print(current_PP, intended_PP)
    try:
        if intended_PP == current_PP:
            session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
            email = session_id1.email_session
            PP_sheet = spreadsheet.worksheet(request.json["PP"])
            
            PP_weeks = request.json["Weeks"]
            print(PP_weeks)
            cell = PP_sheet.find(email, in_column=2)
            
            PP_sheet.update_cell(cell.row, 3, PP_weeks[0])
            PP_sheet.update_cell(cell.row, 4, PP_weeks[1])
            PP_sheet.update_cell(cell.row, 7, request.json["tasks"])
            print(request.json["tasks"])
            return {"result": "Done!"}
        else:
            return {"result": "Unauthorized!"}
    except:
        return {"result": [0,0]}
    

@app.route("/manager_update_timecard", methods=["POST"])
def updatetimecardmanager():
    spreadsheet = spreadsheetgetter()
    current_PP = current_PPgetter()
    intended_PP = int(request.json["PP"][2:])
    print(current_PP, intended_PP)
    try:
        if intended_PP == current_PP-1:
            session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
            email = session_id1.email_session
            PP_sheet = spreadsheet.worksheet(request.json["PP"])
            
            cell = PP_sheet.find(request.json["intern"], in_column=2)
            
            row = PP_sheet.row_values(cell.row)
            if email == row[10]:
                PP_weeks = request.json["Weeks"]
                PP_sheet.update_cell(cell.row, 3, PP_weeks[0])
                PP_sheet.update_cell(cell.row, 4, PP_weeks[1])
                PP_sheet.update_cell(cell.row, 9, request.json["approval"])
                PP_sheet.update_cell(cell.row, 10, request.json["managercomments"])
            return {"result": "Done!"}
        else:
            return {"result": "Unauthorized!"}
    except:
        return {"result": [0,0]}


#@app.route('/internprofile', methods = ["GET"])
def intern_profile(email):
    spreadsheet = spreadsheetgetter()
    most_recent_sheet= spreadsheet.worksheet("PP"+str(current_PPgetter()))
    cell = most_recent_sheet.find(email,in_column=2)
    row_data = most_recent_sheet.row_values(cell.row)
    row_title= most_recent_sheet.row_values(3)
    personal_information = {}
    print(row_title,row_data)
    for i in [0,1,7,10,14,15,19]:
        personal_information[row_title[i]] = row_data[i]
    return personal_information

def manager_profile(email):
    spreadsheet = spreadsheetgetter()
    most_recent_sheet= spreadsheet.worksheet("PP"+str(current_PPgetter()))
    cell = most_recent_sheet.find(email,in_column=11)
    row_data = most_recent_sheet.row_values(cell.row)
    row_title= most_recent_sheet.row_values(3)
    personal_information = {}
    for i in [7,10,14]:
        print(row_title[i],row_data[i])
        personal_information[row_title[i]] = row_data[i]
    print(personal_information)
    return personal_information

@app.route('/login', methods = ["POST"])
def login():
    user = Users.query.filter_by(email=request.json["email"], password= request.json["password"]).first()
    if user:
        
        print(user.manager)
        if user and (user.manager == "intern"):
            uid = uuid4()
            user.session_ids.append(Session_Id(session_id = uid, email_session= user,manager =user.manager))
            db.session.commit()
            session["uid"] = str(uid)
            data = intern_profile(request.json["email"])
            data["manager"] = "intern"
            data["result"] = "Working"
            print(data)
            return data
        elif user and (user.manager == "manager"):
            uid = uuid4()
            user.session_ids.append(Session_Id(session_id = uid, email_session= user,manager =user.manager))
            db.session.commit()
            session["uid"] = str(uid)
            data= manager_profile(user.email)
            data["manager"] = "manager"
            print(data)
            return data
    else:
        return {"result": "Not found"}

@app.route('/logout', methods = ["POST"])
def logout():
    try:  
        current_id = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
        db.session.delete(current_id)
        db.session.commit()
        del session["uid"]
    except:
        ...
    return {"res":200}




if __name__ == '__main__': 
    with app.app_context():
        db.create_all()
        #db.session.add(Users(email= "ben.wilkoff@minerva.edu", password ="Minerva123!", manager="manager"))
        #db.session.commit()
    app.run(debug = True, port= 8000)