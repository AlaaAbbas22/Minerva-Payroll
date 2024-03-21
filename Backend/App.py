import os
from flask import Flask, request, session
from flask_session import Session
from flask_cors import CORS
from datetime import timedelta
from uuid import uuid4
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
import datetime



app = Flask(__name__)

app.config["SECRET_KEY"] = 'os.environ["secret-key"]'
app.config["SESSION_TYPE"] = 'filesystem'
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='None',
)
app.permanent_session_lifetime = timedelta(days=1000)
CORS(app, supports_credentials=True)
Session(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://trial_1ubv_user:bgUlmHwqX8MTM2kJuDT6VkvqqLAQDLFg@dpg-cntau8un7f5s73f81650-a.oregon-postgres.render.com/trial_1ubv'#os.environ["db"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)





class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    session_ids = relationship('Session_Id', backref='Users', lazy=True)

class Session_Id(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(50))
    email_session = db.Column(db.String(120), db.ForeignKey('users.email'), nullable=False)


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
  "private_key": os.environ["private_key"],
  "client_email": os.environ["client_email"],
  "client_id": os.environ["client_id"],
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/alaa-590%40mipay-415819.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
print(os.environ["private_key"])
print(os.environ["private_key_id"])
print(os.environ["client_email"])
print(os.environ["client_id"])
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
    return 1

@app.route("/ytdintern", methods=["GET"])
def ytd():
    session_id1 = Session_Id.query.filter_by(session_id=str(session["uid"])).first()
    email = session_id1.email_session
    spreadsheet = spreadsheetgetter()
    ytd_sheet = spreadsheet.worksheet("YTD Analysis")
    cell = ytd_sheet.find(email,in_column=3)
    row = ytd_sheet.row_values(cell.row)[0:23]
    return {"result": row}

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
        row = PP_sheet.row_values(cell.row)[2:4]
        print(row)
        return {"result": row,"start":str(start_date.strftime('%m/%d/%Y')), "end":str(end_date.strftime('%m/%d/%Y'))}
    except:
        print("Error in getting sheet")
        return {"result": [0,0]}


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
    for i in range(len(row_data)):
        personal_information[row_title[i]] = row_data[i]
    print(personal_information)
    return personal_information

@app.route('/login', methods = ["POST"])
def login():
    user = Users.query.filter_by(email=request.json["email"], password= request.json["password"]).first()
    if user:
        uid = uuid4()
        user.session_ids.append(Session_Id(session_id = uid, email_session= user))
        db.session.commit()
        session["uid"] = str(uid)
        return intern_profile(request.json["email"])
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
        #db.session.add(Users(email= "no@uni.minerva.edu", password =" 134", session_id= uuid4()))
        #db.session.commit()
    app.run(debug = True, port= 8000)