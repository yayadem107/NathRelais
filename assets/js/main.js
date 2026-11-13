/* Nath'Relais — scripts du site */
(function () {
  "use strict";

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Année du pied de page ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Apparition au défilement ---------- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Formulaire de contact ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  // Pré-sélection de l'objet via l'URL : contact.html?objet=cabinet
  var params = new URLSearchParams(window.location.search);
  var objet = params.get("objet");
  var select = form.querySelector("#objet");
  if (objet && select) {
    var opt = select.querySelector('option[data-key="' + objet + '"]');
    if (opt) select.value = opt.value;
  }

  var status = document.getElementById("form-status");
  var button = form.querySelector('button[type="submit"]');
  var buttonLabel = button.innerHTML;
  var endpoint = form.getAttribute("data-endpoint");

  function showStatus(type, message) {
    status.className = "form-status " + type;
    status.textContent = message;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Piège anti-robots : si le champ caché est rempli, on ignore.
    if (form.querySelector('[name="_honey"]').value) return;

    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = value; });
    data._subject = "Nouvelle demande Nath'Relais — " + (data.objet || "Contact") + " — " + data.prenom + " " + data.nom;
    data._replyto = data.email;
    data._template = "table";
    data._captcha = "false";
    delete data.consentement;

    button.disabled = true;
    button.textContent = "Envoi en cours…";
    status.className = "form-status";

    function post(url) {
      return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) { return res.json().then(function (json) { return { ok: res.ok, json: json }; }); })
        .then(function (r) {
          if (r.ok && String(r.json.success) === "true") return true;
          throw new Error(r.json && r.json.message ? r.json.message : "Erreur d'envoi");
        });
    }

    // 1) script PHP de l'hébergement (send.php) ; 2) secours : FormSubmit
    var local = form.getAttribute("data-local-endpoint");
    var first = local ? post(local) : Promise.reject(new Error("no local"));
    first
      .catch(function () { return post(endpoint); })
      .then(function () {
        form.reset();
        showStatus("ok", "Merci ! Votre demande a bien été envoyée. Je vous réponds sous 48 heures ouvrées.");
      })
      .catch(function (err) {
        var msg = (err && err.message) || "";
        if (/activat/i.test(msg)) {
          showStatus("err", "Le formulaire est en cours d'activation : un email de confirmation (« Activate Form ») a été envoyé à contact.nathrelais@gmail.com. Une fois le lien cliqué, les messages seront transmis normalement.");
          return;
        }
        if (/web server/i.test(msg) || window.location.protocol === "file:") {
          showStatus("err", "Le formulaire ne fonctionne qu'une fois le site en ligne (pas en ouvrant le fichier sur l'ordinateur).");
          return;
        }
        showStatus("err", "L'envoi n'a pas pu aboutir. Vous pouvez m'écrire directement à contact.nathrelais@gmail.com ou m'appeler au 07 62 34 39 88.");
      })
      .then(function () {
        button.disabled = false;
        button.innerHTML = buttonLabel;
      });
  });
})();
