// Cart State Holder
let cart = [];
const whatsappNumber = "8801322996072"; // আপনার দেওয়া নাম্বার

// DOM Elements
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');

// Add to Cart Click Listener
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.menu-item');
        const id = menuItem.getAttribute('data-id');
        const name = menuItem.getAttribute('data-name');
        const price = parseInt(menuItem.getAttribute('data-price'));

        addToCart(id, name, price);
    });
});

// Function to Add Item
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    renderCart();
}

// Change Quantity
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

// Render Cart UI
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

// WhatsApp Order dynamic Link Generation
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
    text += `कृपया, আমার অর্ডারটি কনফার্ম করুন এবং ডেলিভারি প্রসেস জানান।`;

    // Encode text for URL
    const encodedText = encodeURIComponent(text);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
    
    // Open in New Window
    window.open(whatsappURL, '_blank');
});
