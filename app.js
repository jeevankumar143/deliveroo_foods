        // Use the same API URL configuration from your previous simple task app
        const API_BASE_URL = 'http://localhost:3000';

        // Use the simplified Unicode characters for rating stars
        const starUnicode = '&#11088;'; // Simplified ⭐ character

        let cart = []; // This array acts as the "memory" for your selected food
        let allMenuItems = []; // This will store the full menu for filtering

function addToCart(name, price) {
    // 1. Check if the item is already in the cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        // If it exists, just add 1 to the quantity
        existingItem.quantity += 1;
    } else {
        // If it is new, add it to the cart with a quantity of 1
        cart.push({ name: name, price: price, quantity: 1 });
    }
    
    // 2. Update the orange cart count icon (count all quantities)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.innerText = totalItems;
    }

    // 3. SHOW THE POPUP (Your custom code kept safe!)
    const toast = document.getElementById('cartToast');
    const toastMsg = document.getElementById('toastMessage');

    toastMsg.innerText = `${name} added to cart!`;
    toast.classList.add('show');

    // 4. HIDE IT AFTER 3 SECONDS
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
function showCheckout() {
    const modal = document.getElementById('checkoutModal');
    const billItems = document.getElementById('billItems');
    const billTotals = document.getElementById('billTotals');

    if (cart.length === 0) {
        document.getElementById('emptyCartModal').style.display = 'flex';
        return; 
    }

    // Calculation Logic
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = subtotal * 0.05; 
    const delivery = 40; 
    const grandTotal = subtotal + gst + delivery;

    // 👇 UPDATED: Display Items with detailed math (Qty x Price = Total)
    billItems.innerHTML = cart.map((item, index) => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-weight:500; border-bottom:1px solid #eee; padding-bottom:10px;">
            
            <span style="flex:2; color:var(--text-color, #333);">
                ${item.name}
            </span>
            
            <span style="flex:3; text-align:right; margin-right:15px; font-size:13px; color:var(--text-color, #666);">
                ${item.quantity} x ₹${item.price} = <span style="font-weight:bold; font-size:15px; color:var(--text-color, #222);">₹${item.price * item.quantity}</span>
            </span>
            
            <button onclick="removeFromCart(${index})" style="background:#fff0ec; color:#e75a24; border:none; padding:6px 10px; border-radius:4px; font-size:12px; font-weight:bold; cursor:pointer; transition:0.2s; white-space:nowrap;">
                Remove
            </button>
            
        </div>
    `).join('');

    // Display Summary Math
    billTotals.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:var(--text-color, #555);">
            <span>Item Total</span>
            <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; color:var(--text-color, #555);">
            <span>GST (5%)</span>
            <span>₹${gst.toFixed(2)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; color:var(--text-color, #555);">
            <span>Delivery Fee</span>
            <span>₹${delivery}</span>
        </div>
        <hr style="border:none; border-top:1px dashed #ccc; margin-bottom:15px;">
        <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:bold; color:var(--text-color, #222);">
            <span>Grand Total</span>
            <span>₹${grandTotal.toFixed(2)}</span>
        </div>
    `;

    modal.style.display = 'flex'; 
}
function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        // If there is more than 1, just subtract 1
        cart[index].quantity -= 1;
    } else {
        // If there is only 1 left, remove the item completely
        cart.splice(index, 1);
    }
    
    // Update the orange cart icon number
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.innerText = totalItems;
    }
    
    // Refresh the cart UI
    if (cart.length === 0) {
        closeModal(); // Hide the checkout modal
        showCheckout(); // This will now trigger the Empty Cart modal
    } else {
        showCheckout(); // Redraw with new totals
    }
}

function closeModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}


function closeEmptyCart() {
    document.getElementById('emptyCartModal').style.display = 'none';
}

