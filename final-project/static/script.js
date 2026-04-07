/**
 * MonoMuse Museum — Phase B | static/script.js
 * External libraries used:
 * - jQuery 4.x — https://jquery.com/
 *       Used for: Read more/less (index.html), FAQ accordion (membership.html)
 * - Leaflet 1.9.x — https://leafletjs.com/ — loaded on explore.html only (with map tiles)
 * - OpenStreetMap tiles — https://www.openstreetmap.org/copyright

/** Example price per ticket. */
var TICKET_UNIT_USD = 18;

/**
 * Finds #copyYear and sets "© {currentYear} MonoMuse Museum..."
 * Called from <body onload="addYear()"> on each page.
 */
function addYear() {
    var y = new Date().getFullYear();
    var el = document.getElementById("copyYear");
    if (el) {
        el.textContent = "© " + y + " MonoMuse Museum. All rights reserved.";
    }
}

/**
 * Maps time of day to a type of greeting on home page
 * Boundaries: night before 5am and after 8pm; morning until noon; afternoon until 6pm; else evening.
 */
function greetingByHour(h) {
    if (h < 5 || h >= 20) {
        return "Good night";
    }
    if (h < 12) {
        return "Good morning";
    }
    if (h < 18) {
        return "Good afternoon";
    }
    return "Good evening";
}

/**
 * Only on home page, if the greeting exists, sets text from greetingByHour + museum welcome.
 */
function runGreeting() {
    var el = document.getElementById("greeting");
    if (!el) {
        return;
    }
    el.textContent = greetingByHour(new Date().getHours()) + " — welcome to MonoMuse.";
}

/**
 * Gets current HTML file name to use for navigation highlighting
 * Trailing slashes stripped; bare directory URLs treated as index.html.
 */
function currentPageFile() {
    var path = window.location.pathname.replace(/\/$/, "");
    var file = path.split("/").pop() || "";
    if (!file || file.indexOf(".") === -1) {
        return "index.html";
    }
    return file.toLowerCase();
}

/**
 * Highlights the active navigation link: compares the pathname to currentPageFile().
 * Adds class "active" (styled in style.css).
 */
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

/**
 * Mobile nav: toggles class nav_open on <nav class="nav_bar"> and syncs with hamburger menu.
 * CSS (max-width: 650px) shows .nav_links when .nav_bar.nav_open is present.
 */
function toggleNav() {
    var nav = document.querySelector("nav.nav_bar");
    var btn = document.querySelector(".nav_hamburger");
    if (!nav || !btn) {
        return;
    }
    nav.classList.toggle("nav_open");
    btn.setAttribute("aria-expanded", nav.classList.contains("nav_open") ? "true" : "false");
}

/**
 * Creates Leaflet map if global L exists and #map is in the DOM.
 * Coordinates approximate Oakland location and adds a dot
 */
