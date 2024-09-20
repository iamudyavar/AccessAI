from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api")
def get_info():
    return {"message": "Information from the backend"}
