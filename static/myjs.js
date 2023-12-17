function role_log() {
    let role = $.cookie('role');
    console.log(role)
    if (role === "admin") {
        alert("Kamu sudah login");
        window.location.replace("/adminpage")
    } else if (role === "user") {
        alert("Kamu sudah login");
        window.location.replace("/")
    }
}

function check_admin() {
    let role = $.cookie('role');
    console.log(role)
    if (role !== "admin") {
        alert("You're not signed in as admin!");
        window.location.replace("/")
    }
}

function no_login() {
    let role = $.cookie('role');
    console.log(role)
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
                inputUsername.focus();
            } else {
                // alert('Username bisa digunakan');
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
    let url = kata.replaceAll(/[^0-9a-zA-Z -]/g, '').toLowerCase();
    let url1 = url.replaceAll(' ', '-');
    console.log(url1)
    window.location.href = `/search/${url1}`
}