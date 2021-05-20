from flask import Flask,jsonify,request,make_response
import pymysql
import jwt 
import datetime
from functools import wraps
from flask_cors import CORS
import pandas as pd
import numpy as np
import json

rat = pd.read_csv("rating2_1.csv")
rat.drop('Unnamed: 0',axis=1,inplace=True)
books = pd.read_csv("booklist_1.csv")
books.drop("Unnamed: 0",axis=1,inplace=True)
mat = pd.read_csv("mat_1.csv")
mat.drop("Unnamed: 0",axis=1,inplace=True)

class create_dict(dict): 
  
    # __init__ function 
    def __init__(self): 
        self = dict() 
          
    # Function to add key:value 
    def add(self, key, value): 
        self[key] = value

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = "thisisthesecretkey"
t=""

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        # return 401 if token is not passed
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401
   
        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({
                'message' : 'Token is invalid !!'
            }), 401
        # returns the current logged in users contex to the routes
        return  f(*args, **kwargs)
   
    return decorated

db = pymysql.connect(host="localhost", database="test", user="root", passwd="")


@app.route('/unprotected')
def unprotected():
    return jsonify({'message':"Unprotected"})

@app.route('/protected')
@token_required
def protected():
    return jsonify({'message':"Protected"})

@app.route('/login',methods=['POST'])
def login():
    cursor = db.cursor()
    auth = request.json
    userid = auth['userid']
    password = auth['password']
    if userid==None or password==None:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Logoin required"'})
    cursor.execute(" SELECT userid,password FROM registration WHERE userid=%s AND password=%s",(userid,password))
    reg = cursor.fetchall()
    if (reg):
    	print(reg)
    	token = jwt.encode({"user":userid,'exp':datetime.datetime.utcnow()+datetime.timedelta(minutes=30)},app.config['SECRET_KEY'],algorithm="HS256")
    	print(token)
    	return jsonify({'token':token.decode('UTF-8')})
    else:
    	return make_response('Could not verify',401,{'WWW-Authenticate':'Basic realm="Logoin required"'})



def matfat(id):
  r1 = np.array(rat.iloc[id-1])
  dummy = pd.DataFrame(columns=['org_rat','rating','book_id','name','book_isbn','image','category'])
  for i in range(len(r1)):
    l=[mat[mat.columns[i]][3],r1[i],mat.columns[i],books.loc[books['book_id']==int(mat.columns[i])]['name'].to_list()[0],int(books.loc[books['book_id']==int(mat.columns[i])]['book_isbn'].to_list()[0]),books.loc[books['book_id']==int(mat.columns[i])]['image'].to_list()[0],books.loc[books['book_id']==int(mat.columns[i])]['category'].to_list()[0]]
    dummy.loc[len(dummy)]=l
  dummy = dummy.sort_values('rating',ascending=False)  
  dummy = dummy.head(10)  
  json = dummy.to_json(orient='records')
  return json
  
  
@app.route("/mat/<int:id>")
@token_required
def home(id):
  json = matfat(id)
  return json



@app.route("/books",methods=['GET'])
def get_books():
    cursor = db.cursor()
    cursor.execute(" SELECT * FROM books")
    reg = cursor.fetchall()
    mydict= create_dict()
    for row in reg:
        mydict.add(row[3],({"book_name":row[0],"book_isbn":row[1],"book_count":row[2]}))
    book_json = json.dumps(mydict, indent=2, sort_keys=True)
    return book_json