function closeEmptyCartAndBrowse() {
    // Hide the modal and smoothly scroll the user down to the food section!
    closeEmptyCart();
    document.querySelector('.categories').scrollIntoView({ behavior: 'smooth' });
}

        async function fetchMenu() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/menu`);
        const items = await response.json();

        allMenuItems = items; // Save the fetched items to our global variable!

        const grid = document.getElementById('menuGrid');
        
        if (items.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #888; padding: 50px;">Your database is empty. Add items using the POST route in Postman or a script!</p>';
            return;
        }

        // Use the new helper function to draw the items
        displayItems(allMenuItems);

    } catch (err) {
        console.error('Fetch error:', err);
        document.getElementById('menuGrid').innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #C0392B;">Error connecting to your backend server. Ensure it is running on port 3000.</p>';
    }
}

// Helper function to draw the food cards on the screen
function displayItems(itemsToDisplay) {
    const grid = document.getElementById('menuGrid');
    
    if (itemsToDisplay.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #888; padding: 50px;">No items found for this category! 🍕</p>';
        return;
    }

    grid.innerHTML = itemsToDisplay.map(item => `
        <div class="restaurant-card">
            <img src="${item.image}" alt="${item.name}">
            <div class="restaurant-details">
                <h3>${item.name}</h3>
                <p class="restaurant-tags">${item.description}</p>
                
                <div class="card-meta">
                    <div class="meta-rating">
                        <span class="rating-star">${starUnicode}</span>
                        ${item.rating}
                    </div>
                    <div class="meta-time">${item.deliveryTime} mins</div>
                    <div class="meta-price">₹${item.price}</div>
                    <button class="add-to-cart" onclick="addToCart('${item.name}', ${item.price})">ADD</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Call the function as soon as the page loads
fetchMenu();

   async function confirmOrder() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        alert("Please Sign In to save your orders!");
        openAuth();
        return;
    }

    // 👇 NEW LOGIC: Check Delivery Distance First! 👇
    if (userLat === null || userLon === null) {
        alert("Please set your delivery location at the top of the page first!");
        closeModal(); // Close the checkout cart
        openLocationModal(); // Pop open the location setter
        return;
    }

    const distance = calculateDistance(RESTAURANT_LAT, RESTAURANT_LON, userLat, userLon);
    
    if (distance > MAX_DELIVERY_KM) {
        // Show the out-of-range error popup and stop the order
        document.getElementById('userDistanceDisplay').innerText = distance.toFixed(1);
        closeModal(); 
        document.getElementById('outOfRangeModal').style.display = 'flex';
        return;
    }
    // 👆 END NEW LOGIC 👆

    // If they pass the distance test, calculate the final bill
    // (Fixed to include item.quantity so multiples are charged correctly!)
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderData = {
        email: userEmail,
        items: cart,
        totalAmount: subtotal + (subtotal * 0.05) + 40
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert("🚀 Order Placed and saved to your account!");
            cart = []; 
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) cartCount.innerText = '0';
            closeModal();
        } else {
            alert("Something went wrong with your order.");
        }
    } catch (err) {
        alert("Error connecting to server.");
    }
}


function openAuth() {
    document.getElementById('authModal').style.display = 'flex';
}

function closeAuth() {
    document.getElementById('authModal').style.display = 'none';
}

async function handleAuth() {
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPass').value;
    const name = document.getElementById('userName').value;

    if (!email || !password) return alert("Please fill all fields!");

    const endpoint = isSignUpMode ? '/api/signup' : '/api/login';
    const payload = isSignUpMode ? { name, email, password } : { email, password };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // 🟢 THIS IS THE CRITICAL CHECK
        if (response.ok) { 
            // Only runs if password is correct and user exists
            localStorage.setItem('userName', data.name || data.email.split('@')[0]);
            localStorage.setItem('userEmail', data.email);
            updateUserUI(localStorage.getItem('userName'), data.email);
            closeAuth();
            alert("Login Successful!");
        } else {
            // 🔴 Runs if server sent 401 (Wrong Pass) or 400 (User exists)
            alert(data.error || "Login Failed!"); 
        }
    } catch (err) {
        alert("Server is offline or database connection failed!");
    }
}

