var x = 5;
var y = 7;
var z = x + y;
console.log(z)

var A = "Hello ";
var B = "world!";
var C = A + B;
console.log(C);

function sumnPrint(x1, x2) {
    var result = x1 + x2;
    console.log(result);
}

sumnPrint(x, y); 
sumnPrint(A, B);

if (C.length > z) {
    console.log(C);
} else {
    if (C.length < z) {
        console.log(z);
    } else {
        console.log("good job!");
    }
}

var L1 = ["Watermelon", "Pineapple", "Pear", "Banana"];
var L2 = ["Apple", "Banana", "Kiwi", "Orange"];

function findTheBanana(list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === "Banana") {
            alert("Banana found at index " + i + "!");
        }
    }
}

//findTheBanana(L1);
//findTheBanana(L2);

function findTheBananaForEach(list) {
    list.forEach(function(item) {
        if (item === "Banana") {
            alert("Banana found!");
        }
    });
}

//findTheBananaForEach(L1);
//findTheBananaForEach(L2);

var now = new Date();
var hour = now.getHours();  

function greeting(h) {
    var greetText = "";

    if (h < 5 || h >= 20) {
        greetText = "Good night";
    } else if (h < 12) {
        greetText = "Good morning";
    } else if (h < 18) {
        greetText = "Good afternoon";
    } else {
        greetText = "Good evening";
    }
    var greetingElement = document.getElementById("greeting");
    if (greetingElement){
        greetingElement.innerHTML = greetText;
    }
}
greeting(hour);

function addYear() {
    var year = new Date().getFullYear();
    var yearElement = document.getElementById("copyYear");

    if (yearElement) {
        yearElement.innerHTML = year;
    }
}
function currentPageFile() {
    var path = window.location.pathname.replace(/\/$/, "");
    var file = path.split("/").pop() || "";
    if (!file || file.indexOf(".") === -1) {
        return "index.html";
    }
    return file.toLowerCase();
}

function ActiveNav() {
    var navLinks = document.querySelectorAll("nav.nav_bar a");
    var current = currentPageFile();

    navLinks.forEach(function (link) {
        try {
            var url = new URL(link.href);
            var linkFile = url.pathname.split("/").pop().toLowerCase() || "index.html";
            if (linkFile === current) {
                link.classList.add("active");
            }
        } catch (e) {
            if (link.href === window.location.href) {
                link.classList.add("active");
            }
        }
    });
}

ActiveNav();

function toggleNav() {
    var nav = document.querySelector("nav.nav_bar");
    var btn = document.querySelector(".nav_hamburger");
    if (!nav || !btn) {
        return;
    }
    nav.classList.toggle("nav_open");
    btn.setAttribute("aria-expanded", nav.classList.contains("nav_open") ? "true" : "false");
}

(function initIncrement5Nav() {
    var ham = document.querySelector(".nav_hamburger");
    if (ham) {
        ham.addEventListener("click", toggleNav);
    }
}());

function initMuseumMap() {
    var mapEl = document.getElementById("map");
    if (typeof L === "undefined" || !mapEl) {
        return;
    }
    var lat = 40.4439;
    var lng = -79.9504;
    var zoom = 14;
    var map = L.map("map").setView([lat, lng], zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.marker([lat, lng]).addTo(map).bindPopup("MonoMuse Museum (Pittsburgh)");
}

initMuseumMap();

if (typeof jQuery !== "undefined") {
    jQuery(document).ready(function ($) {
        $("#readLess").click(function () {
            $("#longIntro").hide();
            $("#readLess").hide();
            $("#readMore").show();
        });
        $("#readMore").click(function () {
            $("#longIntro").show();
            $("#readLess").show();
            $("#readMore").hide();
        });
    });
}
function showPurchaseForm(date) {
    var form = document.getElementById("ticketForm");
    var dateField = document.getElementById("selectedDate");
    if (!form || !dateField) {
        return;
    }
    form.style.display = "block";
    dateField.value = date;
    form.scrollIntoView({ behavior: "smooth" });
}

function submitPurchase() {
    alert("Redirecting to payment system.");
}
