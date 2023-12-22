let pokemon = []; // Dichiarato a livello globale

document.addEventListener("DOMContentLoaded", async () => {
  try {
    pokemon = await fetchDataAndGenerateCards();
    setupSearchEventListener();
  } catch (error) {
    console.error("Error initializing:", error);
  }
});

const fetchData = async () => {
  try {
    const data = await fetch(
      `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json`
    );
    const response = await data.json();
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rilancia l'errore per gestirlo nella chiamata di fetchDataAndGenerateCards
  }
};

const generateCards = (pokemon_list) => {
  const main_container = document.querySelector("#main_container");
  main_container.innerHTML = "";

  if (pokemon_list) {
    pokemon_list.forEach((element) => {
      const card = document.createElement("div");
      card.classList.add("pokemon_card");

      const id = element.id;

      function formatID(id) {
        if (id.toString().length == 1) return `00${id}`;
        if (id.toString().length == 2) return `0${id}`;
        return id;
      }

      const img_container = document.createElement("div");
      img_container.classList.add("img_container");
      const img = document.createElement("img");
      img.classList.add("images");
      img.src = `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${formatID(
        element.id
      )}.png`;
      img.alt = element.id;

      const text_container = document.createElement("div");
      text_container.classList.add("text_container");

      const name = document.createElement("h2");
      name.textContent = element.name.english;

      const base_values = Object.entries(element.base).map(
        ([key, value]) => `${key}: ${value}`
      );

      const description = document.createElement("div");
      description.classList.add("paragraph_description");

      const span = document.createElement("span");
      span.textContent = `Type: ${element.type.join(", ")}`;
      const list_skills = document.createElement("ul");

      base_values.forEach((obj) => {
        const list_element = document.createElement("li");
        list_element.textContent = obj;
        list_skills.appendChild(list_element);
      });

      main_container.appendChild(card);
      card.append(img_container, text_container);
      img_container.classList.add("img_container");
      img_container.appendChild(img);
      text_container.append(name, description);
      description.appendChild(list_skills);
    });
  } else {
    console.error("No Pokemon data available.");
  }
};

const fetchDataAndGenerateCards = async () => {
  try {
    const pokemon_results = await fetchData();
    generateCards(pokemon_results);

    $("#main_container").slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    });

    return pokemon_results;
  } catch (error) {
    console.error("Error fetching data and generating cards:", error);
    throw error; // Rilancia l'errore per gestirlo nella chiamata di fetchDataAndGenerateCards
  }
};

const setupSearchEventListener = () => {
  const search_bar = document.getElementById("search_bar");

  search_bar.addEventListener("keyup", (e) => {
    let filteredPokemon = [];
    if (filteredPokemon) {
      filteredPokemon = pokemon.filter((pkmn) => {
        return pkmn.name.english.startsWith(e.target.value) ||  pkmn.type[0].startsWith(e.target.value);
      });
    }
    generateCards(filteredPokemon);
  });
};
