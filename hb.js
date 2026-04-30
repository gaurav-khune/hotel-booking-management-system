document.addEventListener("DOMContentLoaded", () => {
  const apiBookingUrls = window.location.protocol === 'file:'
    ? ['http://localhost:3000/api/bookings']
    : ['/api/bookings', 'http://localhost:3000/api/bookings'];

  const bookingForm = document.getElementById("booking-form");
  const bookingModal = document.getElementById('bookingModal');
  const roomSelect = bookingForm.querySelector('[name="room"]');
  const offerSelect = bookingForm.querySelector('[name="offer"]');
  const membersInput = bookingForm.querySelector('[name="members"]');
  const checkinInput = bookingForm.querySelector('[name="checkin"]');
  const checkoutInput = bookingForm.querySelector('[name="checkout"]');
  const totalInput = bookingForm.querySelector('[name="total"]');

  // ========== BOOKING FORM ==========
  bookingForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const bookingData = {
      name: bookingForm.elements.name.value.trim(),
      email: bookingForm.elements.email.value.trim(),
      phone: bookingForm.elements.phone.value.trim(),
      members: bookingForm.elements.members.value,
      room: bookingForm.elements.room.value,
      offer: bookingForm.elements.offer.value,
      checkin: bookingForm.elements.checkin.value,
      checkout: bookingForm.elements.checkout.value,
      total: bookingForm.elements.total.value
    };

    try {
      let response;
      let result;
      let lastNetworkError;

      for (const url of apiBookingUrls) {
        try {
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
          });

          result = await response.json();
          break;
        } catch (error) {
          lastNetworkError = error;
        }
      }

      if (!response) {
        throw new Error(lastNetworkError?.message || 'Network error. Start server with: npm start');
      }

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Unable to save booking');
      }

      alert('Booking saved successfully!');
      bookingForm.reset();
      totalInput.value = '';
      const modal = bootstrap.Modal.getInstance(bookingModal);
      if (modal) {
        modal.hide();
      }
    } catch (error) {
      alert(`Failed: ${error.message}`);
    }
  });


  // ========== MODAL AUTO-FILL ==========
  bookingModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;

    const room = button.getAttribute('data-room');
    const offer = button.getAttribute('data-offer');

    // Reset values
    roomSelect.value = "";
    offerSelect.value = "None";
    membersInput.value = "";

    // Set values
    if (room) roomSelect.value = room;
    if (offer) offerSelect.value = offer;

    calculateTotal();
  });


  // ========== FORM ELEMENTS ==========
  // ========== PRICING ==========
  const roomPrices = {
    "Deluxe Room": 3000,
    "Junior Suite": 5000,
    "Grand Suite": 8000,
    "Presidential Suite": 12000
  };

  const offerDiscounts = {
    "None": 0,
    "Weekend Escape": 0.10,
    "Honeymoon Package": 0.15,
    "Business Travel Plan": 0.12
  };

  function suggestRoomByMembers(memberCount) {
    if (memberCount <= 2) {
      return "Deluxe Room";
    }

    if (memberCount <= 4) {
      return "Junior Suite";
    }

    if (memberCount <= 6) {
      return "Grand Suite";
    }

    return "Presidential Suite";
  }


  // ========== CALCULATE TOTAL ==========
  function calculateTotal() {
    const room = roomSelect.value;
    const offer = offerSelect.value;
    const checkinValue = checkinInput.value;
    const checkoutValue = checkoutInput.value;

    if (!room || !checkinValue || !checkoutValue) {
      totalInput.value = "";
      return;
    }

    const checkin = new Date(checkinValue);
    const checkout = new Date(checkoutValue);

    const timeDiff = checkout - checkin;
    const days = timeDiff / (1000 * 60 * 60 * 24);

    if (days <= 0) {
      totalInput.value = "Invalid dates";
      return;
    }

    let basePrice = roomPrices[room] * days;
    let finalPrice = basePrice;

    if (offer === "Stay 3 Nights, Pay 2" && days >= 3) {
      finalPrice = roomPrices[room] * (days - 1);
    } else {
      let discount = offerDiscounts[offer] || 0;
      finalPrice = basePrice - (basePrice * discount);
    }

    totalInput.value = "₹" + Math.round(finalPrice);
  }

  function updateRoomSuggestion() {
    const memberCount = Number(membersInput.value);

    if (!memberCount || memberCount < 1) {
      roomSelect.value = "";
      calculateTotal();
      return;
    }

    roomSelect.value = suggestRoomByMembers(memberCount);
    calculateTotal();
  }


  // ========== EVENT LISTENERS ==========
  roomSelect.addEventListener("change", calculateTotal);
  offerSelect.addEventListener("change", calculateTotal);
  membersInput.addEventListener("input", updateRoomSuggestion);
  checkinInput.addEventListener("change", calculateTotal);
  checkoutInput.addEventListener("change", calculateTotal);


  // ========== SCROLL PARALLAX ==========
  window.addEventListener("scroll", () => {
    const elements = document.querySelectorAll(".parallax");

    elements.forEach(el => {
      const speed = parseFloat(el.getAttribute("data-speed")) || 0.2;

      const rect = el.getBoundingClientRect();
      const offset = window.innerHeight - rect.top;

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.style.transform = `translateY(${offset * speed * 0.2}px)`;
      }
    });
  });

  // ========== VIEW 3D BUTTON LIMITS ==========
  // Keep all View 3D buttons visible but only allow the Deluxe Room to navigate.
  const view3DLinks = document.querySelectorAll('a[href^="room-3d.html"]');
  view3DLinks.forEach(link => {
    try {
      const url = new URL(link.getAttribute('href'), window.location.href);
      const roomParam = url.searchParams.get('room') ? decodeURIComponent(url.searchParams.get('room')) : null;
      if (roomParam !== 'Deluxe Room') {
        link.addEventListener('click', (e) => { e.preventDefault(); });
        link.classList.add('disabled');
        link.setAttribute('aria-disabled', 'true');
        link.title = '3D preview available for Deluxe Room only';
      } else {
        // Ensure Deluxe link is enabled and accessible
        link.classList.remove('disabled');
        link.removeAttribute('aria-disabled');
        link.title = 'View 3D preview (Deluxe Room)';
      }
    } catch (err) {
      // If parsing fails, leave link unchanged
    }
  });

});