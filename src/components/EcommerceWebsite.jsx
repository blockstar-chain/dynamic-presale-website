import React, { useEffect, useState } from 'react'

export default function EcommerceWebsite({ website, header, hero, products, categories, promo, reviews, cta, footer, social }) {
    if (!website || !header || !hero || !products || !categories || !promo || !reviews || !cta || !footer || !social) {
        return (<ErrorPage />);
    }

    const [previewHtml, setPreviewHtml] = useState('');

    const generatePreviewHtml = () => {
        const logoElement = website.logoUrl
            ? `<img src="${website.logoUrl}" alt="Logo" class="h-8 w-auto">`
            : `<div class="w-8 h-8 rounded-lg" style="background-color: ${website.primary_color};"></div>`;

        const navLinksHtml = header.navLinks && header.navLinks.map(link => `
            <a href="${link.href}" class="px-3 py-2 text-sm font-medium  hover:text-blue-600 transition-colors">${link.name}</a>
        `).join('');

        const headerHtml = `
            <header class=" backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200">
                <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div class="flex items-center gap-3">
                        ${logoElement}
                        <span class="text-xl font-bold ">${hero.title}</span>
                    </div>
                    <nav class="hidden md:flex items-center">
                        ${navLinksHtml}
                    </nav>
                    <div class="hidden md:flex items-center gap-4">
                        <button id="cart-button" class="relative">
                            <svg class="w-6 h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            <span id="cart-count" class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
                        </button>
                    </div>
                </div>
            </header>
        `;

        const productsHtml = products.items && products.items.map((item, index) => `
            <div class=" rounded-lg shadow-md overflow-hidden group">
                 <div class="h-64 bg-gray-200 flex items-center justify-center">
                    ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" class="w-full h-full object-cover">` : '<span class="text-gray-400">Product Image</span>'}
                </div>
                <div class="p-4">
                    <h4 class="text-lg font-bold ">${item.name}</h4>
                    <p class="mt-1  text-lg">$${item.price}</p>
                    <button class="add-to-cart-btn w-full mt-4 py-2 rounded-lg text-white font-semibold transform transition-transform hover:scale-105" style="background-color:${website.primary_color};"
                        data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.imageUrl}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');

        const categoriesHtml = categories.items && categories.items.map(item => `
             <div class="relative rounded-lg overflow-hidden h-40 group">
                <div class="absolute inset-0 bg-gray-200 flex items-center justify-center">
                     ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" class="w-full h-full object-cover">` : ''}
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h4 class="text-2xl font-bold text-white">${item.name}</h4>
                </div>
                 <a href="#" class="absolute inset-0"></a>
            </div>
        `).join('');

        const reviewsHtml = reviews.items && reviews.items.map(item => `
             <div class=" p-6 rounded-lg shadow-lg border border-gray-100">
                <p class=" italic">"${item.quote}"</p>
                <p class="mt-4 font-bold text-right ">- ${item.author}</p>
            </div>
        `).join('');

        const cartModalHtml = `
            <div id="cart-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                <div class=" w-full max-w-md h-full shadow-xl flex flex-col">
                    <div class="flex justify-between items-center p-4 border-b">
                        <h3 class="text-xl font-bold ">Your Cart</h3>
                        <button id="close-cart-btn" class="text-gray-500 hover:">&times;</button>
                    </div>
                    <div id="cart-items-container" class="flex-grow p-4 overflow-y-auto">
                        <!-- Cart items will be injected here -->
                    </div>
                    <div class="p-4 border-t">
                        <div class="flex justify-between font-bold text-lg ">
                            <span>Total</span>
                            <span id="cart-total">$0.00</span>
                        </div>
                        <button id="checkout-btn" class="w-full mt-4 py-3 rounded-lg text-white font-semibold" style="background-color: ${website.primary_color};">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        `;

        const checkoutModalHtml = `
            <div id="checkout-modal" class="hidden fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                 <div class=" w-full max-w-lg rounded-lg shadow-xl flex flex-col">
                     <div class="flex justify-between items-center p-4 border-b">
                        <h3 class="text-xl font-bold ">Checkout</h3>
                        <button id="close-checkout-btn" class="text-gray-500 hover:">&times;</button>
                    </div>
                    <div class="p-6 space-y-4">
                        <input class="w-full p-2 border rounded-md" placeholder="Full Name">
                        <input class="w-full p-2 border rounded-md" placeholder="Shipping Address">
                        <div class="flex gap-4">
                             <input class="w-full p-2 border rounded-md" placeholder="City">
                             <input class="w-full p-2 border rounded-md" placeholder="ZIP Code">
                        </div>
                        <div class="border-t pt-4">
                            <div class="flex border-b">
                                <button id="stripe-tab" class="flex-1 py-2 font-semibold border-b-2" style="border-color: ${website.primary_color}; color: ${website.primary_color};">Credit Card</button>
                                <button id="paypal-tab" class="flex-1 py-2 font-semibold text-gray-500">PayPal</button>
                            </div>
                            <div id="stripe-form" class="mt-4 space-y-3">
                                 <input class="w-full p-2 border rounded-md" placeholder="Card Number">
                                 <div class="flex gap-4">
                                     <input class="w-full p-2 border rounded-md" placeholder="MM / YY">
                                     <input class="w-full p-2 border rounded-md" placeholder="CVC">
                                 </div>
                            </div>
                            <div id="paypal-form" class="hidden mt-4 text-center">
                                <p class="">You will be redirected to PayPal to complete your payment.</p>
                            </div>
                        </div>
                         <button class="w-full mt-4 py-3 rounded-lg text-white font-semibold" style="background-color: ${website.primary_color};">Pay Now</button>
                    </div>
                 </div>
            </div>
        `;

        const cartScript = `
            let cart = [];
            const cartButton = document.getElementById('cart-button');
            const cartModal = document.getElementById('cart-modal');
            const closeCartBtn = document.getElementById('close-cart-btn');
            const cartCountEl = document.getElementById('cart-count');
            const cartItemsContainer = document.getElementById('cart-items-container');
            const cartTotalEl = document.getElementById('cart-total');
            const checkoutBtn = document.getElementById('checkout-btn');
            const checkoutModal = document.getElementById('checkout-modal');
            const closeCheckoutBtn = document.getElementById('close-checkout-btn');
            const stripeTab = document.getElementById('stripe-tab');
            const paypalTab = document.getElementById('paypal-tab');
            const stripeForm = document.getElementById('stripe-form');
            const paypalForm = document.getElementById('paypal-form');

            function updateCart() {
                cartCountEl.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
                if(cart.length === 0) {
                    cartItemsContainer.innerHTML = '<p class="text-gray-500">Your cart is empty.</p>';
                } else {
                    cartItemsContainer.innerHTML = cart.map(item => \`
                        <div class="flex items-center gap-4 py-2 border-b">
                            <img src="\${item.image || 'https://placehold.co/64'}" class="w-16 h-16 rounded-md object-cover">
                            <div class="flex-grow">
                                <p class="font-bold ">\${item.name}</p>
                                <p class="text-sm text-gray-500">$ \${item.price}</p>
                            </div>
                            <div class="">x \${item.quantity}</div>
                            <button class="remove-from-cart-btn text-red-500" data-id="\${item.id}">&times;</button>
                        </div>
                    \`).join('');
                }
                const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                cartTotalEl.innerText = '$' + total.toFixed(2);
                
                document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                         const id = e.target.dataset.id;
                         cart = cart.filter(item => item.id != id);
                         updateCart();
                    });
                });
            }

            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const existingItem = cart.find(item => item.id == id);
                    if(existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push({
                            id: id,
                            name: e.target.dataset.name,
                            price: parseFloat(e.target.dataset.price),
                            image: e.target.dataset.image,
                            quantity: 1
                        });
                    }
                    updateCart();
                });
            });

            cartButton.addEventListener('click', () => cartModal.classList.remove('hidden'));
            closeCartBtn.addEventListener('click', () => cartModal.classList.add('hidden'));
            checkoutBtn.addEventListener('click', () => {
                cartModal.classList.add('hidden');
                checkoutModal.classList.remove('hidden');
            });
            closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.add('hidden'));
            stripeTab.addEventListener('click', () => {
                stripeTab.style.borderColor = '${website.primary_color}';
                stripeTab.style.color = '${website.primary_color}';
                paypalTab.style.borderColor = 'transparent';
                paypalTab.style.color = '#6B7280';
                stripeForm.classList.remove('hidden');
                paypalForm.classList.add('hidden');
            });
            paypalTab.addEventListener('click', () => {
                paypalTab.style.borderColor = '${website.primary_color}';
                paypalTab.style.color = '${website.primary_color}';
                stripeTab.style.borderColor = 'transparent';
                stripeTab.style.color = '#6B7280';
                paypalForm.classList.remove('hidden');
                stripeForm.classList.add('hidden');
            });
        `;

        const smoothScrollScript = `
             document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
        `;

        const defaultLinks = social.defaultLinks ? social.defaultLinks : [];
        const customLinks = social.customLinks ? social.customLinks : [];
        const allSocialLinks = [...defaultLinks, ...customLinks];
        const socialLinksHtml = allSocialLinks.map(link => `
            <a href="${link.url}" target="_blank" class="px-5 py-3 rounded-lg bg-[${website.primary_color}] hover:[${website.primary_color} / 30] font-semibold text-white no-underline transition-all transform hover:scale-105">${link.name}</a>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html lang="en" class="scroll-smooth">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.tailwindcss.com"><\/script>
                <style>
                    body { 
                        background-color: ${website.background_color};
                        color: ${website.text_color};
                        font-family: sans-serif;
                    }
                </style>
            </head>
            <body class="antialiased" style="color: ${website.text_color};">
                ${headerHtml}
                <main>
                    <section id="hero" class="text-center py-24 ">
                        <div class="container mx-auto px-4">
                            <h2 class="text-5xl font-extrabold" style="color: ${website.primary_color};">${hero.short_title}</h2>
                            <p class="max-w-2xl mx-auto mt-4 text-lg ">${hero.description}</p>
                            <a href="#products" class="mt-8 inline-block text-white px-8 py-3 rounded-lg transition-transform transform hover:scale-105" style="background-color: ${website.primary_color};">Shop Collection</a>
                        </div>
                    </section>
                    <section id="products" class="py-24">
                        <div class="container mx-auto px-4 text-center">
                            <h3 class="text-4xl font-bold ">${products.title}</h3>
                            <div class="inline-block border-b-2 mt-2" style="border-color: ${website.primary_color}; width: 80px;"></div>
                            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12 text-left">
                                ${productsHtml}
                            </div>
                        </div>
                    </section>
                     <section id="categories" class="py-24 ">
                        <div class="container mx-auto px-4 text-center">
                            <h3 class="text-4xl font-bold ">${categories.title}</h3>
                             <div class="inline-block border-b-2 mt-2" style="border-color: ${website.primary_color}; width: 80px;"></div>
                            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12 text-left">
                                ${categoriesHtml}
                            </div>
                        </div>
                    </section>
                     <section id="promo" class="py-20" style="background-color: ${website.primary_color};">
                        <div class="container mx-auto px-4 text-center">
                             <h3 class="text-3xl font-bold text-white">${promo.title}</h3>
                             <p class="mt-2 text-white/80">${promo.description}</p>
                             <a href="#" class="mt-6 inline-block  px-6 py-3 rounded-lg font-semibold transform hover:scale-105 transition-transform" style="color: ${website.primary_color};">${promo.buttonText}</a>
                        </div>
                    </section>
                    <section id="reviews" class="py-24">
                        <div class="container mx-auto px-4 text-center">
                             <h3 class="text-4xl font-bold ">${reviews.title}</h3>
                             <div class="inline-block border-b-2 mt-2" style="border-color: ${website.primary_color}; width: 80px;"></div>
                             <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12 text-left">
                                ${reviewsHtml}
                             </div>
                        </div>
                    </section>
                </main>
                <section id="contact" class="py-24 ">
                    <div class="container mx-auto text-center max-w-3xl">
                        <h2 class="text-4xl font-bold ">${cta.title}</h2>
                        <p class="mt-4 ">${cta.description}</p>
                        <a href="#" class="mt-8 inline-block text-white px-8 py-4 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105" style="background-color: ${website.primary_color};">Contact Us Today</a>
                        <div class="mt-8 flex flex-wrap justify-center gap-4">
                            ${socialLinksHtml}
                        </div>
                    </div>
                </section>
                <footer class="py-10 border-t border-gray-200 text-center text-gray-500 text-sm">
                    <div class="container mx-auto">
                        <p>${footer.copyright}</p>
                    </div>
                </footer>
                ${cartModalHtml}
                ${checkoutModalHtml}
                <script>
                    document.addEventListener('DOMContentLoaded', () => {
                        ${smoothScrollScript}
                        ${cartScript}
                    });
                <\/script>
            </body>
            </html>
        `;
        setPreviewHtml(html);
    };

    useEffect(() => {
        generatePreviewHtml();
    }, []);

    return (
        <main className="h-screen">
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="w-full h-full transform origin-center bg-white">
                    <iframe srcDoc={previewHtml} title="Live Preview" className="w-full h-full border-0" />
                </div>
            </div>
        </main>
    )
}
