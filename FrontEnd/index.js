const portfolioFiltres = document.getElementById("portfolio-filtres");
const galerie = document.querySelector(".gallery");
const divGallerie = document.querySelector(".div-gallerie");

// Récupère les datas de l'API //
async function dataTri() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const data = await reponse.json();
  return data;
}

// Utilise les datas de l'API pour afficher les projets //
async function afficherTravaux() {
  const data = await dataTri();
  afficherGallerie(data);
}

// Utilise les datas de l'API pour afficher les filtres //
async function selectionDataFiltres() {
  //récupère les datas de la function dataTri()//
  const data = await dataTri();
  let idFiltres = [];
  idFiltres.push({ name: "Tous", id: 0 });

  // Pour chaque éléments du tableau data, compare moi avec le tableau idFiltres l'ID//
  data.forEach((item) => {
    const existe = idFiltres.some(
      (idFiltres) => idFiltres.id === item.category.id,
    );

    // Si les id sont différents, tu me le push dans le tableau//
    if (!existe) {
      idFiltres.push({
        name: item.category.name,
        id: item.category.id,
      });
    }
  });

  // Affichage des lignes avec l'ID et le nom de chaque catégorie//
  portfolioFiltres.innerHTML = idFiltres
    .map(
      (filtre) =>
        `<li class="portfolio-filtres_all" data-category =${filtre.id}>${filtre.name}</li>`,
    )
    .join("");
}

function afficherGallerie(tableau) {
  // vide ma gallerie avant chaque actualisation//
  galerie.innerHTML = "";

  // Pour chaque tableau transmis en paramètres, affiche moi ceci//
  tableau.forEach((item) => {
    galerie.innerHTML += `
        <li data-id="${item.id}">
            <img src=${item.imageUrl} alt=${item.title}></img>
            <figcaption>${item.title}</figcaption>
        </li>`;
  });
}
//Mis en place du tri Fonctionnelle //

async function triFonctionnelle() {
  const data = await dataTri();

  // Filtre et récupère dans un tableau les éléments appartennant au même id //
  const triObjet = data.filter((objet) => objet.category.id === 1);
  const triAppartements = data.filter((objet) => objet.category.id === 2);
  const triHotel = data.filter((objet) => objet.category.id === 3);

  portfolioFiltres.addEventListener("click", (e) => {
    // récupère le data-category de mes <li> //
    const cible = e.target.dataset.category;
    // Distingue les 4 catégories différentes pour l'affichage//
    switch (cible) {
      case "0":
        afficherGallerie(data);
        break;
      case "1":
        afficherGallerie(triObjet);
        break;
      case "2":
        afficherGallerie(triAppartements);
        break;
      case "3":
        afficherGallerie(triHotel);
        break;
    }
  });
}

function loginActif() {
  const header = document.querySelector("header");
  const login = document.querySelector(".nav-login");
  const titreProjets = document.querySelector(".mes-projets");
  const btnProjets = document.createElement("button");

  //Création d'éléments du DOM //
  const divHead = document.createElement("div");
  const icone = document.createElement("i");
  const iconeProjets = document.createElement("i");

  const spanBtn = document.createElement("span");

  const spanHead = document.createElement("span");
  spanHead.textContent = "Mode édition";

  //Ajout de class //
  spanHead.classList.add("header-admin_span");
  icone.classList.add("fa-solid", "fa-pen-to-square");
  iconeProjets.classList.add("fa-solid", "fa-pen-to-square");
  divHead.classList.add("header-admin");
  spanBtn.textContent = "modifier";
  btnProjets.type = "button";
  btnProjets.classList.add("btn-modifier");

  // Rattacher les enfants aux parents//
  divHead.appendChild(icone);
  divHead.appendChild(spanHead);
  btnProjets.appendChild(iconeProjets);
  btnProjets.appendChild(spanBtn);

  if (localStorage.getItem("token")) {
    header.appendChild(divHead);
    login.textContent = "logout";
    portfolioFiltres.classList.add("hide");
    titreProjets.appendChild(btnProjets);

    login.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      login.textContent = "login";
      divHead.remove();
      iconeProjets.remove();
      btnProjets.remove();
      portfolioFiltres.classList.remove("hide");
      window.location.href = "index.html";
    });
  }
}

