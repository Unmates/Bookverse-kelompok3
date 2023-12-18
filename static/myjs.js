// Page Login
function sign_in() {
    let username = $('#inputUsername').val();
    let password = $('#inputPassword').val();

    $.ajax({
        type: "POST",
        url: "/sign_in",
        data: {
            username_give: username,
            password_give: password,
        },
        success: function (response) {
            console.log(response)
            if (response["result"] === "success") {
                $.removeCookie('mytoken', { path: '/' });
                $.removeCookie('role', { path: '/' });
                if (response["role"] === "admin") {
                    $.cookie("mytoken", response["token"], { path: "/" });
                    $.cookie("role", response["role"], { path: "/" });
                    $.cookie("username", response["username"], { path: "/" });
                    window.location.replace("/adminpage");
                }
                else {
                    $.cookie("mytoken", response["token"], { path: "/" });
                    $.cookie("role", response["role"], { path: "/" });
                    $.cookie("username", response["username"], { path: "/" });
                    window.location.replace("/")
                }
            } else {
                alert(response["msg"]);
            }
        },
    });
}

function role_log() {
    let role = $.cookie('role');
    if (role === "admin") {
        window.location.replace("/adminpage")
    } else if (role === "user") {
        window.location.replace("/")
    }
}

function check_admin() {
    let role = $.cookie('role');
    if (role !== "admin") {
        alert("You're not signed in as admin!");
        window.location.replace("/")
    }
}

function check_user() {
    let role = $.cookie('role');
    if (role !== "user") {
        alert("You're not signed in as user!");
        window.location.replace("/")
    }
}

function no_login() {
    let role = $.cookie('role');
    if (role === undefined) {
        alert("You need to sign in first!");
        window.location.replace("/")
    }
}

function check_id() {
    let username = $("#inputUsername").val();
    if (!username) {
        return alert('Silahkan input username');
    }
    let helpUS = $("#inputUsername");
    let helpId = $("#helpId");
    $.ajax({
        type: "POST",
        url: "/check_id",
        data: {
            username_give: username,
        },
        success: function (response) {
            if (response["exists"]) {
                alert('Username sudah digunakan!');
                helpId.removeClass("fa-user")
                    .removeClass("fa-check")
                    .addClass("fa-times");
            } else {
                alert('Username bisa digunakan');
                helpId.removeClass("fa-user")
                    .removeClass("fa-times")
                    .addClass("fa-check");
                helpUS.attr("disabled", true)
            }
        },
    });
}

function sign_out() {
    $.removeCookie('mytoken', { path: '/' });
    $.removeCookie('role', { path: '/' });
    $.removeCookie("username", { path: "/" });
    alert('Signed out!');
    window.location.href = "/";
}

function favorite(para) {
    let judul = para;
    let username = $.cookie("username")
    let fav_id = $(`#fav-${judul}`)
    if (fav_id.hasClass("fa-heart")) {
        fav_id.removeClass("fa-heart")
        fav_id.addClass("fa-heart-o")
        $.ajax({
            type: 'POST',
            url: '/fav',
            data: {
                judul_give: judul,
                username_give: username,
                action_give: "delete"
            },
            success: function (response) {
                if (response.result === 'success') {
                    alert(response.msg);
                    window.location.reload();
                } else {
                    alert('Something went wrong...');
                }
            }
        });
    }
    else {
        fav_id.removeClass("fa-heart-o")
        fav_id.addClass("fa-heart")
        $.ajax({
            type: 'POST',
            url: '/fav',
            data: {
                judul_give: judul,
                username_give: username,
                action_give: "favorited"
            },
            success: function (response) {
                if (response.result === 'success') {
                    alert(response.msg);
                    window.location.reload();
                } else {
                    alert('Something went wrong...');
                }
            }
        });
    }
}

