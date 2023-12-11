from flask import Flask, render_template
app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
 