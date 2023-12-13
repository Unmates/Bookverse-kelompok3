from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)

MONGODB_CONNECTION_STRING = "mongodb+srv://farelli:shakti@bookdb.nftj3pv.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(MONGODB_CONNECTION_STRING)
db = client.testinput

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/ruser')
def ruser():
    return render_template('regisuser.html')

@app.route('/radmin')
def radmin():
    return render_template('regisadmin.html')

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

    today = datetime.now()
    mytime = today.strftime('%Y-%m-%d-%H-%M-%S')

    file = request.files['gambar_give']
    extension = file.filename.split('.')[-1]
    filename = f'static/cover-{mytime}.{extension}'
    file.save(filename)

    doc = {
        'Date': mytime,
        'JudulBuku': judul_receive,
        'Deskripsi': deskripsi_receive,
        'Harga': harga_receive,
        'Kategori': kategori_receive,
        'Bahasa': bahasa_receive,
        'Cover': filename
    }

    db.bukutest.insert_one(doc)
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

@app.route('/detail')
def detail():
    return render_template('detail.html')

@app.route('/edit')
def editbook():
    return render_template('editbook.html')

@app.route('/search')
def search():
    return render_template('search.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
 