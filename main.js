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

  // --- Video hero crossfade ---
  var heroVids = Array.prototype.slice.call(
    document.querySelectorAll(".hero-video .vid-bg video")
  );
  if (heroVids.length) {
    var hvi = 0;
    var FADE_MS = 1200;
    var PREBUF_S = 1.8;

    function switchTo(nextIdx) {
      var prev = heroVids[hvi];
      hvi = nextIdx % heroVids.length;
      var next = heroVids[hvi];
      next.currentTime = 0;
      next.play().catch(function () {});
      next.classList.add("vid-active");
      setTimeout(function () {
        prev.classList.remove("vid-active");
        prev._switching = false;
      }, FADE_MS);
    }

    heroVids.forEach(function (v, i) {
      v.addEventListener("timeupdate", function () {
        if (
          v.classList.contains("vid-active") &&
          !v._switching &&
          v.duration &&
          v.currentTime >= v.duration - PREBUF_S
        ) {
          v._switching = true;
          switchTo(i + 1);
        }
      });
      v.addEventListener("error", function () {
        if (heroVids.length > 1) switchTo(i + 1);
      });
    });

    heroVids[0].play().catch(function () {});
    heroVids[0].classList.add("vid-active");
  }

  // --- Appointment request form (Web3Forms, no server needed) ---
  var form = document.getElementById("appointmentForm");
  if (!form) return;
  var status = document.getElementById("formStatus");
  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = Object.fromEntries(new FormData(form).entries());

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