function keranjang(para) {
    let judul = para;
    let username = $.cookie("username")
    let cart_id = $(`#cart-${judul}`)
    if (cart_id.hasClass("fa-cart-arrow-down")) {
        cart_id.removeClass("fa-cart-arrow-down")
        cart_id.addClass("fa-cart-plus")
        $.ajax({
            type: 'POST',
            url: '/addcart',
            data: {
                judul_give: judul,
                username_give: username,
                action_give: "delete"
            },
            success: function (response) {
                if (response.result === 'success') {
                    alert(response.msg);
                    window.location.reload();
                } else {
                    alert('Something went wrong...');
                }
            }
        });
    }
    else {
        cart_id.removeClass("fa-cart-plus")
        cart_id.addClass("fa-cart-arrow-down")
        $.ajax({
            type: 'POST',
            url: '/addcart',
            data: {
                judul_give: judul,
                username_give: username,
                action_give: "Added to cart"
            },
            success: function (response) {
                if (response.result === 'success') {
                    alert(response.msg);
                    window.location.reload();
                } else {
                    alert('Something went wrong...');
                }
            }
        });
    }
}

function cari() {
    let kata = $("#cari").val()
    if (!kata) {
        return alert('Kata masih kosong');
    }
    let url = kata.replaceAll(/[^0-9a-zA-Z -]/g, '').toLowerCase();
    let url1 = url.replaceAll(' ', '-');
    console.log(url1)
    window.location.href = `/search/${url1}`
}

function deleteadm(para) {
    let judul = $(para).text();
    if (confirm(`Apakah anda ingin menghapus buku '${judul}'?`)) {
        $.ajax({
            type: 'POST',
            url: '/deletebook',
            data: {
                judul_give: judul
            },
            success: function (response) {
                if (response.result === 'success') {
                    alert(response.msg);
                    window.location.reload();
                } else {
                    alert('Something went wrong...');
                }
            }
        });
    }
    return false;
}

// Page Admin
function tampil_admin() {
    $.ajax({
        type: 'GET',
        url: '/buku',
        data: {},
        success: function (response) {
            let rows = response['daftarbuku'];
            let rows1 = response['daftaruser'];

            let count = rows.length
            let count1 = rows1.length
            let dashboard = `
                <div class="box box-bg1 my-2 mx-2">
                    <div class="info">
                        <h3 class="semibold">User</h3>
                        <p class="count regular"><b style="color: #004ad880;">${count1}</b> User</p>
                    </div>
                    <i class="fa fa-user"></i>
                </div>
                <div class="box box-bg2 my-2 mx-2">
                    <div class="info">
                        <h3 class="semibold">Book</h3>
                        <p class="count regular"><b style="color: #d8410080;">${count}</b> Book</p>
                    </div>
                    <i class="fa fa-book"></i>
                </div>
                `;
            $('#dashboard').append(dashboard);

            for (let i = 0; i < rows.length; i++) {
                let judul = rows[i]['JudulBuku'];
                let deskripsi = rows[i]['Deskripsi'];
                let harga = rows[i]['Harga'];
                let kategori = rows[i]['Kategori'];
                let bahasa = rows[i]['Bahasa'];
                let cover = rows[i]['Cover'];
                let url = rows[i]['URL'];

                let temp_html = `
                <div class="col">
                    <div class="card card-book h-100">
                        <a href="/detail/${url}"><img src="/static/${cover}" class="card-img-top card-book-img" alt="Book"></a>
                        <div class="card-body">
                            <h5 class="semibold" id="${url}">${judul}</h5>
                        </div>
                        <h5 class="regular py-2" style="color: #004AD8;">${harga}</h5>
                        <div class="d-flex justify-content-between">
                            <a href="/edit/${url}" class="btn semibold card-admin-btn"
                                style="background-color: #0A868C;">Edit</a>
                            <button onclick="deleteadm('#${url}')" class="btn semibold card-admin-btn ms-3" style="background-color: #D60000;"
                                id="delete">Delete</button>
                        </div>
                    </div>
                </div>`;
                $('#card-book').append(temp_html);
            }
        }
    })
}

