const container = document.getElementById("card-list");

// Load all cards from cards.json
fetch("cards/cards.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(card => {
      const div = document.createElement("div");
      div.className = "card-wrapper";

      // Load each card HTML
      fetch(card.file)
        .then(res => res.text())
        .then(html => {
          div.innerHTML = html;
          container.appendChild(div);
        })
        .catch(err => console.log("Card load error:", err));
    });
  })
  .catch(err => console.log("No cards found or JSON missing", err));
