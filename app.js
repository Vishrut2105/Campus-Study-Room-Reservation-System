/**
 * Campus Study Room Reservation System
 * Plain, clean, easy-to-understand Vanilla JavaScript
 */

// --- 1. SAMPLE DATA (Campus Study Rooms) ---
const ROOMS_DATA = [
  {
    id: 1,
    name: "Room 101 - Silent Nook",
    floor: "1st Floor (West Wing)",
    capacity: 1,
    capacityCategory: "small",
    type: "Quiet Study",
    amenities: ["Power Outlets", "Desk Lamp", "Ergonomic Chair", "Noise-Cancelling"]
  },
  {
    id: 2,
    name: "Room 104 - Focus Pod",
    floor: "1st Floor (East Wing)",
    capacity: 2,
    capacityCategory: "small",
    type: "Quiet Study",
    amenities: ["Dual Monitor", "Power Outlets", "Adjustable Desks"]
  },
  {
    id: 3,
    name: "Room 205 - Collab Hub",
    floor: "2nd Floor (Central Area)",
    capacity: 4,
    capacityCategory: "medium",
    type: "Group Discussion",
    amenities: ["Whiteboard", "Markers", "Power Strip", "Natural Light"]
  },
  {
    id: 4,
    name: "Room 210 - Think Tank",
    floor: "2nd Floor (North Wing)",
    capacity: 5,
    capacityCategory: "medium",
    type: "Group Discussion",
    amenities: ["Whiteboard", "Conference Table", "Display Monitor"]
  },
  {
    id: 5,
    name: "Room 302 - Media Studio",
    floor: "3rd Floor (Digital Commons)",
    capacity: 8,
    capacityCategory: "large",
    type: "Media & Presentation",
    amenities: ["65\" Smart TV", "HDMI/AirPlay", "Webcam & Mic", "Whiteboard"]
  },
  {
    id: 6,
    name: "Room 308 - Seminar Boardroom",
    floor: "3rd Floor (Executive Wing)",
    capacity: 10,
    capacityCategory: "large",
    type: "Media & Presentation",
    amenities: ["Projector", "Surround Speakers", "Conference Phone", "Whiteboard"]
  }
];

// Standard study time slots
const TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM"
];

// Local Storage Key
const STORAGE_KEY = "campus_study_room_bookings";

// State Variables
let currentSelectedRoom = null;
let currentSelectedSlot = null;

// --- 2. INITIALIZATION ON PAGE LOAD ---
window.addEventListener("DOMContentLoaded", () => {
  // Set date picker to today's date by default
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("filterDate");
  dateInput.value = today;
  dateInput.min = today; // Prevent booking dates in the past

  // Seed sample initial bookings if first time opening
  seedInitialDataIfEmpty(today);

  // Render initial room list
  renderRooms();
  updateBookingCountBadge();
});

// Seed a couple of mock bookings so the user can immediately see booked vs available slots
function seedInitialDataIfEmpty(todayDate) {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const sampleBookings = [
      {
        id: "BK-1001",
        refCode: "REF-4821",
        roomId: 3,
        roomName: "Room 205 - Collab Hub",
        floor: "2nd Floor (Central Area)",
        date: todayDate,
        timeSlot: "10:00 AM - 11:00 AM",
        studentName: "Sarah Miller",
        studentId: "STU-2024-102",
        studentEmail: "sarah@university.edu",
        purpose: "Group Assignment",
        createdAt: new Date().toISOString()
      },
      {
        id: "BK-1002",
        refCode: "REF-9182",
        roomId: 5,
        roomName: "Room 302 - Media Studio",
        floor: "3rd Floor (Digital Commons)",
        date: todayDate,
        timeSlot: "01:00 PM - 02:00 PM",
        studentName: "David Chen",
        studentId: "STU-2024-419",
        studentEmail: "david@university.edu",
        purpose: "Project Presentation Practice",
        createdAt: new Date().toISOString()
      }
    ];
    saveBookingsToStorage(sampleBookings);
  }
}