// Page Cart
function showcart() {
    $.ajax({
        type: 'GET',
        url: '/showcart',
        data: {},
        success: function (response) {
            let rows = response['daftarbuku'];
            let role = $.cookie('role');
            for (let i = 0; i < rows.length; i++) {
                let judul = rows[i]['JudulBuku'];
                let harga = rows[i]['Harga'];
                let cover = rows[i]['Cover'];
                let url = rows[i]['URL'];
                let temp_html = `
                <div class="col">
                    <div class="card card-book h-100">
                        <a href="/detail/${url}"><img src="/static/${cover}"
                                class="card-img-top card-book-img" alt="Book"></a>
                        <div class="card-body">
                            <h5 class="semibold">${judul}</h5>
                        </div>
                        <p class="d-none" id="ori-${i}">${harga}</p>
                        <h5 class="regular py-2" style="color: #004AD8;" id="harga-${i}">${harga}</h5>
                        <div class="d-flex justify-content-around">
                            <button type="button" class="btn rounded-circle btnred" onclick="minus('#jumlah-${i}', '#harga-${i}', '#ori-${i}', '${url}')">-</button>
                            <h5 class="mt-1" id="jumlah-${i}">1</h5>
                            <button type="button" class="btn rounded-circle btngreen" onclick="plus('#jumlah-${i}', '#harga-${i}', '#ori-${i}')">+</button>
                        </div>
                    </div>
                </div>`;
                $('#card-book').append(temp_html);
            }
        }
    })
}

function check_out() {
    let username = $.cookie('username');
    $.ajax({
        type: 'POST',
        url: '/checkout',
        data: {
            username_give: username
        },
        success: function (response) {
            if (response.result === 'success') {
                alert(response.msg);
                window.location.reload();
            } else {
                alert('Something went wrong...');
            }
        }
    });
}

function plus(para1, para2, para3) {
    let angka = Number($(para1).text())
    let jumlah = angka + 1
    let harga = $(para2).text()
    let spl1 = harga.split("Rp.")
    let spl2 = spl1[1].split(".")
    let int = Number(spl2.join(""))
    let hargaori = $(para3).text()
    let spl1ori = hargaori.split("Rp.")
    let spl2ori = spl1ori[1].split(".")
    let intori = Number(spl2ori.join(""))
    let total = int + intori
    $(para1).text(`${jumlah}`)
    $(para2).text(`Rp.${total}`)
}

function minus(para1, para2, para3, para4) {
    let angka = Number($(para1).text())
    if (angka === 1) {
        let judul = para4
        let username = $.cookie("username")
        $.ajax({
            type: 'POST',
            url: '/addcart',
            data: {
                judul_give: judul,
                username_give: username,
                action_give: "delete"
            },
            success: function (response) {
                if (response.result === 'success') {
                    alert(response.msg);
                    window.location.reload();
                } else {
                    alert('Something went wrong...');
                }
            }
        });
    }
    else {
        let jumlah = angka - 1
        let harga = $(para2).text()
        let spl1 = harga.split("Rp.")
        let spl2 = spl1[1].split(".")
        let int = Number(spl2.join(""))
        let hargaori = $(para3).text()
        let spl1ori = hargaori.split("Rp.")
        let spl2ori = spl1ori[1].split(".")
        let intori = Number(spl2ori.join(""))
        let total = int - intori
        $(para1).text(`${jumlah}`)
        $(para2).text(`Rp.${total}`)
    }
}

// Page Detail
function roledetail() {
    let role = $.cookie('role');
    $('#navadmindetail').hide();
    $('#navuserdetail').hide();
    if (role === 'admin') {
        $('#navadmindetail').show();
    }
    if (role === 'user') {
        $('#navuserdetail').show();
    }
}

function detail() {
    let judul = detail_book['JudulBuku'];
    let deskripsi = detail_book['Deskripsi'];
    let harga = detail_book['Harga'];
    let kategori = detail_book['Kategori'];
    let bahasa = detail_book['Bahasa'];
    let cover = detail_book['Cover'];

    let temp_html = `
    <div class="col mb-5">
        <div style="max-width: 350px;">
            <img src="/static/${cover}" class="detail-img" alt="Book" width="350">
        </div>
    </div>
    <div class="col-7">
        <h1 class="fw-bolder">${judul}</h1>
        <h6 class="fw-bold mt-3">Deskripsi Buku</h6>
        <p>${deskripsi}</p>
        <div class="row">
            <div class="col">
                <h6 class="fw-bold">Harga</h6>
            </div>
            <div class="col-10 harga">
                <p>: ${harga}</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h6 class="fw-bold">Kategori</h6>
            </div>
            <div class="col-10">
                <p>: ${kategori}</p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h6 class="fw-bold">Bahasa</h6>
            </div>
            <div class="col-10">
                <p>: ${bahasa}</p>
            </div>
        </div>
    </div>
    `;
    $('#detailbuku').append(temp_html);
}

