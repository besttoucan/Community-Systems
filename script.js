/* Genesis Community Systems: minimal, accessible client JS */
(function () {
  "use strict";

  // ---- Year ----
  document.querySelectorAll("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });

  // ---- Mobile menu ----
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.getElementById("menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Mark active nav link ----
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a:not(.btn)").forEach(function (a) {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

  // ---- Subtle reveal on scroll (one-time, respects reduced motion) ----
  var rise = Array.prototype.slice.call(document.querySelectorAll(".rise"));
  if (rise.length) {
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rise.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      rise.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("in"); // already visible on load
        else io.observe(el);
      });
    }
  }

  // ---- Home scroll story: from the big-bank city to the community ----
  (function () {
    var section = document.querySelector("[data-panorama]");
    if (!section) return;
    var stage    = section.querySelector("[data-stage]");
    var world    = section.querySelector("[data-world]");
    var ship     = section.querySelector("[data-ship]");
    var leafL    = section.querySelector("[data-leaf-l]");
    var leafR    = section.querySelector("[data-leaf-r]");
    var stars    = section.querySelector("[data-stars]");
    var skyword  = section.querySelector("[data-skyword]");
    var sunWrap  = section.querySelector("[data-sun-wrap]");
    var sunCore  = section.querySelector("[data-sun-core]");
    var sunLane  = section.querySelector("[data-sun-lane]");
    var caps     = Array.prototype.slice.call(section.querySelectorAll(".scap"));
    var skyStops   = Array.prototype.slice.call(section.querySelectorAll("[data-sky]"));
    var sunStops   = Array.prototype.slice.call(section.querySelectorAll("[data-sun]"));
    var waterStops = Array.prototype.slice.call(section.querySelectorAll("[data-water]"));

    // 3D extruded buildings + clean, aligned, lit windows
    (function buildWindows(){
      var holder = section.querySelector("[data-windows]");
      if (!holder) return;
      var NS = "http://www.w3.org/2000/svg";
      function shift(hexc, f){
        var r = parseInt(hexc.slice(1,3),16), g = parseInt(hexc.slice(3,5),16), bl = parseInt(hexc.slice(5,7),16);
        function c(v){ return Math.max(0, Math.min(255, Math.round(v*f))); }
        return "rgb(" + c(r) + "," + c(g) + "," + c(bl) + ")";
      }
      function poly(pts, fill){
        var p = document.createElementNS(NS, "polygon");
        p.setAttribute("points", pts); p.setAttribute("fill", fill);
        return p;
      }
      var dx = 13, dy = -9;
      Array.prototype.forEach.call(section.querySelectorAll(".bwin"), function (b) {
        var x = +b.getAttribute("x"), y = +b.getAttribute("y"),
            w = +b.getAttribute("width"), h = +b.getAttribute("height"),
            lit = b.getAttribute("data-win") === "lit",
            base = b.getAttribute("fill"),
            padX = 13, padTop = 18, padBot = 16, gx = 21, gy = 26, cw = 11, ch = 15;
        var side = poly((x+w)+" "+y+" "+(x+w+dx)+" "+(y+dy)+" "+(x+w+dx)+" "+(y+h+dy)+" "+(x+w)+" "+(y+h), shift(base, 0.6));
        var roof = poly(x+" "+y+" "+(x+dx)+" "+(y+dy)+" "+(x+w+dx)+" "+(y+dy)+" "+(x+w)+" "+y, shift(base, 1.45));
        b.parentNode.insertBefore(side, b);
        b.parentNode.insertBefore(roof, b);
        var shade = document.createElementNS(NS, "rect");
        shade.setAttribute("x", x); shade.setAttribute("y", y);
        shade.setAttribute("width", w); shade.setAttribute("height", h);
        shade.setAttribute("fill", "url(#bldgShade)");
        holder.appendChild(shade);
        var cols = Math.max(1, Math.floor((w - 2 * padX) / gx) + 1);
        var rows = Math.max(1, Math.floor((h - padTop - padBot) / gy) + 1);
        var spanW = (cols - 1) * gx + cw, sx = x + (w - spanW) / 2, sy = y + padTop;
        // Each building gets its own character; each window is independently lit / dim / dark
        // so the facade reads like a real building instead of a repeating grid.
        var litBias = lit ? (0.42 + Math.random() * 0.30) : (0.26 + Math.random() * 0.24);
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            var wy = sy + r * gy;
            if (wy + ch > y + h - padBot + 2) continue;
            var rr = document.createElementNS(NS, "rect");
            rr.setAttribute("x", sx + c * gx); rr.setAttribute("y", wy);
            rr.setAttribute("width", cw); rr.setAttribute("height", ch);
            rr.setAttribute("rx", "1.5");
            var roll = Math.random(), fill, op;
            if (roll < litBias) {                 // window is lit
              fill = lit ? "#ffd28a" : "#aecae2";
              op = (lit ? 0.80 : 0.50) + Math.random() * 0.14;
            } else if (roll < litBias + 0.17) {   // half-lit / curtained
              fill = lit ? "#c79f60" : "#7f9cb7";
              op = 0.38 + Math.random() * 0.14;
            } else {                              // window is dark
              fill = lit ? "#33406b" : "#314769";
              op = 0.40 + Math.random() * 0.12;
            }
            rr.setAttribute("fill", fill);
            rr.setAttribute("opacity", op.toFixed(2));
            holder.appendChild(rr);
          }
        }
      });
    })();

    // PALETTES: night -> day. Sky, sun glow, sun core, water all lerp on scroll progress p.
    var SKY      = [["#070d24", "#6996ce"], ["#12204a", "#9bc7e8"], ["#243559", "#e0eef7"]];
    var SUN      = ["#ffb784", "#fff3d8"];
    var SUN_CORE = ["#ff8a3e", "#fff4d8"];
    var WATER    = [["#0e1b35", "#3f7a9e"], ["#1c324f", "#79a8c4"], ["#08111e", "#1c405a"]];

    function hex(c){ return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)]; }
    function lerp(a,b,t){ a=hex(a); b=hex(b);
      return "rgb(" + Math.round(a[0]+(b[0]-a[0])*t) + "," + Math.round(a[1]+(b[1]-a[1])*t) + "," + Math.round(a[2]+(b[2]-a[2])*t) + ")";
    }
    function clamp(v, lo, hi){ return v < lo ? lo : (v > hi ? hi : v); }
    function smoothstep(e0, e1, x){ var t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }

    function paint(p){
      // CAMERA: pan from city -> bridge -> village.
      // Mobile viewport is narrow, so sweep further and faster in the final stretch
      // to reveal the whole village (bank, cafe, homes, church) without rushing the bridge.
      var pan;
      if (window.innerWidth <= 760) {
        // end the sweep centered on the COMMUNITY BANK (not the cafe)
        var e = p < 0.66 ? (p / 0.66) * 0.34 : 0.34 + ((p - 0.66) / 0.34) * 0.66;
        pan = 150 - e * 420;
      } else {
        pan = 120 - p * 360;
      }
      if (world) world.setAttribute("transform", "translate(" + pan.toFixed(1) + " 0)");

      // BASCULE BRIDGE: leaves rotate up around tower hinges (gate breaking apart)
      // Open ramp spans 32% of scroll so the animation is clearly visible
      var bridgeOpen = clamp(p / 0.32, 0, 1);
      var leafAngle = bridgeOpen * 88;                // up to 88° = nearly vertical
      if (leafL) leafL.setAttribute("transform", "rotate(" + (-leafAngle).toFixed(2) + " 620 549)");
      if (leafR) leafR.setAttribute("transform", "rotate(" +  leafAngle.toFixed(2)   + " 820 549)");

      // SHIP: holds at the horizon until the bridge is fully open, then advances head-on
      // max scale 1.4 keeps the ship hull clear of the moored yachts at p=1
      var shipPhase = clamp((p - 0.34) / 0.66, 0, 1);
      var shipY = 440 + 250 * shipPhase;
      var shipScale = 0.3 + 1.1 * shipPhase;
      if (ship) ship.setAttribute("transform", "translate(720 " + shipY.toFixed(1) + ") scale(" + shipScale.toFixed(3) + ")");

      // SUN: starts below the horizon (truly hidden at night), rises with scroll
      // initial cy=580 (sun's top edge at y=534, fully under horizon at y=440) → end cy=140
      var sunDeltaY = -440 * p;
      var sunReveal = smoothstep(0.04, 0.16, p);      // gated so night has no sun at all
      if (sunWrap) {
        sunWrap.setAttribute("transform", "translate(0 " + sunDeltaY.toFixed(1) + ")");
        sunWrap.setAttribute("opacity", sunReveal.toFixed(3));
      }
      if (sunCore) sunCore.setAttribute("fill", lerp(SUN_CORE[0], SUN_CORE[1], p));
      sunStops.forEach(function (s) { s.setAttribute("stop-color", lerp(SUN[0], SUN[1], p)); });

      // STARS: fade out as the sun starts climbing
      if (stars) stars.setAttribute("opacity", clamp(1 - p / 0.28, 0, 1).toFixed(3));

      // SUN-LANE reflection on the water: reveals once the sun is well above horizon
      if (sunLane) sunLane.setAttribute("opacity", (smoothstep(0.18, 0.55, p) * 0.55).toFixed(3));

      // SKY + WATER gradients: night palette -> day palette
      skyStops.forEach(function (s, i)   { s.setAttribute("stop-color", lerp(SKY[i][0],   SKY[i][1],   p)); });
      waterStops.forEach(function (s, i) { s.setAttribute("stop-color", lerp(WATER[i][0], WATER[i][1], p)); });

      // COMMUNITY CORE SYSTEMS skyword fades + drifts upward as we enter the community
      if (skyword) {
        var swFade  = clamp(0.95 * (1 - p / 0.5), 0, 0.95);
        var swDrift = -40 * smoothstep(0, 0.5, p);
        skyword.setAttribute("opacity", swFade.toFixed(3));
        skyword.setAttribute("transform", "translate(0 " + swDrift.toFixed(1) + ")");
      }

      // CAPTIONS: "An era ends" -> "An era begins" -> "Made for Main Street"
      var active = p < 0.36 ? 0 : (p < 0.68 ? 1 : 2);
      caps.forEach(function (c, i) { c.classList.toggle("on", i === active); });

      if (stage) stage.classList.toggle("scrolled", p > 0.03);
    }

    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { paint(0.55); return; }   // settle on a pleasant mid-day frame

    var ticking = false;
    function onScroll(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var total = section.offsetHeight - window.innerHeight;
        var p = total > 0 ? (-section.getBoundingClientRect().top / total) : 0;
        paint(Math.max(0, Math.min(1, p)));
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  })();

  // ---- Contact form (native FormSubmit POST) ----
  // We let the browser submit directly to FormSubmit rather than using a
  // background fetch: FormSubmit sits behind Cloudflare bot-protection, which
  // a real page navigation clears automatically but a background request cannot.
  // FormSubmit redirects back here with ?sent=1 (via the _next field) on success.
  var form = document.querySelector("#contact-form");
  if (form) {
    var ok = document.querySelector(".form-ok");
    if (ok && /[?&]sent=1/.test(location.search)) {
      ok.classList.add("show");
      ok.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    form.addEventListener("submit", function () {
      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.textContent = "Sending…"; }
    });
  }
})();