@app.route("/books/updateCount",methods=['PUT'])
def update_count():
    cursor = db.cursor()
    book = request.json
    b_name = book['book_name']
    b_count = book['book_count']
    cursor.execute("SELECT book_count,book_isbn from books WHERE book_name=%s",[b_name])
    b = cursor.fetchall()
    print(b)
    for i in b:
        count = i[0]
        isbn = i[1]
    if count==0:
        cursor.execute("SELECT * FROM notify WHERE book_name=%s AND book_isbn=%s",[b_name,isbn])
        b = cursor.fetchall()
        if(b):
            cursor.execute("DELETE from notify WHERE book_name=%s AND book_isbn=%s",[b_name,isbn])
            db.commit()
        cursor.execute("INSERT INTO notify (book_name,book_isbn,decide) VALUES (%s,%s,%s)",[b_name,isbn,"YES"])
        db.commit()
    if b_count==0:
        cursor.execute("SELECT * FROM notify WHERE book_name=%s AND book_isbn=%s",[b_name,isbn])
        b = cursor.fetchall()
        if(b):
            cursor.execute("INSERT INTO notify (book_name,book_isbn,decide) VALUES (%s,%s,%s)",[b_name,isbn,"NO"])
            db.commit()
    cursor.execute("UPDATE books SET book_count=%s WHERE book_name=%s",[b_count,b_name])
    db.commit()
    cursor.close()
    return jsonify({'message':"successfully updated"})

@app.route("/books/subscribe",methods=['POST'])
def subscribe_book():
    cursor = db.cursor()
    book = request.json
    userid = book['userid']
    book_name = book['book_name']
    book_isbn = book['book_isbn']
    cursor.execute("SELECT * FROM subscription WHERE userid=%s AND book_name=%s AND book_isbn=%s",[userid,book_name,book_isbn])
    sub = cursor.fetchall()
    if(sub):
        return jsonify({'message':'Already subscribed'})
    cursor.execute("INSERT INTO subscription (userid, book_name,book_isbn) VALUES (%s,%s,%s)",[userid,book_name,book_isbn])
    db.commit()
    cursor.close()
    return jsonify({'message':"successfully updated"})


@app.route("/books/getNotifications/<int:id>",methods=['GET'])
@token_required
def getNotifications(id):
    cursor = db.cursor()
    cursor.execute("SELECT userid,subscription.book_name,subscription.book_isbn,notify.time,notify.Decide FROM subscription JOIN notify ON subscription.book_isbn = notify.book_isbn WHERE subscription.time < notify.time AND userid=%s",[id])
    noti = cursor.fetchall()
    dic = {}
    l = []
    for row in noti:
        l.append({"userid":row[0],"book_name":row[1],"book_isbn":row[2],"time":str(row[3]),"Decide":row[4]})
    book_json = json.dumps(l, indent=2, sort_keys=True)
    cursor.close()
    return book_json

@app.route("/books/delNotification/<int:userid>/<string:book_name>",methods=['DELETE'])
@token_required
def delNotification(userid,book_name):
    cursor = db.cursor()
    cursor.execute("DELETE FROM subscription WHERE userid=%s AND book_name=%s",[userid,book_name])
    db.commit()
    cursor.close()
    return jsonify({'message':'successfully deleted'})


@app.route("/reviews",methods=['POST'])
@token_required
def reviewBook():
    book = request.json
    userid = book['userid']
    b_name = book['book_name']
    comment = book['comment']
    lesson = book['lesson']
    cursor = db.cursor()
    cursor.execute("INSERT INTO comments (userid,book_name,lesson,comment) VALUES (%s,%s,%s,%s)",[userid,b_name,lesson,comment])
    db.commit()
    cursor.close()
    return jsonify({'message':'comment successfully added'})

@app.route("/reviews/<string:b_name>",methods=['GET'])
def viewReviewBook(b_name):
    cursor = db.cursor()
    cursor.execute("SELECT name,lesson,comment,time FROM comments,registration WHERE comments.userid = registration.userid AND book_name=%s",[b_name])
    comment = cursor.fetchall()
    l=[]
    for row in comment:
        l.append({'username':row[0],'lesson':row[1],'comment':row[2],'time':str(row[3])})
    book_json = json.dumps(l, indent=2, sort_keys=True)
    cursor.close()
    return book_json


@app.route("/books/getNotifications/<int:id>/count")
@token_required
def notificationCount(id):
    cursor = db.cursor()
    cursor.execute("SELECT count(subscription.book_name) FROM subscription JOIN notify ON subscription.book_isbn = notify.book_isbn WHERE subscription.time < notify.time AND userid=%s",[id])
    r = cursor.fetchall()
    for row in r:
        c = {"count":row[0]}
    cursor.close()
    return c




if __name__ == '__main__':
    app.run(debug=True)