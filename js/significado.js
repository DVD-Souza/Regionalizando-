const token = localStorage.getItem("token");


window.onload = async function() {
  // Atualiza o título com o nome da palavra salvo no localStorage
  
const nome = localStorage.getItem("wordNameSelecionado");
const titulo = document.querySelector(".Titulo");

if (titulo) {
  if (nome) {
    titulo.textContent = nome; 
  }
}

  const wordId = localStorage.getItem("wordIdSelecionado");
  if (wordId) {
    console.log("ID da palavra recebido:", wordId);
  } else {
    console.warn("Nenhum ID de palavra foi recebido.");
  }

  await carregarSignificados(0, 6);

  // Modal
  const modal = document.getElementById("myModal");
  // btn de abrir modal já está com onclick no HTML
  const span = document.getElementsByClassName("close")[0];
  
  if (span && modal) {
    span.onclick = () => modal.style.display = "none";
  }
  
  if (modal) {
    window.onclick = (event) => {
      if (event.target == modal) modal.style.display = "none";
    };
  }
};

let contadorSignificados = 0;

async function criarDivSignificado(item) {
  const container = document.getElementById("containerSignificados");

  const likes = item.likes || 0;
  const dislikes = item.dislikes || 0;
  const tipo = item.type || "Tipo Significado";
  const descricao = item.description || "Descrição significado";
  const palavra = item.word || "Palavra";
  const usuario = item.name || "Usuário";
  const data = item.date || "Data";
  const regiao = item.region || "Região";

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
      localStorage.setItem("nomePalavraSelecionada", palavra);
      window.location.href = "significado.html";
    });
  }

  contadorSignificados++;
}

async function carregarSignificados(inicio, quantidade) {
  try {
    const wordId = localStorage.getItem("wordIdSelecionado");
    const url = wordId ? `http://localhost:3000/words/word/${wordId}` : "http://localhost:3000/words/word";
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro na requisição");
    const data = await response.json();

    const significados = data.data.slice(inicio, inicio + quantidade);

    if (significados.length === 0) {
      alert("Não há mais significados para mostrar.");
      return;
    }

    for (const item of significados) {
      await criarDivSignificado(item);
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

// Verifica se o botão existe antes de adicionar evento
const btnVerMais = document.getElementById("btnVerMais");
if (btnVerMais) {
  btnVerMais.addEventListener("click", async () => {
    await carregarSignificados(contadorSignificados, 6);
  });
}
