let cart = [];
let total = 0;

function addToCart(name, price) {
    cart.push({
        name: name,
        price: price
    });

    total += price;

    updateCart();
}

function updateCart() {

    let cartBox = document.getElementById("cart-items");
    let totalBox = document.getElementById("total");

    if (!cartBox || !totalBox) return;

    cartBox.innerHTML = "";

    cart.forEach((item) => {

        cartBox.innerHTML += `
        <li>${item.name} - ৳${item.price}</li>
        `;

    });

    totalBox.innerHTML = "মোট = ৳" + total;

}

function sendWhatsApp(){

    if(cart.length===0){
        alert("প্রথমে খাবার নির্বাচন করুন");
        return;
    }

    let message="🍽️ Rifat Cafe Order%0A%0A";

    cart.forEach((item)=>{
        message += item.name+" - ৳"+item.price+"%0A";
    });

    message += "%0Aমোট বিল = ৳"+total;

    window.open(
    "https://wa.me/8801322996072?text="+message,
    "_blank"
    );

}
