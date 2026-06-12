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