function initMuseumMap() {
    var mapEl = document.getElementById("map");
    if (typeof L === "undefined" || !mapEl) {
        return;
    }
    var lat = 40.4439;
    var lng = -79.9504;
    var map = L.map("map").setView([lat, lng], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    L.marker([lat, lng]).addTo(map).bindPopup("MonoMuse Museum (Pittsburgh)");
}

/**
 * buytickets.html: "Buy now" buttons call onclick="showPurchaseForm('April 10')" etc.
 * Reveals #ticketForm, writes date into #selectedDate, scrolls form into view.
 */
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

/** buytickets.html: quick form’s continue button sends user to full checkout page. */
function submitPurchase() {
    window.location.href = "checkout.html";
}

/**
 * Checkout validation UI: pairs input id "foo" with error span id "fooError".
 * Toggles .field-error--visible and sets aria-invalid on the input for accessibility.
 */
function setFieldError(inputId, message) {
    var input = document.getElementById(inputId);
    var err = document.getElementById(inputId + "Error");
    if (input) {
        input.setAttribute("aria-invalid", message ? "true" : "false");
    }
    if (err) {
        err.textContent = message || "";
        err.classList.toggle("field-error--visible", !!message);
    }
}

/** Clears every checkout error region before re-validating (avoids stale messages). */
function clearCheckoutErrors() {
    ["visitDate", "ticketType", "ticketQty", "checkoutEmail", "zipCode"].forEach(function (id) {
        setFieldError(id, "");
    });
}

/**
 * Live total on checkout: reads #ticketQty, multiplies by TICKET_UNIT_USD, writes to #priceTotal (two decimals).
 */
function updateCheckoutTotal() {
    var qtyEl = document.getElementById("ticketQty");
    var out = document.getElementById("priceTotal");
    if (!qtyEl || !out) {
        return;
    }
    var q = parseInt(qtyEl.value, 10);
    if (isNaN(q) || q < 1) {
        q = 0;
    }
    out.textContent = (q * TICKET_UNIT_USD).toFixed(2);
}

/**
 * Client-side checkout validation (form uses novalidate so we control messages).
 * Rules: date, type, qty 1–10, email required + valid, optional zip exactly 5 digits if present.
 * @returns {boolean} true if all checks pass
 */
function validateCheckout() {
    clearCheckoutErrors();
    var ok = true;

    var visitDate = document.getElementById("visitDate");
    if (!visitDate || !visitDate.value) {
        setFieldError("visitDate", "Please choose a visit date.");
        ok = false;
    }

    var ticketType = document.getElementById("ticketType");
    if (!ticketType || !ticketType.value) {
        setFieldError("ticketType", "Please select a ticket type.");
        ok = false;
    }

    var qtyEl = document.getElementById("ticketQty");
    var qty = qtyEl ? parseInt(qtyEl.value, 10) : NaN;
    if (isNaN(qty) || qty < 1 || qty > 10) {
        setFieldError("ticketQty", "Enter a whole number of tickets from 1 to 10.");
        ok = false;
    }

    var email = document.getElementById("checkoutEmail");
    if (!email || !email.value.trim()) {
        setFieldError("checkoutEmail", "Email is required.");
        ok = false;
    } else if (!email.checkValidity()) {
        setFieldError("checkoutEmail", "Enter a valid email address.");
        ok = false;
    }

    var zip = document.getElementById("zipCode");
    if (zip && zip.value.trim() !== "") {
        if (!/^\d{5}$/.test(zip.value.trim())) {
            setFieldError("zipCode", "Zip code must be exactly 5 digits.");
            ok = false;
        }
    }

    return ok;
}

/**
 * checkout.html: registers quantity listeners for price line; Place order click validates,
 * builds payload object, stores JSON in sessionStorage under "monoMuseOrder", redirects to order-confirmation.html.
 * sessionStorage is per-tab and cleared when the tab closes.
 */
function initCheckoutPage() {
    var btn = document.getElementById("placeOrderBtn");
    var qty = document.getElementById("ticketQty");
    if (qty) {
        qty.addEventListener("input", updateCheckoutTotal);
        qty.addEventListener("change", updateCheckoutTotal);
        updateCheckoutTotal();
    }
    if (btn) {
        btn.addEventListener("click", function () {
            if (!validateCheckout()) {
                var bad = document.querySelector("#checkoutForm [aria-invalid='true']");
                if (bad) {
                    bad.focus();
                }
                return;
            }
            var qtyVal = parseInt(document.getElementById("ticketQty").value, 10);
            var total = qtyVal * TICKET_UNIT_USD;
            var payload = {
                visitDate: document.getElementById("visitDate").value,
                ticketType: document.getElementById("ticketType").value,
                quantity: qtyVal,
                email: document.getElementById("checkoutEmail").value.trim(),
                zip: document.getElementById("zipCode") ? document.getElementById("zipCode").value.trim() : "",
                mailingList: document.getElementById("mailingList") ? document.getElementById("mailingList").checked : false,
                total: total
            };
            try {
                sessionStorage.setItem("monoMuseOrder", JSON.stringify(payload));
            } catch (e) {
                /* Private mode / quota: order still redirects but confirmation may show empty */
            }
            window.location.href = "order-confirmation.html";
        });
    }
}

/**
 * Minimal HTML entity escape before interpolating user/session data into innerHTML.
 * Prevents script injection if stored values ever contained < or &.
 */
function escHtml(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * order-confirmation.html: reads "monoMuseOrder" from sessionStorage, JSON.parse, builds summary HTML.
 * Uses escHtml on each dynamic value. If missing or corrupt JSON, shows friendly fallback with links back.
 */
function initOrderConfirmationPage() {
    var box = document.getElementById("orderSummary");
    if (!box) {
        return;
    }
    var raw = null;
    try {
        raw = sessionStorage.getItem("monoMuseOrder");
    } catch (e) {
        raw = null;
    }
    if (!raw) {
        box.innerHTML =
            "<p>We could not find order details. <a href=\"checkout.html\">Return to checkout</a> to place an order.</p>";
        return;
    }
    var o;
    try {
        o = JSON.parse(raw);
    } catch (err) {
        box.innerHTML = "<p>Order data could not be read. <a href=\"checkout.html\">Try checkout again</a>.</p>";
        return;
    }
    box.innerHTML =
        "<h2>Thank you — your order is confirmed</h2>" +
        "<p>This is a simulated checkout (no payment processed).</p>" +
        "<ul class=\"order-details\">" +
        "<li><strong>Visit date:</strong> " +
        escHtml(o.visitDate) +
        "</li>" +
        "<li><strong>Ticket type:</strong> " +
        escHtml(o.ticketType) +
        "</li>" +
        "<li><strong>Quantity:</strong> " +
        escHtml(o.quantity) +
        "</li>" +
        "<li><strong>Email:</strong> " +
        escHtml(o.email) +
        "</li>" +
        "<li><strong>Total:</strong> $" +
        escHtml(Number(o.total).toFixed(2)) +
        "</li>" +
        "</ul>" +
        "<p><a href=\"buytickets.html\" class=\"cta\">Back to tickets</a></p>";
}

/**
 * index.html gallery: stacks slides as position:absolute; only .gallery-slide--active is fully opaque.
 * Prev/Next wrap index with modulo. Updates aria-hidden for the visible slide.
 */
function initGallery() {
    var slides = document.querySelectorAll(".gallery-track .gallery-slide");
    var prev = document.querySelector(".gallery-prev");
    var next = document.querySelector(".gallery-next");
    if (!slides.length || !prev || !next) {
        return;
    }
    var i = 0;
    function show(idx) {
        i = (idx + slides.length) % slides.length;
        slides.forEach(function (s, j) {
            s.classList.toggle("gallery-slide--active", j === i);
            s.setAttribute("aria-hidden", j === i ? "false" : "true");
        });
    }
    prev.addEventListener("click", function () {
        show(i - 1);
    });
    next.addEventListener("click", function () {
        show(i + 1);
    });
    show(0);
}

/** Immediately invoked: attaches hamburger click once */
(function initNavToggle() {
    var ham = document.querySelector(".nav_hamburger");
    if (ham) {
        ham.addEventListener("click", toggleNav);
    }
}());

/*
 * Global boot: every function no-ops if its elements are absent, so one bundle works site-wide.
 */
ActiveNav();
runGreeting();
initMuseumMap();
initGallery();
initCheckoutPage();
initOrderConfirmationPage();

/*
 * jQuery section (runs only if jQuery loaded — index has it; other pages without jQuery skip this block).
 * - #readMore / #readLess
 */
if (typeof jQuery !== "undefined") {
    jQuery(function ($) {
        $("#readLess").on("click", function () {
            $("#longIntro").hide();
            $("#readLess").hide();
            $("#readMore").show();
        });
        $("#readMore").on("click", function () {
            $("#longIntro").show();
            $("#readLess").show();
            $("#readMore").hide();
        });

        $(".faq-item .faq-trigger").on("click", function () {
            var t = $(this);
            var panel = t.next(".faq-panel");
            panel.slideToggle(200);
            t.attr("aria-expanded", t.attr("aria-expanded") !== "true");
        });
    });
}