function updateUserUI(name, email) {
    const signInBtn = document.getElementById('signInBtn');
    const profileBtn = document.getElementById('profileBtn');
    const userInitial = document.getElementById('userInitial');
    const userNameDisplay = document.getElementById('userNameDisplay');

    if (name) {
        signInBtn.style.display = 'none';
        profileBtn.style.display = 'inline-block';
        
        // 1. Set the Initial (e.g., 'J' for Jeevan)
        userInitial.innerText = name.charAt(0).toUpperCase();
        
        // 2. Set the Name in the dropdown
        userNameDisplay.innerText = name;
    } else {
        signInBtn.style.display = 'block';
        profileBtn.style.display = 'none';
    }
}
let isSignUpMode = false; // Track which mode we are in

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode; // Switch between true/false
    
    const title = document.getElementById('authTitle');
    const desc = document.getElementById('authDesc');
    const nameInput = document.getElementById('userName');
    const btn = document.getElementById('authSubmitBtn');
    const toggleMsg = document.getElementById('toggleMsg');
    const toggleLink = document.getElementById('toggleLink');

    if (isSignUpMode) {
        title.innerText = "Create Account";
        desc.innerText = "Join FoodFlow to start ordering";
        nameInput.style.display = "block"; // Show the Name field
        btn.innerText = "Create Account";
        toggleMsg.innerText = "Already have an account?";
        toggleLink.innerText = "Sign In";
    } else {
        title.innerText = "Welcome Back";
        desc.innerText = "Login to track your FoodFlow orders";
        nameInput.style.display = "none"; // Hide the Name field
        btn.innerText = "Sign In";
        toggleMsg.innerText = "Don't have an account?";
        toggleLink.innerText = "Sign Up";
    }
}
    function handleProfileClick() {
    const savedName = localStorage.getItem('userName');
    
    if (!savedName) {
        // If not logged in, open the regular login modal
        openAuth();
    } else {
        // If logged in, toggle the dropdown list
        document.getElementById("profileMenu").classList.toggle("show");
    }
}

// Close the dropdown if the user clicks anywhere else on the screen
// Close the dropdown if the user clicks anywhere else on the screen
window.onclick = function(event) {
    // If the user clicks outside the avatar circle AND outside the dropdown content
    if (!event.target.closest('.user-avatar') && !event.target.closest('.dropdown-content')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
}
// function updateUserUI(name) {
//     const signInBtn = document.getElementById('signInBtn');
//     const profileBtn = document.getElementById('profileBtn');
//     const userNameDisplay = document.getElementById('userNameDisplay');

//     if (name) {
//         // User is logged in: Hide Sign In, Show Profile
//         signInBtn.style.display = 'none';
//         profileBtn.style.display = 'inline-block';
//         userNameDisplay.innerText = name;
//     } else {
//         // User is logged out: Show Sign In, Hide Profile
//         signInBtn.style.display = 'block';
//         profileBtn.style.display = 'none';
//     }
// }

// Logic to toggle the dropdown list
function toggleProfileMenu() {
    document.getElementById("profileMenu").classList.toggle("show");
}

function logout() {
    if (confirm("Do you want to logout?")) {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        location.reload(); // Reset UI state
    }
}
async function showMyOrders() {
    const userEmail = localStorage.getItem('userEmail');
    const modal = document.getElementById('ordersModal');
    const historyList = document.getElementById('orderHistoryList');

    if (!userEmail) {
        alert("Please Sign In to view your order history!");
        return;
    }

    modal.style.display = 'flex'; // Show the window
    historyList.innerHTML = '<p style="text-align:center; color:#888;">📡 Loading your history...</p>';

    try {
        // Fetch only orders belonging to THIS email
        const response = await fetch(`${API_BASE_URL}/api/my-orders/${userEmail}`);
        const orders = await response.json();

        if (orders.length === 0) {
            historyList.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">You haven\'t placed any orders yet! 🍕</p>';
            return;
        }

        // Build the list of orders
        historyList.innerHTML = orders.reverse().map(order => {
            // 1. Format the Date and Time cleanly
            const orderDate = new Date(order.date).toLocaleString('en-IN', { 
                day: 'numeric', month: 'short', year: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
            });

            // 2. Figure out the Live Status
            const currentStatus = order.status || 'Pending';
            
            // 3. Pick the colors for the status badge
            let statusColor = '#856404'; // Default Yellow Text
            let statusBg = '#FFF3CD';    // Default Yellow Bg
            let statusIcon = '⏳';
            
            if (currentStatus === 'Preparing') { 
                statusColor = '#004085'; statusBg = '#CCE5FF'; statusIcon = '👨‍🍳';
            } else if (currentStatus === 'Delivered') { 
                statusColor = '#155724'; statusBg = '#D4EDDA'; statusIcon = '✅';
            }

            // 4. Print the HTML for the card
            return `
            <div style="background:#fdfbfa; padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid #eee; box-shadow:0 2px 5px rgba(0,0,0,0.02);">
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <span style="font-weight:600; color:#555; font-size:13px;">📅 ${orderDate}</span>
                    <span style="background:${statusBg}; color:${statusColor}; padding:5px 10px; border-radius:20px; font-size:12px; font-weight:bold;">
                        ${statusIcon} ${currentStatus}
                    </span>
                </div>
                
                <div style="font-size:14px; color:#444; margin-bottom:12px; line-height:1.5;">
                    <b>Items:</b> ${order.items.map(item => `${item.quantity || 1}x ${item.name}`).join(', ')}
                </div>
                
                <div style="display:flex; justify-content:space-between; font-weight:bold; color:#222; border-top:1px dashed #ddd; padding-top:12px;">
                    <span>Total Paid:</span>
                    <span style="color:#e75a24;">₹${order.totalAmount.toFixed(2)}</span>
                </div>
                
            </div>
            `;
        }).join('');

    } catch (err) {
        historyList.innerHTML = '<p style="text-align:center; color:#C0392B;">Error fetching history. Is your server running?</p>';
    }
}
function filterByCategory(category) {
    if (category === 'All') {
        displayItems(allMenuItems);
        return;
    }

    const filtered = allMenuItems.filter(item => 
        item.name.toLowerCase().includes(category.toLowerCase()) || 
        item.description.toLowerCase().includes(category.toLowerCase())
    );

    displayItems(filtered);
    // Smoothly scroll down to the food results
    document.querySelector('.restaurants').scrollIntoView({ behavior: 'smooth' });
}

// Add this at the very bottom of your script
window.onload = function() {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');

    if (savedName && savedEmail) {
        // If memory exists, hide the 'Sign In' button and show the profile circle
        updateUserUI(savedName, savedEmail);
    }
};

function openForgotModal() {
    closeAuth(); // Close the login window
    document.getElementById('forgotModal').style.display = 'flex';
    document.getElementById('otpRequestStep').style.display = 'block';
    document.getElementById('otpVerifyStep').style.display = 'none';
}

async function requestOTP() {
    const email = document.getElementById('resetEmail').value;
    if (!email) return alert("Please enter your email!");

    try {
        const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();

        if (response.ok) {
            alert("OTP sent to your email!");
            document.getElementById('otpRequestStep').style.display = 'none';
            document.getElementById('otpVerifyStep').style.display = 'block';
        } else {
            alert(data.error);
        }
    } catch (err) {
        alert("Error connecting to server.");
    }
}

async function resetPassword() {
    const email = document.getElementById('resetEmail').value;
    const otp = document.getElementById('resetOtp').value;
    const newPassword = document.getElementById('newPassword').value;

    if (!otp || !newPassword) return alert("Please fill all fields!");

    try {
        const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword })
        });
        const data = await response.json();

        if (response.ok) {
            alert("Password successfully changed!");
            document.getElementById('forgotModal').style.display = 'none';
            openAuth(); // Re-open login window so they can log in
        } else {
            alert(data.error);
        }
    } catch (err) {
        alert("Error updating password.");
    }
}

