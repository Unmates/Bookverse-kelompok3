function check_admin(){
    let role= $.cookie('role');
    console.log(role)
    if (role !== "admin") {
        alert("You're not signed in as admin!");
        window.location.replace("/login")
    }
}

function no_login(){
    let role= $.cookie('role');
    console.log(role)
    if (role === undefined) {
        alert("You need to sign in first!");
        window.location.replace("/login")
    }
}

function sign_out() {
    $.removeCookie('mytoken', { path: '/' });
    $.removeCookie('role', { path: '/' });
    alert('Signed out!');
    window.location.href = "/login";
}