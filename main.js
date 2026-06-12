/* Willagee Veterinary Hospital — shared interactions */
(function () {
  // --- Mobile nav toggle ---
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  // --- Hero photo carousel (auto-advance, arrows, dots, swipe) ---
  var carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    var track = carousel.querySelector(".car-track");
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = carousel.querySelector(".car-dots");
    var idx = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.className = "car-dot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", "Go to photo " + (i + 1));
      d.addEventListener("click", function () { go(i); reset(); });
      dotsWrap.appendChild(d);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = "translateX(" + -idx * 100 + "%)";
      dots.forEach(function (d, n) { d.classList.toggle("active", n === idx); });
    }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }
    function play() { timer = setInterval(next, 2800); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function reset() { stop(); play(); }

    var nx = carousel.querySelector(".car-arrow.next");
    var pv = carousel.querySelector(".car-arrow.prev");
    if (nx) nx.addEventListener("click", function () { next(); reset(); });
    if (pv) pv.addEventListener("click", function () { prev(); reset(); });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", play);

    var x0 = null;
    track.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      x0 = null;
      play();
    }, { passive: true });

    play();
  }

  // --- Appointment request form (Web3Forms, no server needed) ---
  var form = document.getElementById("appointmentForm");
  if (!form) return;
  var status = document.getElementById("formStatus");
  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = Object.fromEntries(new FormData(form).entries());

    // Guard: form not yet activated with a real access key
    if (!data.access_key || data.access_key.indexOf("REPLACE_WITH") === 0) {
      show("err", "This form isn't connected yet. (Owner: add your free Web3Forms access key to activate it.)");
      return;
    }

    submitBtn.disabled = true;
    var original = submitBtn.textContent;
    submitBtn.textContent = "Sending…";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (json.success) {
          show("ok", "Thank you! Your request has been sent — we'll be in touch soon to confirm your appointment.");
          form.reset();
        } else {
          show("err", "Sorry, something went wrong. Please call us on (08) 9474 9589 and we'll book you in.");
        }
      })
      .catch(function () {
        show("err", "Sorry, something went wrong. Please call us on (08) 9474 9589 and we'll book you in.");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      });
  });

  function show(type, msg) {
    if (!status) return;
    status.textContent = msg;
    status.className = "form-status show " + type;
    status.scrollIntoView({ behavior: "smooth", block: "center" });
  }
})();
