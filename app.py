import pandas as pd
import numpy as np
import os
from flask import Flask, render_template, redirect, request, jsonify, send_from_directory
from sqlalchemy import create_engine, func
from bs4 import BeautifulSoup
import requests

is_heroku = False
if 'IS_HEROKU' in os.environ:
    is_heroku = True
if is_heroku == False:
    from config import remote_db_endpoint, remote_db_port, remote_db_user, remote_db_pwd, remote_db_name
else:
    remote_db_endpoint = os.environ.get('remote_db_endpoint')
    remote_db_port = os.environ.get('remote_db_port')
    remote_db_user = os.environ.get('remote_db_user')
    remote_db_pwd = os.environ.get('remote_db_pwd')
    remote_db_name = os.environ.get('remote_db_name')

app = Flask(__name__)
cloud_engine = create_engine(f"postgresql://{remote_db_user}:{remote_db_pwd}@{remote_db_endpoint}:{remote_db_port}/{remote_db_name}")

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')
#Map/DashBoard
@app.route("/")
def home():
    return render_template("index.html")

#African - Indicators

@app.route("/ultimate")
def ultimate():
    conn = cloud_engine.connect()
    query = 'SELECT * FROM ultimate'
    results_df = pd.read_sql(query, con=conn)
    results_json = results_df.to_json(orient='records')
    conn.close()
    return results_json



@app.route("/africa")
def africa():
    conn = cloud_engine.connect()
    query = 'SELECT * FROM africa_indicators'
    results_df = pd.read_sql(query, con=conn)
    results_json = results_df.to_json(orient='records')
    conn.close()
    return results_json

#Conflict 
@app.route("/conflict")
def conflict():
    conn = cloud_engine.connect()
    query = 'SELECT * FROM conflict'
    results_df = pd.read_sql(query, con=conn)
    results_json = results_df.to_json(orient='records')
    conn.close()
    return results_json

#Economic Numbers
@app.route("/economy")
def economy():
    conn = cloud_engine.connect()
    query = 'SELECT * FROM economy'
    results_df = pd.read_sql(query, con=conn)
    results_json = results_df.to_json(orient='records')
    conn.close()
    return results_json

#Education
@app.route("/education")
def education():
    conn = cloud_engine.connect()
    query = 'SELECT * FROM education'
    results_df = pd.read_sql(query, con=conn)
    results_json = results_df.to_json(orient='records')
    conn.close()
    return results_json

#Ethnicity
@app.route("/ethnicity")
def ethnicity():
    conn = cloud_engine.connect()
    query = 'SELECT * FROM ethnicity'
    results_df = pd.read_sql(query, con=conn)
    results_json = results_df.to_json(orient='records')
    conn.close()
    return results_json

#Fatalities
@app.route("/fatalities")
def fatalities():
    conn = cloud_engine.connect()
    query = 'SELECT * FROM fatalities'
    results_df = pd.read_sql(query, con=conn)
    results_json = results_df.to_json(orient='records')
    conn.close()
    return results_json

#Government
@app.route("/government")
def government():
    conn = cloud_engine.connect()
    query = 'SELECT * FROM government'
    results_df = pd.read_sql(query, con=conn)
    results_json = results_df.to_json(orient='records')
    conn.close()
    return results_json

#Population
@app.route("/population")
def population():
    conn = cloud_engine.connect()
    query = 'SELECT * FROM population'
    results_df = pd.read_sql(query, con=conn)
    results_json = results_df.to_json(orient='records')
    conn.close()
    return results_json


@app.route("/api/data/getticker/<country>")
def ticker(country):
    url = f"https://news.google.com/rss/search?q={country}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'xml')
    results = soup.find_all('item')
    titles = []
    links = []
    dates = []

    for result in results:
        try:
            title = result.title.text
            link = result.link.text
            date = result.pubDate.text

            if (title and link and date):
                dates.append(date)
                titles.append(title)
                links.append(link)
        except AttributeError as e:
            print(e)
    news = {'Title' : titles, 'Link' : links, 'Date' : dates}

    return (jsonify(news))
#Predict

# @app.route("/predict/", methods = ['GET', 'POST'])
# def predict():
#     data = request.get_data()   

if __name__ == '__main__':
    app.run(debug=True)