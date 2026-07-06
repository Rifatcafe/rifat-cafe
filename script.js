// ========================================================
// ১. স্টক কন্ট্রোল সেকশন (True = আছে, False = স্টক আউট)
// ========================================================
const stockStatus = {
    chickenBiryani: true,  // চিকেন বিরিয়ানি
    chickenKhichuri: true, // চিকেন খিচুড়ি
    morogPolao: true,      // মোরগ পোলাও
    beefBiryani: false     // বিফ বিরিয়ানি (উদাহরণস্বরূপ এটি ফলস বা স্টক আউট রাখা হলো)
};

// সাইট লোড হওয়ার সময় স্টক চেক করার অটোমেটিক ফাংশন
document.addEventListener("DOMContentLoaded", () => {
    checkStock('1', stockStatus.chickenBiryani);
    checkStock('2', stockStatus.chickenKhichuri);
    checkStock('3', stockStatus.morogPolao);
    checkStock('4', stockStatus.beefBiryani);
});

function checkStock(itemId, isAvailable) {
    const menuItem = document.querySelector(`.menu-item[data-id="${itemId}"]`);
    if (!menuItem) return;
    
    const button = menuItem.querySelector('.add-to-cart-btn');
    
    if (!isAvailable) {
        button.disabled = true;
        button.innerHTML = `<i class="fa-solid fa-ban"></i> Stock Out`;
        button.style.background = "#444";
        button.style.color = "#777";
        button.style.cursor = "not-allowed";
        
        const imgPlaceholder = menuItem.querySelector('.item-img-placeholder');
        if(imgPlaceholder) imgPlaceholder.style.opacity = "0.4";
    }
}

// ========================================================
// ২. কার্ট এবং অর্ডার সেকশন (আগের কোড)
// ========================================================
let cart = [];
const whatsappNumber = "8801322996072"; 

const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.menu-item');
        const id = menuItem.getAttribute('data-id');
        const name = menuItem.getAttribute('data-name');
        const price = parseInt(menuItem.getAttribute('data-price'));

        addToCart(id, name, price);
    });
});

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    renderCart();
}

function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    renderCart();
}

function renderCart() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">কার্ট খালি আছে। খাবার যোগ করুন।</p>';
        cartTotalElement.innerText = '৳০';
        whatsappOrderBtn.disabled = true;
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('div');
        row.classList.add('cart-item-row');
        row.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <div class="cart-item-controls">
                <button onclick="changeQuantity('${item.id}', -1)">-</button>
                <button onclick="changeQuantity('${item.id}', 1)">+</button>
                <span style="margin-left: 10px; color: #d4af37;">৳${itemTotal}</span>
            </div>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotalElement.innerText = `৳${total}`;
    whatsappOrderBtn.disabled = false;
}

whatsappOrderBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    let text = `*New Order From Rifat Cafe Website*\n`;
    text += `-----------------------------------\n`;
    
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        text += `${index + 1}. ${item.name} - ${item.quantity}টি = ৳${itemTotal}\n`;
    });
    
    text += `-----------------------------------\n`;
    text += `*সর্বমোট বিল:* ৳${total}\n\n`;
    text += `অনুগ্রহ করে আমার অর্ডারটি কনফার্ম করুন এবং ডেলিভারি প্রসেস জানান।`;

    const encodedText = encodeURIComponent(text);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
    window.open(whatsappURL, '_blank');
});