// --- 3. LOCAL STORAGE HELPERS ---
function getBookingsFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveBookingsToStorage(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

// --- 4. RENDER ROOMS LIST ---
function renderRooms() {
  const selectedDate = document.getElementById("filterDate").value;
  const capacityFilter = document.getElementById("filterCapacity").value;
  const typeFilter = document.getElementById("filterType").value;
  const roomsGrid = document.getElementById("roomsGrid");
  const countText = document.getElementById("roomCountText");

  // Filter the rooms based on dropdown criteria
  const filteredRooms = ROOMS_DATA.filter(room => {
    const matchesCapacity = (capacityFilter === "all" || room.capacityCategory === capacityFilter);
    const matchesType = (typeFilter === "all" || room.type === typeFilter);
    return matchesCapacity && matchesType;
  });

  countText.textContent = `Showing ${filteredRooms.length} room${filteredRooms.length !== 1 ? 's' : ''}`;

  if (filteredRooms.length === 0) {
    roomsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>No study rooms match the selected filters.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  // Get all bookings for selected date to compute available slots count
  const allBookings = getBookingsFromStorage();

  roomsGrid.innerHTML = filteredRooms.map(room => {
    // Count how many slots are already booked for this room on this date
    const bookedCount = allBookings.filter(b => b.roomId === room.id && b.date === selectedDate).length;
    const availableSlotsCount = Math.max(0, TIME_SLOTS.length - bookedCount);

    // CSS class tag based on room type
    let tagClass = "quiet";
    if (room.type === "Group Discussion") tagClass = "group";
    if (room.type === "Media & Presentation") tagClass = "media";

    const amenitiesHtml = room.amenities
      .map(item => `<span class="amenity-pill">${item}</span>`)
      .join("");

    return `
      <div class="room-card">
        <div>
          <div class="room-header">
            <h3 class="room-name">${room.name}</h3>
            <span class="room-type-tag ${tagClass}">${room.type}</span>
          </div>

          <div class="room-info-row">
            <span>📍 ${room.floor}</span>
            <span>👥 Up to ${room.capacity} people</span>
          </div>

          <div class="amenities-list">
            ${amenitiesHtml}
          </div>
        </div>

        <div class="room-footer">
          <div class="room-availability-status">
            <span class="status-dot ${availableSlotsCount > 0 ? 'available' : 'busy'}"></span>
            <span>${availableSlotsCount > 0 ? `${availableSlotsCount} slots free today` : 'Fully booked today'}</span>
          </div>
          <button class="btn btn-primary" onclick="openBookingModal(${room.id})" ${availableSlotsCount === 0 ? 'disabled' : ''}>
            ${availableSlotsCount > 0 ? 'Reserve Room' : 'Full'}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function handleDateChange() {
  renderRooms();
}

function resetFilters() {
  document.getElementById("filterCapacity").value = "all";
  document.getElementById("filterType").value = "all";
  renderRooms();
}

// --- 5. BOOKING MODAL LOGIC ---
function openBookingModal(roomId) {
  const room = ROOMS_DATA.find(r => r.id === roomId);
  if (!room) return;

  currentSelectedRoom = room;
  currentSelectedSlot = null; // Reset selection

  const selectedDate = document.getElementById("filterDate").value;

  // Set modal texts
  document.getElementById("modalRoomName").textContent = room.name;
  document.getElementById("modalRoomDetails").textContent = `${room.floor} • Capacity: ${room.capacity} people • ${room.type}`;
  document.getElementById("modalSelectedDateText").textContent = formatDate(selectedDate);
  document.getElementById("slotErrorText").style.display = "none";

  // Render Time Slots
  renderTimeSlotsGrid(room.id, selectedDate);

  // Show Modal
  document.getElementById("bookingModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("bookingModal").style.display = "none";
  currentSelectedRoom = null;
  currentSelectedSlot = null;
  document.getElementById("reservationForm").reset();
}

function renderTimeSlotsGrid(roomId, date) {
  const slotsContainer = document.getElementById("timeSlotsGrid");
  const allBookings = getBookingsFromStorage();

  // Find slots that are already taken for this room on this date
  const bookedSlots = allBookings
    .filter(b => b.roomId === roomId && b.date === date)
    .map(b => b.timeSlot);

  slotsContainer.innerHTML = TIME_SLOTS.map(slot => {
    const isBooked = bookedSlots.includes(slot);

    if (isBooked) {
      return `<button type="button" class="slot-btn booked" disabled title="Already booked by another student">${slot}</button>`;
    } else {
      return `<button type="button" class="slot-btn" onclick="selectSlot('${slot}', this)">${slot}</button>`;
    }
  }).join("");
}

function selectSlot(slotText, element) {
  currentSelectedSlot = slotText;
  document.getElementById("slotErrorText").style.display = "none";

  // Remove active highlight from all slots and add to the clicked one
  const allButtons = document.querySelectorAll("#timeSlotsGrid .slot-btn");
  allButtons.forEach(btn => btn.classList.remove("selected"));
  element.classList.add("selected");
}

// --- 6. FORM SUBMISSION & PASS CREATION ---
function handleReservationSubmit(event) {
  event.preventDefault();

  // Check if a time slot was chosen
  if (!currentSelectedSlot) {
    document.getElementById("slotErrorText").style.display = "block";
    return;
  }

  const selectedDate = document.getElementById("filterDate").value;
  const name = document.getElementById("studentName").value.trim();
  const studentId = document.getElementById("studentId").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const purpose = document.getElementById("purposeSelect").value;

  // Generate unique Reference Code (e.g. REF-7382)
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const refCode = `REF-${randomCode}`;
  const bookingId = `BK-${Date.now()}`;

  // Create new reservation object
  const newBooking = {
    id: bookingId,
    refCode: refCode,
    roomId: currentSelectedRoom.id,
    roomName: currentSelectedRoom.name,
    floor: currentSelectedRoom.floor,
    date: selectedDate,
    timeSlot: currentSelectedSlot,
    studentName: name,
    studentId: studentId,
    studentEmail: email,
    purpose: purpose,
    createdAt: new Date().toISOString()
  };

  // Save to LocalStorage
  const bookings = getBookingsFromStorage();
  bookings.push(newBooking);
  saveBookingsToStorage(bookings);

  // Close booking modal
  closeModal();

  // Update room list and badge
  renderRooms();
  updateBookingCountBadge();

  // Show digital confirmation study pass
  showConfirmationModal(newBooking);
}

// --- 7. DIGITAL CONFIRMATION PASS MODAL ---
function showConfirmationModal(booking) {
  document.getElementById("passRefCode").textContent = `#${booking.refCode}`;
  document.getElementById("passRoomName").textContent = booking.roomName;
  document.getElementById("passRoomFloor").textContent = booking.floor;
  document.getElementById("passDate").textContent = formatDate(booking.date);
  document.getElementById("passTimeSlot").textContent = booking.timeSlot;
  document.getElementById("passStudentName").textContent = booking.studentName;
  document.getElementById("passStudentId").textContent = booking.studentId;

  document.getElementById("confirmationModal").style.display = "flex";
}

function closeConfirmationModal() {
  document.getElementById("confirmationModal").style.display = "none";
}

function printPass() {
  window.print();
}

// --- 8. TAB SWITCHING (BROWSE ROOMS vs MY BOOKINGS) ---
function switchTab(tabId) {
  const roomsTab = document.getElementById("roomsTab");
  const myBookingsTab = document.getElementById("myBookingsTab");
  const roomsBtn = document.getElementById("viewRoomsTabBtn");
  const bookingsBtn = document.getElementById("myBookingsTabBtn");

  if (tabId === "rooms") {
    roomsTab.classList.add("active");
    myBookingsTab.classList.remove("active");
    roomsBtn.classList.add("active");
    bookingsBtn.classList.remove("active");
    renderRooms();
  } else if (tabId === "my-bookings") {
    roomsTab.classList.remove("active");
    myBookingsTab.classList.add("active");
    roomsBtn.classList.remove("active");
    bookingsBtn.classList.add("active");
    renderMyBookings();
  }
}

// --- 9. "MY BOOKINGS" VIEW & CANCELLATION ---
function renderMyBookings() {
  const container = document.getElementById("bookingsList");
  const bookings = getBookingsFromStorage();

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span style="font-size: 2.5rem;">📖</span>
        <p>You have no active study room reservations.</p>
        <button class="btn btn-primary" onclick="switchTab('rooms')">Browse & Book a Room</button>
      </div>
    `;
    return;
  }

  // Sort by date (newest first)
  const sortedBookings = [...bookings].reverse();

  container.innerHTML = sortedBookings.map(b => `
    <div class="booking-item-card">
      <div class="booking-details">
        <h3>${b.roomName} <small style="color: var(--primary); font-size: 0.85rem; font-family: monospace;">#${b.refCode}</small></h3>
        <div class="booking-meta">
          <span>📅 <strong>${formatDate(b.date)}</strong></span>
          <span>⏰ <strong>${b.timeSlot}</strong></span>
          <span>👤 ${b.studentName} (${b.studentId})</span>
          <span>🎯 ${b.purpose}</span>
        </div>
      </div>
      <div>
        <button class="btn btn-danger-outline" onclick="cancelBooking('${b.id}')">Cancel Booking</button>
      </div>
    </div>
  `).join("");
}

function cancelBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this study room reservation?")) {
    return;
  }

  let bookings = getBookingsFromStorage();
  bookings = bookings.filter(b => b.id !== bookingId);
  saveBookingsToStorage(bookings);

  renderMyBookings();
  updateBookingCountBadge();
  renderRooms();
}

function updateBookingCountBadge() {
  const bookings = getBookingsFromStorage();
  const badge = document.getElementById("bookingCountBadge");
  if (badge) {
    badge.textContent = bookings.length;
  }
}

// Helper: Format YYYY-MM-DD into readable date (e.g. Friday, Oct 24, 2026)
function formatDate(dateString) {
  if (!dateString) return "";
  const parts = dateString.split("-");
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  return dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
