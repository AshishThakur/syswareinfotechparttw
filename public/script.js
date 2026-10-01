document.addEventListener("DOMContentLoaded", function () {

  /* ========== 1. Header scroll + mobile menu ========== */
  var header = document.getElementById("header");
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");

  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
      });
    });
  }

  /* ========== 2. Custom cursor ========== */
  var cursorDot = document.querySelector("[data-cursor-dot]");
  var cursorOutline = document.querySelector("[data-cursor-outline]");

  if (cursorDot && cursorOutline) {
    var mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    (function animateCursor() {
      outlineX += (mouseX - outlineX) * 0.2;
      outlineY += (mouseY - outlineY) * 0.2;
      cursorOutline.style.left = outlineX + "px";
      cursorOutline.style.top = outlineY + "px";
      requestAnimationFrame(animateCursor);
    })();
  }

  /* ========== 3. Hero canvas network (blue / cyan) ========== */
  var canvas = document.getElementById("hero-canvas");

  if (canvas) {
    var ctx = canvas.getContext("2d");
    var points = [];
    var mouse = { x: null, y: null, radius: 170 };

    window.addEventListener("mousemove", function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    window.addEventListener("mouseout", function () { mouse.x = null; mouse.y = null; });

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    function CyberDot() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 1.6 + 0.9;
      this.density = Math.random() * 22 + 10;
      this.color = Math.random() > 0.3 ? "#60a5fa" : "#22d3ee";
    }

    CyberDot.prototype.update = function () {
      this.baseX += this.vx;
      this.baseY += this.vy;
      if (this.baseX < 0 || this.baseX > canvas.width) this.vx = -this.vx;
      if (this.baseY < 0 || this.baseY > canvas.height) this.vy = -this.vy;

      if (mouse.x !== null && mouse.y !== null) {
        var dx = mouse.x - this.x;
        var dy = mouse.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          var force = (mouse.radius - distance) / mouse.radius;
          var angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * this.density;
          this.y -= Math.sin(angle) * force * this.density;
          return;
        }
      }
      this.x += (this.baseX - this.x) * 0.07;
      this.y += (this.baseY - this.y) * 0.07;
    };

    CyberDot.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    function initDots() {
      resizeCanvas();
      points = [];
      var count = Math.floor((canvas.width * canvas.height) / 14000);
      count = Math.min(Math.max(count, 40), 90);
      for (var i = 0; i < count; i++) points.push(new CyberDot());
    }

    function animateNetwork() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < points.length; i++) {
        points[i].update();
        points[i].draw();
        for (var j = i + 1; j < points.length; j++) {
          var dx = points[i].x - points[j].x;
          var dy = points[i].y - points[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = "rgba(96, 165, 250," + ((1 - dist / 120) * 0.28) + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateNetwork);
    }

    initDots();
    window.addEventListener("resize", initDots);
    animateNetwork();
  }

  /* ========== 4. Logo marquee: duplicate set for seamless loop ========== */
  var track = document.getElementById("marqueeTrack");
  if (track) {
    Array.from(track.children).forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      var img = clone.querySelector("img");
      if (img) { img.alt = ""; img.loading = "lazy"; }
      track.appendChild(clone);
    });
  }

  /* ========== 5. Cyber cards 3D tilt ========== */
  document.querySelectorAll(".cyber-solutions-section .container").forEach(function (box) {
    var card = box.querySelector(".card");

    box.addEventListener("mousemove", function (e) {
      var r = box.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = "transform 120ms ease-out, box-shadow 400ms ease, border-color 400ms ease";
      card.style.transform = "rotateX(" + (-y * 14) + "deg) rotateY(" + (x * 14) + "deg)";
    });

    box.addEventListener("mouseleave", function () {
      card.style.transition = "transform 600ms ease, box-shadow 400ms ease, border-color 400ms ease";
      card.style.transform = "";
    });
  });

  /* ========== 6. Scroll animation (solutions section) ========== */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("active-animation");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".scroll-animate").forEach(function (el) { io.observe(el); });

  /* ========== 7. Counters ========== */
  document.querySelectorAll(".counter").forEach(function (el) {
    var target = +el.dataset.target;
    var suffix = el.dataset.suffix || "";

    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.disconnect();

        var start = null;
        function step(t) {
          if (!start) start = t;
          var p = Math.min((t - start) / 1800, 1);
          el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });

    co.observe(el);
  });

});


// people cannot see the page source 
// Right-click disable karne ke liye
document.addEventListener('contextmenu', event => event.preventDefault());

// Inspect shortcut (F12, Ctrl+Shift+I, Ctrl+U) block karne ke liye
document.addEventListener('keydown', function(event) {
    if (event.keyCode === 123 || 
        (event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74)) || 
        (event.ctrlKey && event.keyCode === 85)) {
        event.preventDefault();
    }
});


// about us code
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Team slider: cards ka duplicate set banao taaki loop seamless rahe */
  var track = document.querySelector('.team-slider');
  if (track && !reduce) {
    Array.prototype.slice.call(track.children).forEach(function (card) {
      var copy = card.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('img').forEach(function (img) {
        img.alt = '';
      });
      track.appendChild(copy);
    });
  }

  /* Scroll reveal (fade up) */
  var items = document.querySelectorAll('.reveal');

  items.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.classList.contains('reveal');
    });
    el.style.setProperty('--d', Math.min(siblings.indexOf(el), 5) * 90 + 'ms');
  });

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  items.forEach(function (el) {
    io.observe(el);
  });
})();