async function modale() {
  // Variables du DOM
  const modaleGallerie = document.querySelector(".modale-view_one");
  const modaleAjoutPhoto = document.querySelector(".modale-view_two");
  const overlay = document.querySelector(".overlay.hide");

  // Ecoute du bouton modifier pour afficher la modale //

  const btnProjets = document.querySelector(".btn-modifier");
  btnProjets.addEventListener("click", async () => {
    // Récupère mes datas une fois réactualiser //
    const data = await dataTri();

    overlay.classList.remove("hide");
    modaleGallerie.classList.remove("hide");
    affichageGallerieModale(data);
  });

  // Ecoute ma gallerie modale, si elle contient ces éléments alors elle affiche modale/Ajout photo//
  divGallerie.addEventListener("click", (e) => {
    const cible = e.target.classList;
    console.log(cible);

    if (cible.contains("fa-xmark")) {
      modaleGallerie.classList.add("hide");
      modaleAjoutPhoto.classList.add("hide");
      overlay.classList.add("hide");
    }
    if (cible.contains("fa-arrow-left")) {
      modaleGallerie.classList.remove("hide");
      modaleAjoutPhoto.classList.add("hide");
    }
    if (cible.contains("overlay")) {
      modaleGallerie.classList.add("hide");
      modaleAjoutPhoto.classList.add("hide");
      overlay.classList.add("hide");
    }
    if (cible.contains("modale-button")) {
      modaleGallerie.classList.add("hide");
      modaleAjoutPhoto.classList.remove("hide");
    }
    if (cible.contains("fa-trash-can")) {
      // Supprime les travaux de la modale et de la galerie //
      const li = e.target.closest(".modale-photos_all");
      const id = e.target.dataset.id;
      li.remove();
      const galerieItem = document.querySelector(
        `.gallery li[data-id="${id}"]`,
      );
      galerieItem.remove();

      suppression(id);
    }
  });
}

async function suppression(id) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 500) {
      console.log("Erreur serveur");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
}

// -----------------------------------  //

async function formAjoutPhoto() {
  const formulaire = document.querySelector("#formulaire");
  const inputText = document.querySelector("input[type='text']");
  const selectInput = document.querySelector("select");
  const formAjout = document.querySelector(".form-ajout");
  const inputFile = document.querySelector(".form-ajout_file");
  const spanMessage = document.querySelector(".form-span");
  const buttonForm = document.querySelector(".modale-form_button");

  const category = await formCategory();

  category.forEach((categorie) => {
    const option = document.createElement("option");
    option.value = categorie.id;
    option.textContent = categorie.name;
    selectInput.appendChild(option);
  });

  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      let previewImg = document.createElement("img");
      previewImg.classList.add("preview-img");
      previewImg.src = e.target.result;
      formAjout.appendChild(previewImg);
    };
    reader.readAsDataURL(file);
    formAjout.classList.add("preview");
  });

  formulaire.addEventListener("click", (e) => {
    const title = inputText.value;
    const category = Number(selectInput.value);
    const image = inputFile.files[0];

    if (title && category && image) {
      buttonForm.classList.add("preview");
    }
  });

  formulaire.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = inputText.value;
    const category = Number(selectInput.value);
    const image = inputFile.files[0];

    if (!title || !category || !image) {
      alert("Veuillez remplir les champs !");
      formAjout.classList.remove();
      spanMessage.classList.add("hide");
    } else if (title && category && image) {
      spanMessage.classList.remove("hide");
      setTimeout(() => {
        spanMessage.classList.add("hide");
      }, 3000);
    }

    formData(image, title, category).then(() => {
      formulaire.reset();

      const previewImg = formAjout.querySelector(".preview-img");
      if (previewImg) {
        previewImg.remove();
        formAjout.classList.remove("preview");
        buttonForm.classList.remove("preview");
      }
    });
  });
}

async function formCategory() {
  const reponse = await fetch("http://localhost:5678/api/categories", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (reponse.status === 200) {
    // console.log("C'est good");
  } else if (reponse.status === 500) {
    console.log("Erreur serveur");
  }

  const category = await reponse.json();
  return category;
}

async function affichageGallerieModale(data) {
  const modalePhoto = document.querySelector(".modale-photos");
  // Ecoute le bouton "modifier" et injecte du HTML au click pour former la modale //
  const affichageLi = data
    .map(
      (item) => `
        <li class="modale-photos_all" >
          <i class="fa-solid fa-trash-can" data-id="${item.id}"></i>
          <img src="${item.imageUrl}" alt="${item.title}">
        </li>
      `,
    )
    .join("");

  modalePhoto.innerHTML = ` ${affichageLi} `;
}

async function formData(image, title, category) {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("image", image);
  formData.append("title", title);
  formData.append("category", category);

  const request = new XMLHttpRequest();
  request.open("POST", "http://localhost:5678/api/works", true);

  request.setRequestHeader("Authorization", `Bearer ${token}`);
  request.onload = async () => {
    // Au chargement de la requête, affiche actualise moi ma gallerie en arrière plan //
    const data = await dataTri();
    afficherGallerie(data);
    affichageGallerieModale(data);

    // Si ma requête est accepté alors affiche moi //
    if (request.status === 500) {
      console.log(`Erreur lors de l'envoie ${request.status}`);
    }
  };

  request.send(formData);
}

afficherTravaux();
selectionDataFiltres();
triFonctionnelle();
loginActif();
modale();
formAjoutPhoto();
