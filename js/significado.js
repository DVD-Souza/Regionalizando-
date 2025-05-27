const token = localStorage.getItem("token");
let contadorSignificados = 0;

window.onload = async function () {
  const nome = localStorage.getItem("wordNameSelecionado") || "Palavra";
  const titulo = document.querySelector(".Titulo");
  if (titulo) titulo.textContent = nome;

  await carregarSignificados(contadorSignificados, 6);
};

function buscarRegiao(location_id) {
  const regioes = {
    1: "Nordeste",
    2: "Sul",
    3: "Norte",
    4: "Centro Oeste",
    5: "Sudeste"
  };

  return regioes[location_id] || "Região desconhecida";
}


async function criarDivSignificado(meaning, wordName) {
  const container = document.getElementById("containerSignificados");

  const tipo = meaning.type || "Tipo Significado";
  const descricao = meaning.description || "Descrição significado";
  const palavra = wordName || "Palavra";

  // Buscando nome da região
  const regiao = buscarRegiao(meaning.location_id);


  const usuario = "Usuário"; // Futuramente, buscar com meaning.user_id
  const data = "Data"; // Futuramente pode ser adicionado
  const likes = 0;
  const dislikes = 0;
  const classeDiv = contadorSignificados % 2 === 0 ? "palavra" : "palavra1";

  const div = document.createElement("div");
  div.className = classeDiv;

  div.innerHTML = `
    <button class="nomesignificado">${palavra}</button>
    <p class="tiposignificado">${tipo}</p>
    <p class="descricaosignificado">${descricao}</p>
    <p> Significado de "${palavra}" por <button class="nomeusuario" onclick="telaPerfil()">${usuario}</button> em ${data}</p>
    <div class="likedislike">
      <button class="likeimagem">
        <img src="./assets/Like.png" alt="Imagem Like">
        <p>${likes}</p>
      </button>
      <button class="dislikeimagem">
        <img src="./assets/Dislike.png" alt="Imagem Dislike">
        <p>${dislikes}</p>
      </button>
    </div>
    <p class="regiaonome">${regiao}</p>
  `;

  container.appendChild(div);

  const btn = div.querySelector("button.nomesignificado");
  if (btn) {
    btn.addEventListener("click", () => {
      localStorage.setItem("wordNameSelecionado", wordName);
      localStorage.setItem("wordIdSelecionado", meaning.meaning_id || localStorage.getItem("wordIdSelecionado"));
      window.location.href = "significado.html";
    });
  }

  contadorSignificados++;
}

async function carregarSignificados(inicio, quantidade) {
  try {
    const wordId = localStorage.getItem("wordIdSelecionado");
    if (!wordId) {
      alert("Nenhuma palavra selecionada para carregar os significados.");
      return;
    }

    const response = await fetch(`http://localhost:3000/meanings/word/${wordId}/meaning`);
    if (!response.ok) throw new Error("Erro na requisição dos significados");

    const data = await response.json();
    const significados = data.meanings.slice(inicio, inicio + quantidade);
    if (significados.length === 0) {
      alert("Não há mais significados para mostrar.");
      return;
    }

    const nome = localStorage.getItem("wordNameSelecionado") || "Palavra";

    for (const meaning of significados) {
      await criarDivSignificado(meaning, nome);
    }
  } catch (error) {
    console.error("Erro ao carregar significados:", error);
  }
}

// Navegação
function mostrarMensagem() {
  alert("Você clicou no botão!");
}
function telaLogin() {
  window.location.href = "login.html";
}
function telaPerfil() {
  window.location.href = "perfil.html";
}
function telaIndex() {
  window.location.href = "Index.html";
}

// Evento do botão "Ver Mais"
const btnVerMais = document.getElementById("btnVerMais");
if (btnVerMais) {
  btnVerMais.addEventListener("click", async () => {
    await carregarSignificados(contadorSignificados, 6);
  });
}