// Page EditBook
function edit() {
    let judul = book_info['JudulBuku'];
    let deskripsi = book_info['Deskripsi'];
    let harga = book_info['Harga'];
    let spl1 = harga.split("Rp.")
    let spl2 = spl1[1].split(".")
    let int = Number(spl2.join(""))
    let kategori = book_info['Kategori'];
    let bahasa = book_info['Bahasa'];
    let cover = book_info['Cover'];

    let temp_html = `
    <div class="col">
        <div style="max-width: 350px; margin-bottom: 10px;">
            <img src="/static/${cover}" class="card-img-top detail-img"
                alt="Book">
        </div>
        <div class="d-flex">
            <div class="custom-file-input">
                <label for="gambar-buku">Choose File</label>
                <input type="file" id="gambar-buku" name="gambar-buku">
            </div>
            <button onclick="editgambar()" class="btn btn-login ms-3" style="max-width: 90px;">Update</button>
        </div>
    </div>

    <div class="col-7">
        <div class="card px-5 py-3" style="border: 1px solid rgb(112, 112, 112);" >
            <div class="form-group">
                <label for="kategori">Judul Buku:</label>
                <input type="text" id="judul" name="judul"
                    value="${judul}">
            </div>
            <div class="form-group">
                <label for="deskripsi">Deskripsi Buku:</label>
                <textarea class="me-4" id="deskripsi" name="deskripsi" rows="4">${deskripsi}</textarea>
            </div>
            <div class="form-group">
                <label for="harga">Harga Buku:</label>
                <input class="me-4" type="number" id="harga" name="harga" value="${int}">
            </div>
            <div class="form-group">
                <label for="kategori">Kategori Buku:</label>
                <select class="me-4" id="kategori" name="kategori">
                    <option value="${kategori}">${kategori}</option>
                    <option value="..." disabled>...</option>
                    <option value="Novel">Novel</option>
                    <option value="Biografi">Biografi</option>
                    <option value="Ensiklopedia">Ensiklopedia</option>
                    <option value="Komik">Komik</option>
                    <option value="Buku Pelajaran">Buku Pelajaran</option>
                    <option value="Buku masak">Buku masak</option>
                </select>
            </div>
            <div class="form-group">
                <label for="bahasa">Bahasa Buku:</label>
                <select class="me-4" id="bahasa" name="bahasa">
                    <option value="${bahasa}">${bahasa}</option>
                    <option value="..." disabled>...</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Inggris">Inggris</option>
                    <option value="Jepang">Jepang</option>
                    <option value="Korea">Korea</option>
                </select>
            </div>
            <button onclick="check_judul_e()" class="btn semibold btn-login mb-3">Update</button>
        </div>
    </div>
    `;
    $('#editbuku').append(temp_html);
}

function editgambar() {
    let waktu = book_info['Date'];
    let gambar = $("#gambar-buku").prop("files")[0];
    if (!gambar) {
        return alert('Silahkan input gambar');
    }

    let form_data = new FormData();
    form_data.append("gambar_update", gambar);
    form_data.append("waktu_give", waktu);
    $.ajax({
        type: 'POST',
        url: '/editcover',
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            alert(response['msg']);
            window.location.reload();
        }
    });
}

function editing() {
    let waktu = book_info['Date'];
    let judul = $('#judul').val();
    let deskripsi = $('#deskripsi').val();
    let harga = $('#harga').val();
    let kategori = $('#kategori').val();
    let bahasa = $('#bahasa').val();

    let form_data = new FormData();

    form_data.append("judul_update", judul);
    form_data.append("deskripsi_update", deskripsi);
    form_data.append("harga_update", harga);
    form_data.append("kategori_update", kategori);
    form_data.append("bahasa_update", bahasa);
    form_data.append("waktu_give", waktu);

    $.ajax({
        type: 'POST',
        url: '/editbuku',
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            alert(response['msg']);
            window.location.reload();
        }
    });
}