// --- SETTINGS UI LOGIC ---
function openSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
    document.getElementById('darkModeToggle').checked = document.body.classList.contains('dark-mode');
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

// --- DARK MODE LOGIC ---
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark); // Save preference
}

// Check for dark mode when page loads
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// --- DATABASE UPDATE LOGIC ---
async function updateName() {
    const email = localStorage.getItem('userEmail');
    const newName = document.getElementById('settingNewName').value;
    
    if (!email) return alert("Please Sign In first!");
    if (!newName) return alert("Please enter a name!");

    try {
        const response = await fetch(`${API_BASE_URL}/api/user/name`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newName })
        });
        
        if (response.ok) {
            alert("Name updated successfully!");
            localStorage.setItem('userName', newName); // Update local memory
            updateUserUI(newName, email); // Update the UI instantly
            document.getElementById('settingNewName').value = '';
        } else {
            alert("Failed to update name.");
        }
    } catch (err) { alert("Server Error"); }
}

async function updatePassword() {
    const email = localStorage.getItem('userEmail');
    const currentPassword = document.getElementById('settingOldPass').value;
    const newPassword = document.getElementById('settingNewPass').value;

    if (!email) return alert("Please Sign In first!");
    if (!currentPassword || !newPassword) return alert("Please fill both password fields!");

    try {
        const response = await fetch(`${API_BASE_URL}/api/user/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, currentPassword, newPassword })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert("Password updated successfully!");
            document.getElementById('settingOldPass').value = '';
            document.getElementById('settingNewPass').value = '';
            closeSettings();
        } else {
            alert(data.error || "Failed to update password.");
        }
    } catch (err) { alert("Server Error"); }
}


// --- DELIVERY DISTANCE SETTINGS ---
const RESTAURANT_LAT = 21.1280; // Replace with your Shop's Latitude                        ||                                   ||
const RESTAURANT_LON = 81.767; // Replace with your Shop's Longitude                        || latitude and longitude update here||
const MAX_DELIVERY_KM = 10; // 10 km limit                                                  ||                                   ||

let userLat = null;
let userLon = null;

function openLocationModal() {
    document.getElementById('locationModal').style.display = 'flex';
}

// 1. Get location via Browser GPS
function getLocationGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                userLat = position.coords.latitude;
                userLon = position.coords.longitude;
                
                // Get the text name of the city using free OpenStreetMap API
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLat}&lon=${userLon}`);
                    const data = await res.json();
                    let shortAddress = data.address.city || data.address.town || data.address.suburb || "Current Location";
                    document.getElementById('headerAddressDisplay').value = shortAddress;
                } catch(e) {
                    document.getElementById('headerAddressDisplay').value = "Current Location (GPS)";
                }
                
                document.getElementById('locationModal').style.display = 'none';
                alert("Location updated via GPS!");
            },
            (error) => { alert("Please allow location permissions in your browser to use this feature."); }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// 2. Get location via Manual Typing
