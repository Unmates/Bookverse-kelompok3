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

@app.route('/tambah')
def tambah():
    return render_template('tambahbuku.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
 