from flask import Flask, render_template, request, jsonify, request, redirect, url_for
from pymongo import MongoClient
from datetime import datetime, timedelta
import jwt
import hashlib
from werkzeug.utils import secure_filename

app = Flask(__name__)

# MONGODB_CONNECTION_STRING = "mongodb+srv://farelli:shakti@bookdb.nftj3pv.mongodb.net/?retryWrites=true&w=majority"
# client = MongoClient(MONGODB_CONNECTION_STRING)
# db = client.test123

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
    result = db.cumatest.find_one({
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
                "role": result["role"]
            }
        )

    else:
        return jsonify(
            {
                "result": "fail",
                "msg": "We could not find a user with that id/password combination",
            }
        )

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
    db.cumatest.insert_one(doc)
    return jsonify({'result': 'success'})

@app.route('/adminpage')
def adminpage():
    return render_template('admin.html')

@app.route('/deletebook', methods=['POST'])
def deletebook():
    judul = request.form.get('judul_give')
    db.book.delete_one({'JudulBuku': judul})
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
        'nomor':nomor_receive,
        'username': username_receive,
        'password': password_hash,
        'role': 'admin'
    }
    db.cumatest.insert_one(doc)
    return jsonify({'result': 'success'})

@app.route('/buku')
def buku():
    book_list = list(db.book.find({}, {'_id': False}))
    user_list = list(db.cobalogin.find({}, {'_id': False}))
    return jsonify({'daftarbuku': book_list, 'daftaruser': user_list})

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
    cover = f"cover/{mytime}.{extension}"
    file.save("./static/" + cover)

    doc = {
        'Date': mytime,
        'JudulBuku': judul_receive,
        'Deskripsi': deskripsi_receive,
        'Harga': harga_receive,
        'Kategori': kategori_receive,
        'Bahasa': bahasa_receive,
        'URL': url_receive,
        'Cover': cover
    }

    db.book.insert_one(doc)
    return jsonify({'msg':'Input Buku Berhasil!'})

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/favorite')
def favorite():
    return render_template('favorite.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

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

    today = datetime.now()
    mytime = today.strftime('%Y-%m-%d-%H-%M-%S')

    file = request.files["gambar_update"]
    filename = secure_filename(file.filename)
    extension = filename.split(".")[-1]
    cover = f"cover/{mytime}.{extension}"
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
        'Harga': update_harga,
        'Kategori': update_kategori,
        'Bahasa': update_bahasa,
    }
    db.book.update_one({"Date": waktu}, {"$set": new_doc})
    return jsonify({'msg':'Update Detail Berhasil!'})

@app.route('/search')
def search():
    return render_template('search.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
 