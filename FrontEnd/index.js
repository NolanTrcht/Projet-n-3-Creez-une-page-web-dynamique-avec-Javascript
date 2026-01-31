const portfolioFiltres = document.getElementById("portfolio-filtres");
const galerie = document.querySelector(".gallery");
const divGallerie = document.createElement("div");

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
  galerie.innerHTML = ``;

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
    console.log(cible);
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
  btnProjets.classList.add(".button-modifier")
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
  // Récupère ma data de l'API //
  const data = await dataTri();

  // Ecoute du bouton modifier pour afficher la modale //
  const btnProjets = document.querySelector("button");
  btnProjets.addEventListener("click", (e) => {
    affichageGallerieModale(data)
  })
 
   // Ecoute ma gallerie modale, si elle contient ces éléments alors elle affiche modale/Ajout photo//
    divGallerie.addEventListener("click", (e) => {
      console.log(e.target)
      const cible = e.target.classList
      
      if (cible.contains("overlay")) {
        divGallerie.innerHTML = "";
      }  
      if (cible.contains("fa-xmark")) {
        divGallerie.innerHTML = "";
      }   
      if(cible.contains("fa-arrow-left")){
          affichageGallerieModale(data)
      }
      if(cible.contains("modale-button")){
        affichageModaleAjoutPhoto()
      }
      if(cible.contains("fa-trash-can")){

        // Supprime les travaux de la modale et de la galerie //
        const li = e.target.closest(".modale-photos_all")
        const id = e.target.dataset.id
        li.remove(id)
        
        const galerieItem = document.querySelector(`.gallery li[data-id="${id}"]`)
        galerieItem.remove()
      }
    });
    
        affichageModaleAjoutPhoto()
    
      }
    
    // -----------------------------------  //


      



function affichageModaleAjoutPhoto(){
      divGallerie.innerHTML = `
      <div class='overlay'>
        <div class='modale'>
            <i class="fa-solid fa-arrow-left"></i>
            <i class="fa-solid fa-xmark"></i>
            <h2>Ajout photo</h2>
            <form>
              <div class='form-ajout'>
                <i class="fa-regular fa-image"></i>
                <button>+ Ajouter photo</button>
                <p>jpg.png: 4mo max</p>
              </div>
              <div class='form-formulaire'>
                <label for='titre'>Titre</label>
                <input type='text' name='titre' class='form-input'></input>
                <label for='categorie'>Catégorie</label>
                <select name='categorie' class='form-input'>
                  <option></option>
                  <option>Objets</option>
                  <option>Appartements</option>
                  <option>Hôtel</option>
                </select>
              </div>
                <button class='modale-form_button'>Valider</button>
            </form>
        </div>
      </div>`;
    }



async function affichageGallerieModale(data) {
  
  const mesProjets = document.querySelector(".mes-projets");

  // Ecoute le bouton "modifier" et injecte du HTML au click pour former la modale //
  const affichageLi = 
 data.map(
      (item) => `
        <li class="modale-photos_all" >
          <i class="fa-solid fa-trash-can" data-id="${item.id}"></i>
          <img src="${item.imageUrl}" alt="${item.title}">
        </li>
      `,
    ).join("")


    mesProjets.appendChild(divGallerie);
    divGallerie.innerHTML = `
  <div class='overlay'>
    <div class='modale'>
      <i class="fa-solid fa-xmark"></i>
      <h2>Galerie photo</h2>
      <ul class="modale-photos">
          ${affichageLi}
      </ul>
      <button class="modale-button">Ajouter une photo</button>
    </div>
  </div>`;
  }


afficherTravaux();
selectionDataFiltres();
triFonctionnelle();
loginActif();

modale();
