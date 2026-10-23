# 📚 Campus Study Room Reservation System

A clean, lightweight, and easy-to-understand **Campus Study Room Reservation Web Application** built entirely with pure, plain **HTML5, CSS3, and Vanilla JavaScript** (No external frameworks, no build tools, no setup required).

---

## 🌟 Features

1. **Browse & Filter Study Rooms:**
   - Filter rooms by capacity (*Small 1-2 people*, *Medium 3-5 people*, *Large 6-10 people*).
   - Filter by room type (*Quiet Study*, *Group Discussion*, *Media & Presentation*).
   - View room amenities (Whiteboard, Smart TV, Ergonomic Chairs, Power Outlets).
   - Real-time indicator showing how many free slots remain for the chosen date.

2. **Interactive Time Slot Picker:**
   - Choose from standard library slots (`09:00 AM` to `05:00 PM`).
   - Booked slots are automatically crossed out and disabled to prevent double bookings.

3. **Student Reservation Form:**
   - Capture Student Full Name, University ID, Email, and Purpose of Study.

4. **Digital Campus Pass (Printable):**
   - Instant booking confirmation showing a digital study pass with a unique reference code (`#REF-XXXX`).
   - One-click print button formatted for saving as PDF or printing.

5. **"My Bookings" Management & Persistence:**
   - Persists all bookings using browser `localStorage` (data stays even if you refresh or close the browser).
   - Students can review their upcoming reservations and cancel anytime.

---

## 📁 File Structure

```text
WD folder/
├── index.html       # Clean semantic HTML layout and modals
├── styles.css       # Clean, modern CSS with responsive design & print styles
├── app.js           # Well-commented Vanilla JS (DOM manipulation, LocalStorage)
└── README.md        # Documentation and presentation guide
```

---

## 🚀 How to Run the Project

No installation or node modules needed!

1. Open your file explorer and navigate to `d:\Personal\WD folder`.
2. Double-click **`index.html`** to open it directly in Google Chrome, Microsoft Edge, or any modern web browser.
3. *(Optional)* If using VS Code, right-click `index.html` and click **"Open with Live Server"**.

---

## 🎤 How to Explain This Project in an Interview or Demo (Presentation Script)

When presenting this project to a teacher, examiner, or interviewer, follow this simple 3-minute explanation:

1. **The Problem:**
   > *"In university libraries, students often struggle to find available study rooms or waste time waiting for group discussion spaces. I built this self-service Study Room Reservation system to make booking transparent, fast, and conflict-free."*

2. **Architecture & Tech Stack:**
   > *"I intentionally built this using foundational web technologies: semantic HTML5, clean CSS3 with responsive layouts, and Vanilla JavaScript. For data persistence, I utilized the browser's `localStorage` API so bookings are saved across sessions without needing a complex backend database setup."*

3. **Walkthrough / Demo Flow:**
   - **Step 1:** Select today's date and filter by "Group Discussion".
   - **Step 2:** Click **"Reserve Room"** on Room 205.
   - **Step 3:** Show that existing booked slots are disabled, select an open slot (e.g. `11:00 AM - 12:00 PM`), enter your student details, and click **"Confirm Reservation"**.
   - **Step 4:** Show the generated **Digital Study Pass** with reference code.
   - **Step 5:** Navigate to the **"My Bookings"** tab to show that the booking is listed, and demonstrate the **"Cancel Booking"** functionality which immediately frees up the slot again.
