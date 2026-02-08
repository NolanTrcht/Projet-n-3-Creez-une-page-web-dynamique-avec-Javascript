function login() {
  const formulaire = document.getElementById("login");
  const title = document.querySelector(".form-title");

  formulaire.addEventListener("submit", (e) => {
    e.preventDefault();

    //Construction de la charge Utile pour l'envoie des données//
    const infoFormulaire = {
      email: e.target.querySelector("[name=mail]").value,
      password: e.target.querySelector("[name=mdp]").value,
    };

    const chargeUtile = JSON.stringify(infoFormulaire);
    console.log(chargeUtile);
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    })
      //Récupération de la réponse et convertis en format JSON//
      .then((reponse) => {
        return reponse.json();
      })
      //récupération du Token de confirmation//
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = "index.html";
        } else {
          title.innerHTML = `<h2>Log In</h2><p>Erreur dans l'identifiant ou le mot de passe</p>`;
        }
      });
  });
}
login();