async function setManualAddress() {
    const addr = document.getElementById('manualAddress').value;
    if(!addr) return alert("Please type an address!");

    try {
        // Convert the typed address into GPS coordinates using OpenStreetMap
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`);
        const data = await res.json();
        
        if(data && data.length > 0) {
            userLat = parseFloat(data[0].lat);
            userLon = parseFloat(data[0].lon);
            document.getElementById('headerAddressDisplay').value = addr.substring(0, 20) + '...';
            document.getElementById('locationModal').style.display = 'none';
            alert("Address found and saved!");
        } else {
            alert("Address not found! Try adding the city name (e.g., 'Main Street, New York').");
        }
    } catch (err) {
        alert("Error connecting to mapping service.");
    }
}

// 3. The Math: Haversine Formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}


// --- LIVE ADDRESS SUGGESTION LOGIC ---
let suggestionTimeout; // Used to prevent spamming the API

async function fetchAddressSuggestions() {
    const query = document.getElementById('manualAddress').value;
    const suggestionsBox = document.getElementById('addressSuggestions');

    // If they clear the box or type less than 3 letters, hide the suggestions
    if (query.length < 3) {
        suggestionsBox.style.display = 'none';
        return;
    }

    // Wait 500ms after the user stops typing before asking the map server
    clearTimeout(suggestionTimeout);
    suggestionTimeout = setTimeout(async () => {
        try {
            // Ask OpenStreetMap for up to 5 matching places
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
            const data = await res.json();

            if (data && data.length > 0) {
                // Draw the suggestions inside the box
                suggestionsBox.innerHTML = data.map(place => {
                    // Clean up the name so it doesn't break the HTML quotes
                    const safeName = place.display_name.replace(/'/g, "\\'"); 
                    return `
                        <div onclick="selectSuggestion('${safeName}', ${place.lat}, ${place.lon})" style="padding:10px 12px; border-bottom:1px solid #eee; cursor:pointer; font-size:13px; color:#555; transition:background 0.2s;" onmouseover="this.style.background='#fdfbfa'" onmouseout="this.style.background='white'">
                            ${place.display_name}
                        </div>
                    `;
                }).join('');
                suggestionsBox.style.display = 'block'; // Show the box!
            } else {
                // If it can't find anything
                suggestionsBox.innerHTML = '<div style="padding:10px; font-size:13px; color:#888; text-align:center;">No exact match found...</div>';
                suggestionsBox.style.display = 'block';
            }
        } catch (err) {
            console.error("Suggestion error:", err);
        }
    }, 500);
}

// When the user clicks a dropdown item, do the math and save it instantly!
function selectSuggestion(address, lat, lon) {
    document.getElementById('manualAddress').value = address; // Fill the input bar
    document.getElementById('addressSuggestions').style.display = 'none'; // Hide dropdown
    
    // Save the GPS coordinates for the Place Order check later
    userLat = parseFloat(lat);
    userLon = parseFloat(lon);
    
    // Update the header display
    document.getElementById('headerAddressDisplay').value = address.substring(0, 25) + '...';
    document.getElementById('locationModal').style.display = 'none';
    
    alert("📍 Address selected and saved!");
}