// Get modal elements
const popupBox = document.getElementById('popupBox');
const popupMessage = document.getElementById('popupMessage');
const closePopup = document.getElementById('closePopup');

// Function to show the pop-up box
function showPopup(message) {
    popupMessage.textContent = message;
    popupBox.style.display = 'flex';
}

// Event listener to close the pop-up
closePopup.addEventListener('click', () => {
    popupBox.style.display = 'none';
});

// Contact Form Validation
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        showPopup('Please fill out all fields in the Contact Form.');
        return;
    }

    showPopup(`Thank you 🙏, ${name}! Your message has been sent.`);
    this.reset();
});

// Function to check if the time is within allowed hours
function isWithinOperatingHours(date, time) {
    const day = new Date(date).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const [hours, minutes] = time.split(':').map(Number);
    const bookingTime = hours * 60 + minutes; // Convert time to minutes for easy comparison

    // Define operating hours in minutes
    const weekdaysStart = 6 * 60 + 30; // 6:30 AM
    const weekdaysEnd = 21 * 60 + 30;  // 9:30 PM
    const weekendsStart = 7 * 60 + 30; // 7:30 AM
    const weekendsEnd = 22 * 60 + 30;  // 10:30 PM

    // Check based on the day
    if (day >= 1 && day <= 5) { // Monday to Friday
        return bookingTime >= weekdaysStart && bookingTime <= weekdaysEnd;
    } else { // Saturday and Sunday
        return bookingTime >= weekendsStart && bookingTime <= weekendsEnd;
    }
}


// Function to check if booking date and time are valid
function isDateAndTimeValid(date, time) {
    const currentTime = new Date();
    const selectedDate = new Date(date);
    const [selectedHours, selectedMinutes] = time.split(':').map(Number);

    const selectedTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedHours,
        selectedMinutes
    );

    // Check if the selected date is in the past
    if (selectedDate < currentTime.setHours(0, 0, 0, 0)) {
        return { valid: false, reason: 'pastDate' };
    }

    // Check if the booking is today and time has passed
    if (
        selectedDate.toDateString() === currentTime.toDateString() &&
        selectedTime <= currentTime
    ) {
        return { valid: false, reason: 'pastTime' };
    }

    return { valid: true };
}
   
// Booking Form Validation
document.getElementById('bookingForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;

    if (!name || !phone || !date || !time || !guests) {
        showPopup('Please fill out all fields in the Booking Form.');
        return;
    }

    // Check if booking time is within operating hours
    if (!isWithinOperatingHours(date, time)) {
        showPopup('Sorry 😕, our restaurant operates:\n' +
                  'Mon-Fri: 6:30 AM - 9:30 PM\n' +
                  'Sat-Sun: 7:30 AM - 10:30 PM.\n' +
                  'Please choose a valid time.');
        return;
    }

    // Check if date and time are valid
    const dateAndTimeCheck = isDateAndTimeValid(date, time);

    if (!dateAndTimeCheck.valid) {
        if (dateAndTimeCheck.reason === 'pastDate') {
            showPopup('Sorry 😕, you cannot book a table for a date that has already passed. Please choose a future date. Our restaurant operates:\n' +
                  'Mon-Fri: 6:30 AM - 9:30 PM\n' +
                  'Sat-Sun: 7:30 AM - 10:30 PM.\n');
        } else if (dateAndTimeCheck.reason === 'pastTime') {
            showPopup('Sorry 😕, the selected time has already passed today. Please choose a future date. Our restaurant operates:\n' +
                  'Mon-Fri: 6:30 AM - 9:30 PM\n' +
                  'Sat-Sun: 7:30 AM - 10:30 PM.\n');
        }
        
        return;
    
    }

    // Successful booking
    showPopup(`Thank you 🙏, ${name}! Your table for ${guests} guests has been booked on ${date} at ${time}.`);
    this.reset();
});
