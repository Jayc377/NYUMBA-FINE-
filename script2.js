const propertiess=[
{
        id: 1,
        title: "Modern 1-Bedroom Apartment",
        type: "1-Bedroom",
        area: "Westlands",
        rent: 45000,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["Parking", "Wi-Fi", "Reliable Water", "CCTV", "Balcony"],
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
        description: "A spacious, newly built 1-bedroom apartment located in the heart of Westlands with 24/7 security and steady water supply.",
        verified: true,
        status: "Available"
    },
    {
        id: 2,
        title: "Executive Bedsitter",
        type: "Bedsitter",
        area: "Kilimani",
        rent: 20000,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["Wi-Fi", "Reliable Water", "Security", "Kitchen"],
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
        description: "Clean and secure executive bedsitter in Kilimani featuring modern fittings and ample parking space.",
        verified: true,
        status: "Available"
    },
    {
        id: 3,
        title: "Family 2-Bedroom Apartment",
        type: "2-Bedroom",
        area: "Kasarani",
        rent: 35000,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ["Parking", "Reliable Water", "Electricity", "Security", "Kitchen"],
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
        description: "Family-friendly 2-bedroom home in Kasarani close to amenities, shopping centers, and main tarmac roads.",
        verified: true,
        status: "Available"
    },
    {
        id: 4,
        title: "Luxurious 3-Bedroom House",
        type: "3-Bedroom",
        area: "Embakasi",
        rent: 65000,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ["Parking", "Wi-Fi", "Reliable Water", "CCTV", "Balcony", "Security"],
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
        description: "Spacious compound house with high-end finishes, secure perimeter wall, and reliable county water access.",
        verified: true,
        status: "Available"
    }
];

// Local Storage Initialization
let favorites = JSON.parse(localStorage.getItem('nyumba_favorites')) || [];
let bookings = JSON.parse(localStorage.getItem('nyumba_bookings')) || [];

// Tab Navigation Logic
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    
    if (tabId === 'catalog') renderCatalog(properties);
    if (tabId === 'favorites') renderFavorites();
    if (tabId === 'bookings') renderBookings();
    
    window.scrollTo(0, 0);
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    renderFeatured();
    updateFavCount();
});

function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    grid.innerHTML = properties.slice(0, 3).map(p => createPropertyCard(p)).join('');
}

function renderCatalog(data) {
    const grid = document.getElementById('catalog-grid');
    if(data.length === 0) {
        grid.innerHTML = `<p>No houses match your search criteria. Try adjusting your filters.</p>`;
        return;
    }
    grid.innerHTML = data.map(p => createPropertyCard(p)).join('');
}

function createPropertyCard(p) {
    const isFav = favorites.includes(p.id);
    return `
        <div class="property-card">
            ${p.verified ? '<span class="card-badge"><i class="fa-solid fa-check"></i> Verified</span>' : ''}
            <img src="${p.image}" alt="${p.title}">
            <div class="card-body">
                <h3>${p.title}</h3>
                <p><i class="fa-solid fa-location-dot"></i> ${p.area}</p>
                <div class="price">Ksh ${p.rent.toLocaleString()} / mo</div>
                <p><i class="fa-solid fa-bed"></i> ${p.bedrooms} Bed | <i class="fa-solid fa-bath"></i> ${p.bathrooms} Bath</p>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="openDetails(${p.id})">View Details</button>
                    <button class="btn btn-outline" onclick="toggleFavorite(${p.id})">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Filtering Logic
function applyFilters() {
    const area = document.getElementById('filter-area').value;
    const type = document.getElementById('filter-type').value;
    const maxRent = document.getElementById('filter-rent').value;
    
    document.getElementById('rent-val').innerText = `Ksh ${Number(maxRent).toLocaleString()}`;

    const filtered = properties.filter(p => {
        return (area === "" || p.area === area) &&
               (type === "" || p.type === type) &&
               (p.rent <= maxRent);
    });

    renderCatalog(filtered);
}

function searchFromHero() {
    const area = document.getElementById('hero-area').value;
    switchTab('catalog');
    if(area) {
        document.getElementById('filter-area').value = area;
        applyFilters();
    }
}

// Modal & Property Details
function openDetails(id) {
    const p = properties.find(item => item.id === id);
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <img src="${p.image}" style="width:100%; height:250px; object-fit:cover; border-radius:6px; margin-bottom:15px;">
        <h2>${p.title}</h2>
        <p class="price">Ksh ${p.rent.toLocaleString()} per month</p>
        <p><strong>Location:</strong> ${p.area} Nairobi</p>
        <p><strong>Description:</strong> ${p.description}</p>
        <p style="margin-top:10px;"><strong>Amenities:</strong> ${p.amenities.join(', ')}</p>
        
        <div style="margin-top:20px; display:flex; gap:10px;">
            <button class="btn btn-primary" onclick="bookViewing(${p.id})"><i class="fa-regular fa-calendar-days"></i> Book Viewing</button>
            <a href="https://wa.me/254700000000?text=Hello,%20I%20am%20interested%20in%20${encodeURIComponent(p.title)}%20located%20in%20${p.area}" target="_blank" class="btn" style="background:#25D366; color:white; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:5px;"><i class="fa-brands fa-whatsapp"></i> WhatsApp Inquiry</a>
        </div>
    `;
    
    document.getElementById('property-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('property-modal').style.display = 'none';
}

// Favorites Handlers
function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if(index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('nyumba_favorites', JSON.stringify(favorites));
    updateFavCount();
    
    // Refresh current view if needed
    if(document.getElementById('tab-favorites').classList.contains('active')) renderFavorites();
    else if(document.getElementById('tab-catalog').classList.contains('active')) applyFilters();
    else renderFeatured();
}

function updateFavCount() {
    document.getElementById('fav-count').innerText = favorites.length;
}

function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    const favProps = properties.filter(p => favorites.includes(p.id));
    
    if(favProps.length === 0) {
        grid.innerHTML = `<p>You have not saved any favorite properties yet.</p>`;
        return;
    }
    grid.innerHTML = favProps.map(p => createPropertyCard(p)).join('');
}

// Booking Management
function bookViewing(id) {
    const p = properties.find(item => item.id === id);
    const date = prompt("Enter your preferred viewing date (e.g., 2026-10-20):");
    if(!date) return;
    
    const newBooking = {
        property: p.title,
        area: p.area,
        date: date,
        status: "Pending Approval"
    };
    
    bookings.push(newBooking);
    localStorage.setItem('nyumba_bookings', JSON.stringify(bookings));
    alert("Viewing booked successfully! The administrator will contact you.");
    closeModal();
}

function renderBookings() {
    const container = document.getElementById('bookings-list');
    if(bookings.length === 0) {
        container.innerHTML = `<p>You have no active viewing bookings.</p>`;
        return;
    }
    
    container.innerHTML = bookings.map(b => `
        <div style="background:white; padding:15px; margin-bottom:10px; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            <h3>${b.property}</h3>
            <p><strong>Area:</strong> ${b.area}</p>
            <p><strong>Scheduled Date:</strong> ${b.date}</p>
            <p><strong>Status:</strong> <span style="color:orange; font-weight:bold;">${b.status}</span></p>
        </div>
    `).join('');
}

function handleContact(e) {
    e.preventDefault();
    alert("Thank you for reaching out! We have received your message.");
    e.target.reset();
}

function openLoginModal() {
    alert("Login & User Accounts feature is ready for backend integration.");
}