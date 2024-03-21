import gspread
from google.oauth2.service_account import Credentials

scopes = [
    "https://www.googleapis.com/auth/spreadsheets"
]
cred = Credentials.from_service_account_file("e:/MiPay/Credentials.json", scopes=scopes)
client = gspread.authorize(cred)
SPREADSHEET_ID = "1rhLtwfyrqGNReC-BqZoUWLUYodTcWXBii1uZCkekU5U"
spreadsheet = client.open_by_key(SPREADSHEET_ID)
ytd = spreadsheet.worksheet("YTD Analysis")
print(ytd.acell("A1").value)