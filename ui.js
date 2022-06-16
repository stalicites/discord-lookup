const lookUpButton = document.getElementById("look-up");
const panel = document.getElementById("panel-container");
const goBack = document.getElementById("go-back");
const idPaste = document.getElementById("id-paste");

const idInput = document.getElementById("id-container");

const errorHeader = document.getElementById("header");

const endPoint = `https://discord-lookup-server.herokuapp.com`;
const colorThief = new ColorThief();

function uToD(unix) {  
    let stamp = moment.unix(unix/1000)
    return stamp.format('MM/DD/YY - h:mm:ss A');
}   

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function fetchDataByUser(id) {
    let q = new XMLHttpRequest();
    q.open("GET", `${endPoint}/${id}`);  
    q.send();

    q.onload = function() {
        let res = JSON.parse(q.responseText);
        console.log(res);
        if (res.bannerURL != null) {
            document.getElementById("banner-img").src = `https://cdn.discordapp.com/banners/${res.query}/${res.bannerURL}?size=1024`;
            document.getElementById("banner-img").style.display = "block";
            document.getElementById("banner-header").style.display = "block";
            document.getElementById("banner-color").style.display = "none";
            document.getElementById("panel").style.height = "350px";
        } else {
            document.getElementById("panel").style.height = "245px";
            document.getElementById("banner-img").style.display = "none";
            document.getElementById("banner-header").style.display = "none";
            document.getElementById("banner-color").style.display = "block";
        }
        document.getElementById("profile-image").src = res.avatar + "?size=1024";
        document.getElementById("created-at").innerText = `Created at: ${uToD(res.createdAt)}`
        document.getElementById("username").innerText = `Username: ${res.username}`;
        if (res.bannerColor != null) {
            document.getElementById("banner-color").innerText = `Banner Color: ${res.bannerColor}`;
        }
        if (res.badge.length != 0) {
            let seen = {}
            res.badge.forEach((badge) => {
                if (badge != "verifiedBot") {    
                    let img = document.createElement("img");
                    img.src = `svgs/${badge}.svg`;
                    img.className = "badge";
                    document.getElementById("badges").appendChild(img);
                } else {
                    if (seen["verifiedBot"]) {
                        let p = document.createElement("p");
                        p.innerText = "BOT";
                        p.className = "bot"
                        document.getElementById("badges").appendChild(p);
                    }
                }
                seen[badge] = true;
            })
        } else {
            document.getElementById("holder-badges").innerText = `Badges: None!`;
        }
        //document.getElementById("banner-color").style.backgroundColor = res.bannerColor;
        document.getElementById("query-id").innerText = `Query ID: ${res.query}`;
        document.getElementById("profile-image-link").href = res.avatar + "?size=1024"
        idPaste.className = "container hidden"
        panel.className = "container visible";

        document.getElementById("profile-image").onload = function() {
            if (res.bannerColor == null) {
                let img = document.getElementById("profile-image")
                img.setAttribute('crossOrigin', '');
                let colorAvg = colorThief.getColor(img);
                colorAvg = rgbToHex(colorAvg[0], colorAvg[1], colorAvg[0])
                document.getElementById("banner-color").innerText = `Banner Color: ${colorAvg}`
            }
        }
    }
    q.onerror = function(e) {
        console.log(e);
        console.log(`Request status: ${q.status}`)
        errorHeader.className = "show"
        let index = 0;
        setInterval(function() {
            if (index != 1) {
                errorHeader.className = ""
                index++;
            } else {
                clearInterval();
            }
        }, 4000)
    }
}

lookUpButton.onclick = function() {
    const id = idInput.value;
    fetchDataByUser(id);
}

idInput.onkeyup = function(e) {
    if (e.key == "Enter") {
        const id = idInput.value;
        fetchDataByUser(id);
    }
}

goBack.onclick = function() {
    idPaste.className = "container visible"
    panel.className = "container hidden";
    document.getElementById("badges").innerHTML = 
    `
    <div id = "badges">
        <p id = "holder-badges">Badges: </p>
    </div>
    `
}