// Page Favorit
function showfav() {
    $.ajax({
        type: 'GET',
        url: '/showfav',
        data: {},
        success: function (response) {
            let rows = response['daftarbuku'];
            let role = $.cookie('role');
            for (let i = 0; i < rows.length; i++) {
                let judul = rows[i]['JudulBuku'];
                let harga = rows[i]['Harga'];
                let cover = rows[i]['Cover'];
                let url = rows[i]['URL'];
                console.log("judul")
                let temp_html = `
                <div class="col">
                    <div class="card card-book h-100">
                        <a href="/detail/${url}"><img src="/static/${cover}"
                                class="card-img-top card-book-img" alt="Book"></a>
                        <div class="card-body">
                            <h5 class="semibold">${judul}</h5>
                        </div>
                        <h5 class="regular py-2" style="color: #004AD8;">${harga}</h5>
                        <div class="d-flex justify-content-between" id="book-btn">
                            <a onclick="favorite('${url}')"><i class="fa fa-heart-o fa-2x" aria-hidden="true" id="fav-${url}"></i></a>
                            <a href="/detail/${url}" class="btn semibold card-body-btn">Detail</a>
                            <a onclick="keranjang('${url}')"><i class="fa fa-cart-plus fa-2x" aria-hidden="true" id="cart-${url}"></i></a>
                        </div>
                    </div>
                </div>`;
                $('#card-book').append(temp_html);
            }
            if (role === "user") {
                let fav_rows = response['daftarfavorite']
                for (let i = 0; i < fav_rows.length; i++) {
                    let favurl = fav_rows[i]["JudulBuku"]
                    let fav_id = $(`#fav-${favurl}`)
                    fav_id.removeClass("fa-heart-o")
                    fav_id.addClass("fa-heart")
                }
                let cart_rows = response['daftarkeranjang']
                for (let i = 0; i < cart_rows.length; i++) {
                    let carturl = cart_rows[i]["JudulBuku"]
                    let cart_id = $(`#cart-${carturl}`)
                    cart_id.removeClass("fa-cart-plus")
                    cart_id.addClass("fa-cart-arrow-down")
                }
            }
        }
    })
}

// Page Home
function tampil() {
    $("#dashunlog").hide();
    $("#dashlog").hide();
    $.ajax({
        type: 'GET',
        url: '/buku',
        data: {},
        success: function (response) {
            let rows = response['daftarbuku'];
            let role = $.cookie('role');
            for (let i = 0; i < rows.length; i++) {
                let judul = rows[i]['JudulBuku'];
                let deskripsi = rows[i]['Deskripsi'];
                let harga = rows[i]['Harga'];
                let kategori = rows[i]['Kategori'];
                let bahasa = rows[i]['Bahasa'];
                let cover = rows[i]['Cover'];
                let url = rows[i]['URL'];

                console.log(judul)
                if (role === 'admin') {
                    window.location.href = '/adminpage';
                }
                if (role === 'user') {
                    $("#right-nav").empty();
                    $("#dashlog").show();
                    let temp_nav = `
                        <a href="/favorite"><i class="fa fa-heart fa-2x me-4 black" aria-hidden="true"></i></a>
                        <a href="/cart"><i class="fa fa-shopping-cart fa-2x me-4 black" aria-hidden="true"></i></a>
                        <a href="/profile"><i class="fa fa-user fa-2x me-2 black" aria-hidden="true"></i></a>
                    `;
                    let temp_html = `
                    <div class="col">
                        <div class="card card-book h-100">
                            <a href="/detail/${url}"><img src="/static/${cover}"
                                    class="card-img-top card-book-img" alt="Book"></a>
                            <div class="card-body">
                                <h5 class="semibold">${judul}</h5>
                            </div>
                            <h5 class="regular py-2" style="color: #004AD8;">${harga}</h5>
                            <div class="d-flex justify-content-between" id="book-btn">
                                <a onclick="favorite('${url}')"><i class="fa fa-heart-o fa-2x" aria-hidden="true" id="fav-${url}"></i></a>
                                <a href="/detail/${url}" class="btn semibold card-body-btn">Detail</a>
                                <a onclick="keranjang('${url}')"><i class="fa fa-cart-plus fa-2x" aria-hidden="true" id="cart-${url}"></i></a>
                            </div>
                        </div>
                    </div>`;
                    $('#card-book').append(temp_html);
                    $("#right-nav").append(temp_nav);
                }
                else {
                    $("#dashunlog").show();
                    let temp_html = `
                    <div class="col">
                        <div class="card card-book h-100">
                            <a href="/login"><img src="/static/${cover}"
                                    class="card-img-top card-book-img" alt="Book"></a>
                            <div class="card-body">
                                <h5 class="semibold">${judul}</h5>
                            </div>
                            <h5 class="regular py-2" style="color: #004AD8;">${harga}</h5>
                            <div class="justify-content-between">
                                <a href="/login" class="btn semibold card-body-btn">Detail</a>
                            </div>
                        </div>
                    </div>`;
                    $('#card-book').append(temp_html);
                }
            }
            if (role === "user") {
                let fav_rows = response['daftarfavorite']
                for (let i = 0; i < fav_rows.length; i++) {
                    let favurl = fav_rows[i]["JudulBuku"]
                    let fav_id = $(`#fav-${favurl}`)
                    fav_id.removeClass("fa-heart-o")
                    fav_id.addClass("fa-heart")
                }
                let cart_rows = response['daftarkeranjang']
                for (let i = 0; i < cart_rows.length; i++) {
                    let carturl = cart_rows[i]["JudulBuku"]
                    let cart_id = $(`#cart-${carturl}`)
                    cart_id.removeClass("fa-cart-plus")
                    cart_id.addClass("fa-cart-arrow-down")
                }
            }
        }
    })
}

