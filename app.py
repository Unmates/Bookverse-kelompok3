import os
from os.path import join, dirname
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, request, redirect, url_for
from pymongo import MongoClient
from datetime import datetime, timedelta
import jwt
import hashlib
import re
from werkzeug.utils import secure_filename
from bson import json_util

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME =  os.environ.get("DB_NAME")

app = Flask(__name__)

MONGODB_CONNECTION_STRING = "mongodb://farelli:shakti@ac-heg7ipj-shard-00-00.nftj3pv.mongodb.net:27017,ac-heg7ipj-shard-00-01.nftj3pv.mongodb.net:27017,ac-heg7ipj-shard-00-02.nftj3pv.mongodb.net:27017/?ssl=true&replicaSet=atlas-lc8727-shard-0&authSource=admin&retryWrites=true&w=majority"
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client.bookverse

SECRET_KEY = "Gramed"
TOKEN_KEY = 'mytoken'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/sign_in', methods=["POST"])
def sign_in():
    username_receive = request.form.get('username_give')
    password_receive = request.form.get('password_give')
    pw_hash = hashlib.sha256(password_receive.encode("utf-8")).hexdigest()
    result = db.login.find_one({
        "username": username_receive,
        "password": pw_hash,
    })
    if result:
        payload = {
            'id': username_receive,
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        return jsonify(
            {
                "result": "success",
                "token": token,
                "role": result["role"],
                "username": result["username"]
            }
        )

    else:
        return jsonify(
            {
                "result": "fail",
                "msg": "We could not find a user with that id/password combination",
            }
        )

@app.route('/check_id', methods=['POST'])
def check_id():
    username_receive = request.form['username_give']
    exists = bool(db.login.find_one({'username': username_receive}))
    return jsonify({'result': 'success', 'exists': exists})

@app.route('/check_judul', methods=['POST'])
def check_judul():
    judul_receive = request.form['judul_give']
    exists = bool(db.book.find_one({'JudulBuku': judul_receive}))
    return jsonify({'result': 'success', 'exists': exists})

@app.route('/registuser')
def registuser():
    return render_template('regisuser.html')

@app.route('/ruser', methods=["POST"])
def ruser():
    email_receive = request.form.get('email')
    username_receive = request.form.get('username_give')
    password_receive = request.form.get('password_give')
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    doc = {
        'email': email_receive,
        'username': username_receive,
        'password': password_hash,
        'nohp': '',
        'alamat':'',
        'profile_default': 'profile/profil_default.jpg',
        'role': 'user'
    }
    db.login.insert_one(doc)
    return jsonify({'result': 'success'})

@app.route('/adminpage')
def adminpage():
    return render_template('admin.html')

@app.route('/deletebook', methods=['POST'])
def deletebook():
    judul = request.form.get('judul_give')
    buku = db.book.find_one({"JudulBuku": judul}, {"_id": False})
    url = buku["URL"]
    cover = buku["Cover"]
    os.remove(f"static/{cover}")
    db.book.delete_one({'JudulBuku': judul})
    db.favorite.delete_many({'JudulBuku': url})
    db.cart.delete_many({'JudulBuku': url})
    return jsonify({
        'result': 'success',
        'msg': f'the book, {judul}, was deleted',
    })

@app.route('/admin')
def admin():
    return render_template('regisadmin.html')

@app.route('/radmin', methods=["POST"])
def radmin():
    email_receive = request.form.get('email')
    nomor_receive = request.form.get('nomor_give')
    username_receive = request.form.get('username_give')
    password_receive = request.form.get('password_give')
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    doc = {
        'email': email_receive,
        'username': username_receive,
        'password': password_hash,
        'nohp': nomor_receive,
        'alamat':'',
        'profile_default': 'profile/profil_default.jpg',
        'role': 'admin'
    }
    db.login.insert_one(doc)
    return jsonify({'result': 'success'})

@app.route('/buku')
def buku():
    user_receive=request.cookies.get("username")
    book_list = list(db.book.find({}, {'_id': False}))
    user_list = list(db.login.find({'role': 'user'}, {'_id': False}))
    favorite_list = list(db.favorite.find({'username': user_receive}, {'_id': False}))
    cart_list = list(db.cart.find({'username': user_receive}, {'_id': False}))
    return jsonify({
        'daftarbuku': book_list, 
        'daftaruser': user_list, 
        'daftarfavorite':favorite_list, 
        'daftarkeranjang': cart_list
        })

@app.route('/tambah')
def tambah():
    return render_template('tambahbuku.html')

@app.route("/tambahbuku", methods=["POST"])
def tambahbuku():
    judul_receive = request.form.get('judul_give')
    deskripsi_receive = request.form.get('deskripsi_give')
    harga_receive = request.form.get('harga_give')
    kategori_receive = request.form.get('kategori_give')
    bahasa_receive = request.form.get('bahasa_give')
    url_receive = request.form.get('url_give')

    today = datetime.now()
    mytime = today.strftime('%Y-%m-%d-%H-%M-%S')

    file = request.files["gambar_give"]
    filename = secure_filename(file.filename)
    extension = filename.split(".")[-1]
    cover = f"cover/{url_receive}.{extension}"
    file.save("./static/" + cover)

    doc = {
        'Date': mytime,
        'JudulBuku': judul_receive,
        'Deskripsi': deskripsi_receive,
        'Harga': f'Rp.{harga_receive}',
        'Kategori': kategori_receive,
        'Bahasa': bahasa_receive,
        'URL': url_receive,
        'Cover': cover
    }

    db.book.insert_one(doc)
    return jsonify({'msg':'Input Buku Berhasil!'})

@app.route("/profile")
def profile():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        username = payload.get('id')
        user_info = db.login.find_one({"username": username}, {"_id": False})
        return render_template("profile.html", user_info=user_info)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("login"))

