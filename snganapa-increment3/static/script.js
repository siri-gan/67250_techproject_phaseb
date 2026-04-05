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