function update_profile() {
    let file = $("#profile-user")[0].files[0];
    if (!file) {
        return alert('Silahkan input photo profil');
    }
    let email = $("#inputEmail").val();
    let nomor = $('#inputNomor').val();
    let alamat = $("#inputAlamat").val();
    let form_data = new FormData();
    form_data.append("file_give", file);
    form_data.append("email_give", email);
    form_data.append("nomor_give", nomor);
    form_data.append("alamat_give", alamat);

    $.ajax({
        type: "POST",
        url: "/update_profile",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response["result"] === "success") {
                alert(response["msg"]);
                window.location.reload();
            }
        },
    });
}

// Page Regis Admin
function masukadmin() {
    let username = $('#inputUsername').val();
    if (!username) {
        return alert('Silahkan isi username anda');
    }
    let password = $('#inputPassword').val();
    if (!password) {
        return alert('Silahkan isi password anda');
    }
    let email = $('#inputEmail').val();
    if (!email) {
        return alert('Silahkan isi email');
    }
    let nomor = $('#inputNomor').val();
    if (!nomor) {
        return alert('Silahkan isi nomor handphone');
    }

    let helpId = $("#helpId");
    if (helpId.hasClass("fa-user")) {
        alert("anda belum check id!");
        return;
    } else if (helpId.hasClass("fa-times")) {
        alert("cek kembali id anda");
        return;
    }

    $.ajax({
        type: "POST",
        url: "/radmin",
        data: {
            email: email,
            nomor_give: nomor,
            username_give: username,
            password_give: password
        },
        success: function (response) {
            alert("You are signed up as Admin! Nice!");
            window.location.replace("/login");
        }
    });
}

// Page Profile
function profile() {
    let username = user_list['username'];
    let email = user_list['email'];
    let nohp = user_list['nohp'];
    let alamat = user_list['alamat'];
    let profile = user_list['profile_default'];

    let temp_html = `
    <div class="col-4 photo">
        <h2 class="bold mt-3 ms-1">FOTO PROFIL</h2>
        <img src="/static/${profile}" class="img-thumbnail gambar mt-3"
            alt="Profile">
        <div class="custom-file-input ms-1 mt-4 mb-4 bold">
            <label for="profile-user">Choose File</label>
            <input type="file" id="profile-user" name="profile-user">
        </div>
    </div>
    <div class="col-4 ms-4 info-akun">
        <h3 class="bold mt-3">Informasi Akun</h3>
        <hr>
        <div class="mb-2">
            <label for="inputUsername" class="form-label ps-1">Username</label>
            <input type="email" class="form-control" id="inputUsername" value="${username}" disabled>
        </div>
        <div class="mb-2">
            <label for="inputEmail" class="form-label ps-1">Email*</label>
            <input type="email" class="form-control" id="inputEmail" value="${email}">
        </div>
        <div class="mb-2">
            <label for="inputNomor" class="form-label ps-1">No HP*</label>
            <input type="email" class="form-control" id="inputNomor" value="${nohp}">
        </div>
        <div class="mb-2">
            <label for="inputAlamat" class="form-label ps-1">Alamat (opsional)</label>
            <textarea class="form-control" id="inputAlamat" rows="2">${alamat}</textarea>
        </div>
        <div class="text-center">
            <button type="button" onclick="update_profile()" class="btn mt-3 bold btn-info-save">SAVE</button>
        </div>
    </div>
    <div class="text-center mt-5">
        <button type="button" class="btn btn-lg text-center bold btn-logout" onclick="sign_out()">Log Out</button>
    </div>
    `;
    $('#editprofile').append(temp_html);
}

