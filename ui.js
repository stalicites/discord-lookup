const lookUpButton = document.getElementById("look-up");
const panel = document.getElementById("panel-container");
const goBack = document.getElementById("go-back");
const idPaste = document.getElementById("id-paste");

const idInput = document.getElementById("id-container");

const errorHeader = document.getElementById("header");

const endPoint = `https://discord-lookup-server.herokuapp.com/`;

function uToD(unix) {  
    let stamp = moment.unix(unix/1000)
    return stamp.format('MM/DD/YY - HH:mm:ss');
}

function fetchDataByUser(id) {
    let q = new XMLHttpRequest();
    q.open("GET", `${endPoint}/${id}`);  
    q.send();

    q.onload = function() {
        let res = JSON.parse(q.responseText);
        console.log(res);
        if (res.bannerURL != null) {
            document.getElementById("banner-img").style.display = "block";
            document.getElementById("banner-header").style.display = "block";
            document.getElementById("banner-color").style.display = "none";
            document.getElementById("panel").style.height = "350px";
            document.getElementById("banner-img").src = `https://cdn.discordapp.com/banners/${res.query}/${res.bannerURL}?size=1024`;
        } else {
            document.getElementById("panel").style.height = "245px";
            document.getElementById("banner-img").style.display = "none";
            document.getElementById("banner-header").style.display = "none";
            document.getElementById("banner-color").style.display = "block";
        }
        document.getElementById("created-at").innerText = `Created at: ${uToD(res.createdAt)}`
        document.getElementById("username").innerText = `Username: ${res.username}`;
        document.getElementById("profile-image").src = res.avatar + "?size=1024";
        document.getElementById("banner-color").innerText = `Banner Color: ${res.bannerColor}`;
        //document.getElementById("banner-color").style.backgroundColor = res.bannerColor;
        document.getElementById("query-id").innerText = `Query ID: ${res.query}`;
        document.getElementById("badges").innerText = `Badges: ${res.badge}`;
        document.getElementById("profile-image-link").href = res.avatar + "?size=1024"
        idPaste.className = "container hidden"
        panel.className = "container visible";
    }
    q.onerror = function(e) {
        console.log(e);
        errorHeader.className = "show"
    }
}

lookUpButton.onclick = function() {
    const id = idInput.value;
    fetchDataByUser(id);
}

goBack.onclick = function() {
    idPaste.className = "container visible"
    panel.className = "container hidden";
}