@app.route('/update_profile', methods=["POST"])
def update_profile():
    token_receive = request.cookies.get(TOKEN_KEY)
    try:
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("id")
        email_receive = request.form.get("email_give")
        nomor_receive = request.form.get("nomor_give")
        alamat_receive = request.form.get("alamat_give")
        today = datetime.now()
        mytime = today.strftime('%Y-%m-%d-%H-%M-%S')
        new_doc = {
            'email': email_receive,
            'nohp': nomor_receive,
            'alamat': alamat_receive
        }
        if "file_give" in request.files:
            file = request.files.get("file_give")
            filename = secure_filename(file.filename)
            extension = filename.split(".")[-1]
            file_path = f"profile/{username}-{mytime}.{extension}"
            file.save("./static/" + file_path)
            new_doc['profile_default'] = file_path
        db.login.update_one({"username": payload["id"]}, {"$set": new_doc})
        return jsonify({"result": "success", "msg": "Profile updated!"})
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("/"))

@app.route('/favorite')
def favorite():
    return render_template('favorite.html')

@app.route('/showfav')
def showfav():
    user_receive=request.cookies.get("username")
    favorite_list = list(db.favorite.find({'username': user_receive}, {'_id': False}))
    cart_list = list(db.cart.find({'username': user_receive}, {'_id': False}))
    book_list=[]
    for i in favorite_list:
        judulfav= i["JudulBuku"]
        book_find = db.book.find_one({"URL": judulfav}, {"_id": False})
        book_list.append(book_find)
    return jsonify({'daftarbuku': book_list, 'daftarfavorite':favorite_list, 'daftarkeranjang': cart_list})

@app.route('/fav', methods=["POST"])
def fav():
    judul_receive = request.form.get('judul_give')
    username_receive = request.form.get('username_give')
    action_receive = request.form.get('action_give')
    doc = {
        'JudulBuku': judul_receive,
        'username': username_receive,
        'status': 'favorited'
    }
    if action_receive == "favorited":
        db.favorite.insert_one(doc)
        return jsonify({'result': 'success', 'msg':action_receive})
    else:
        db.favorite.delete_one(doc)
        return jsonify({'result': 'success', 'msg':"Removed from favorite"})

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/showcart')
def showcart():
    user_receive=request.cookies.get("username")
    cart_list = list(db.cart.find({'username': user_receive}, {'_id': False}))
    book_list=[]
    for i in cart_list:
        judulfav= i["JudulBuku"]
        book_find = db.book.find_one({"URL": judulfav}, {"_id": False})
        book_list.append(book_find)
    return jsonify({'daftarbuku': book_list, 'daftarkeranjang':cart_list})

@app.route('/addcart', methods=["POST"])
def addcart():
    judul_receive = request.form.get('judul_give')
    username_receive = request.form.get('username_give')
    action_receive = request.form.get('action_give')
    doc = {
        'JudulBuku': judul_receive,
        'username': username_receive,
        'status': 'dalam keranjang'
    }
    if action_receive == "Added to cart":
        db.cart.insert_one(doc)
        return jsonify({'result': 'success', 'msg':action_receive})
    else:
        db.cart.delete_one(doc)
        return jsonify({'result': 'success', 'msg':"Removed from cart"})
    
@app.route('/checkout', methods=['POST'])
def checkout():
    username = request.form.get('username_give')
    db.cart.delete_many({'username': username})
    return jsonify({
        'result': 'success',
        'msg': 'Anda berhasil melakukan check out',
    })

@app.route('/detail/<book>')
def detail(book):
    book_detail = db.book.find_one({"URL": book}, {"_id": False})
    return render_template('detail.html', book_detail=book_detail)

@app.route('/edit/<book>')
def editbook(book):
    book_edit = db.book.find_one({"URL": book}, {"_id": False})
    return render_template('editbook.html', book_edit=book_edit)

@app.route("/editcover", methods=["POST"])
def editcover():
    waktu = request.form.get('waktu_give')
    date = db.book.find_one({"Date": waktu}, {"_id": False})
    coverold = date["Cover"]
    namafile = date["URL"]
    os.remove(f"static/{coverold}")

    file = request.files["gambar_update"]
    filename = secure_filename(file.filename)
    extension = filename.split(".")[-1]
    cover = f"cover/{namafile}.{extension}"
    file.save("./static/" + cover)

    new_doc = {
        'Cover': cover
    }
    db.book.update_one({"Date": waktu}, {"$set": new_doc})
    return jsonify({'msg':'Update Cover Berhasil!'})

@app.route("/editbuku", methods=["POST"])
def editbuku():
    update_judul = request.form.get('judul_update')
    update_deskripsi = request.form.get('deskripsi_update')
    update_harga = request.form.get('harga_update')
    update_kategori = request.form.get('kategori_update')
    update_bahasa = request.form.get('bahasa_update')
    waktu = request.form.get('waktu_give')

    new_doc = {
        'JudulBuku': update_judul,
        'Deskripsi': update_deskripsi,
        'Harga': f'Rp.{update_harga}',
        'Kategori': update_kategori,
        'Bahasa': update_bahasa,
    }
    db.book.update_one({"Date": waktu}, {"$set": new_doc})
    return jsonify({'msg':'Update Detail Berhasil!'})

@app.route('/search/<kata>')
def search(kata):
    try:
        pola_regex = re.compile(f".*{kata}.*", re.IGNORECASE)
        hasil = list(db.book.find({"JudulBuku": {"$regex": pola_regex}}, {"_id": False}))
        aqua = json_util.loads(json_util.dumps(hasil))
        print(hasil)
        return render_template('search.html', hasil=aqua, kata=kata)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("/"))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
 