// Page Regis User
function masuk() {
    let username = $('#inputUsername').val();
    if (!username) {
        return alert('Silahkan isi username anda');
    }
    let password = $('#inputPassword').val();
    if (!password) {
        return alert('Silahkan isi password anda');
    }
    let email = $('#inputEmail').val();
    if (!email) {
        return alert('Silahkan isi email');
    }

    let helpId = $("#helpId");
    if (helpId.hasClass("fa-user")) {
        alert("anda belum check id!");
        return;
    } else if (helpId.hasClass("fa-times")) {
        alert("cek kembali id anda");
        return;
    }

    $.ajax({
        type: "POST",
        url: "/ruser",
        data: {
            email: email,
            username_give: username,
            password_give: password
        },
        success: function (response) {
            alert("You are signed up as User! Nice!");
            window.location.replace("/login");
        }
    });
}

// Page Search
function rolesearch() {
    let role = $.cookie('role');
    $('#navadmin').hide();
    $('#navuser').hide();
    $('#cardadmin').hide();
    $('#carduser').hide();
    if (role === 'admin') {
        $('#navadmin').show();
        $('#cardadmin').show();
    }
    if (role === 'user') {
        $('#navuser').show();
        $('#carduser').show();
    }
}

// Page Tambah Buku
function postbook() {
    let judul = $('#judul').val();
    if (!judul) {
        return alert('Silahkan isi judul bukunya');
    }
    let deskripsi = $('#deskripsi').val();
    if (!deskripsi) {
        return alert('Silahkan isi deskripsinya');
    }
    let harga = $('#harga').val();
    if (!harga) {
        return alert('Silahkan isi harga bukunya');
    }
    let kategori = $('#kategori').val();
    if (!kategori) {
        return alert('Silahkan isi kategori bukunya');
    }
    let bahasa = $('#bahasa').val();
    if (!bahasa) {
        return alert('Silahkan isi bahasa bukunya');
    }
    let gambar = $("#gambar-buku").prop("files")[0];
    if (!gambar) {
        return alert('Silahkan input gambar');
    }

    let url = judul.replaceAll(/[^0-9a-zA-Z -]/g, '').toLowerCase();
    let url1 = url.replaceAll(' ', '-');

    let form_data = new FormData();

    form_data.append("gambar_give", gambar);
    form_data.append("judul_give", judul);
    form_data.append("deskripsi_give", deskripsi);
    form_data.append("harga_give", harga);
    form_data.append("kategori_give", kategori);
    form_data.append("bahasa_give", bahasa);
    form_data.append("url_give", url1);

    $.ajax({
        type: 'POST',
        url: '/tambahbuku',
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            alert(response['msg']);
            window.location.href = '/adminpage';
        }
    });
}

function check_judul_t() {
    let judul = $('#judul').val();
    $.ajax({
        type: "POST",
        url: "/check_judul",
        data: {
            judul_give: judul,
        },
        success: function (response) {
            if (response["exists"]) {
                alert('Judul sudah digunakan!');
            } else {
                postbook();
            }
        },
    });
}

function check_judul_e() {
    let judul = $('#judul').val();
    $.ajax({
        type: "POST",
        url: "/check_judul",
        data: {
            judul_give: judul,
        },
        success: function (response) {
            if (response["exists"]) {
                alert('Judul sudah digunakan!');
            } else {
                editing();
            }
        },
    });
}