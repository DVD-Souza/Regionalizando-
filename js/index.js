// ======= Token ++++++++++++++++++++++++======================================= =======

const token = localStorage.getItem("token");
const decodedToken = decodeJwt(token);
const userIdAtual = decodedToken ? decodedToken.id : null;

fetch("http://localhost:3000/rota-protegida", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "authorization": token
  }
});

function decodeJwt(token) {
  if (!token) return null;
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
}

// =================================================================================
// Evento de clique na imagem da lupa
document.querySelector(".buscarimg").addEventListener("click", buscarTermo);

// Ou permite Enter no input também
document.getElementById("buscar").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    buscarTermo();
  }
});

// Função que faz a requisição ao backend com o texto digitado
async function buscarTermo() {
  const termo = document.getElementById("buscar").value.trim();

  if (!termo) {
    alert("Digite um termo para buscar.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/words/word/search?name=${encodeURIComponent(termo)}`);
    if (!response.ok) throw new Error("Erro ao buscar termo");

    const data = await response.json();

    console.log("Resultado da busca:", data);

    // Limpa os significados atuais e exibe os novos:
    document.getElementById("containerSignificados").innerHTML = "";
    contadorSignificados = 0;

    for (const item of data.data) {
      const significado = await buscarSignificadoPorPalavraId(item.element_id);
      await criarDivPalavra(item, significado);
      contadorSignificados++;
    }

    // Após criar os botões, adiciona eventos para salvar palavra clicada
    adicionarEventosClique();

  } catch (error) {
    console.error("Erro ao buscar no backend:", error);
  }
}

// ======= Contador de significados carregados =======
let contadorSignificados = 0;

// ======= Funções de navegação =======
function mostrarMensagem() { alert("Em Breve"); }
function telaLogin() { window.location.href = "login.html"; }
function telaSignificado() { window.location.href = "significado.html"; }
function telaPerfil() { window.location.href = "perfil.html"; }
function telaAdicionar() { window.location.href = "adicionar.html"; }
function telaIndex() { window.location.href = "Index.html"; }

// ======= Função para buscar significado pelo wordId =======
async function buscarSignificadoPorPalavraId(wordId) {
  try {
    const response = await fetch(`http://localhost:3000/meanings/word/${wordId}/meaning`);
    if (!response.ok) throw new Error("Erro ao buscar significados");
    const data = await response.json();
    return data.meanings?.[0] || null;
  } catch (error) {
    console.error("Erro ao buscar significado:", error);
    return null;
  }
}

// ======= Função para buscar likes e dislikes =======
async function buscarLikesDislikes(wordId, meaningId) {
  try {
    const response = await fetch(`http://localhost:3000/interactions/word/${wordId}/count/meaning/${meaningId}`);
    if (!response.ok) throw new Error("Erro ao buscar likes/dislikes");
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar likes/dislikes:", error);
    return { total_likes: 0, total_dislikes: 0 };
  }
}

// ======= Função para enviar like ou dislike =======
async function enviarInteracao(wordId, meaningId, like, dislike) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3000/interactions/word/${wordId}/meaning/${meaningId}/interaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({ like, dislike })
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert("Você precisa fazer login para dar likes ou dislikes.");
        return null;
      }
      throw new Error("Erro ao enviar interação");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar interação:", error);
    return null;
  }
}

// ======= Atualiza os contadores de likes/dislikes na div =======
function atualizarLikesDislikes(div, likes, dislikes) {
  const likeP = div.querySelector(".likeimagem p");
  const dislikeP = div.querySelector(".dislikeimagem p");
  if (likeP) likeP.textContent = likes;
  if (dislikeP) dislikeP.textContent = dislikes;
}

// ======= Cria a div palavra com dados e eventos =======
async function criarDivPalavra(item, significado) {
  const container = document.getElementById("containerSignificados");
  if (!item || !significado) return;

  const regioes = {
    1: "Nordeste",
    2: "Sul",
    3: "Norte",
    4: "Centro-Oeste",
    5: "Sudeste"
  };

  const corClasse = contadorSignificados % 2 === 0 ? "bc-terciary" : "bc-secondary";

  const div = document.createElement("div");
  div.className = `palavra ${corClasse}`;
  div.setAttribute("data-word-id", item.element_id);
  div.setAttribute("data-meaning-id", significado.meaning_id);

  const botao = document.createElement("button");
  botao.className = "nomesignificado";
  botao.textContent = item.word || "Sem palavra";
  botao.setAttribute("data-word-id", item.element_id);
  botao.setAttribute("data-word", item.word);
  botao.onclick = function () {
    abrirSignificado(this);
  };

  div.appendChild(botao);

  // Agora usa location_id do significado (não do item)
  const regionId = Number(significado.location_id);
  const nomeRegiao = regioes[regionId] || "Região desconhecida";

  div.innerHTML += `
    <p class="tiposignificado">${significado.type || "Tipo Significado"}</p>
    <p class="descricaosignificado">${significado.description || "Descrição significado"}</p>
    <p> Significado de "${item.word}" por 
        <button class="nomeusuario" onclick="telaPerfil()">${item.name || "Usuário"}</button>.
    </p>
    <div class="likedislike">
        <button class="likeimagem">
            <img src="./assets/Like.png" alt="Imagem Like">
            <p>0</p>
        </button>
        <button class="dislikeimagem">
            <img src="./assets/Dislike.png" alt="Imagem Dislike">
            <p>0</p>
        </button>
    </div>
    <p class="regiaonome">${nomeRegiao}</p>
  `;

  container.appendChild(div);

  // Aqui busca os likes e dislikes do backend e atualiza os números na interface
  const wordId = item.element_id;
  const meaningId = significado.meaning_id;

  const counts = await buscarLikesDislikes(wordId, meaningId);
  atualizarLikesDislikes(div, counts.total_likes, counts.total_dislikes);

  // Adiciona eventos para o like e dislike
  const likeBtn = div.querySelector(".likeimagem");
  const dislikeBtn = div.querySelector(".dislikeimagem");

  likeBtn.addEventListener("click", async () => {
    const result = await enviarInteracao(wordId, meaningId, 1, 0);
    if (result) {
      if (result.total_likes === undefined || result.total_dislikes === undefined) {
        const counts = await buscarLikesDislikes(wordId, meaningId);
        atualizarLikesDislikes(div, counts.total_likes, counts.total_dislikes);
      } else {
        atualizarLikesDislikes(div, result.total_likes, result.total_dislikes);
      }
    }
  });

  dislikeBtn.addEventListener("click", async () => {
    const result = await enviarInteracao(wordId, meaningId, 0, 1);
    if (result) {
      if (result.total_likes === undefined || result.total_dislikes === undefined) {
        const counts = await buscarLikesDislikes(wordId, meaningId);
        atualizarLikesDislikes(div, counts.total_likes, counts.total_dislikes);
      } else {
        atualizarLikesDislikes(div, result.total_likes, result.total_dislikes);
      }
    }
  });
}






// ======= Adiciona evento de clique para salvar palavra e redirecionar =======
function adicionarEventosClique() {
  const botoes = document.querySelectorAll('.nomesignificado');
  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const wordId = botao.getAttribute("data-word-id");
      const wordName = botao.getAttribute("data-word");
      localStorage.setItem("wordIdSelecionado", wordId);
      localStorage.setItem("wordNameSelecionado", wordName);
      window.location.href = "significado.html";
    });
  });
}

// ======= Função que preenche significados a partir do índice passado =======
async function preencherSignificados(inicio = 0) {
  try {
    const response = await fetch("http://localhost:3000/words/word");
    if (!response.ok) throw new Error("Erro na requisição");
    const data = await response.json();

    for (let i = inicio; i < inicio + 6; i++) {
      const item = data.data[i];
      if (!item) break;

      const significado = await buscarSignificadoPorPalavraId(item.element_id);
      await criarDivPalavra(item, significado);
      contadorSignificados++;
    }

    // Após criar os botões, adiciona evento de clique para eles
    adicionarEventosClique();

  } catch (error) {
    console.error("Erro ao preencher os significados:", error);
  }
}

// ======= Botão Ver Mais =======
document.getElementById("btnVerMais").addEventListener("click", async function () {
  try {
    const response = await fetch("http://localhost:3000/words/word");
    if (!response.ok) throw new Error("Erro na requisição");
    const data = await response.json();

    let divsRestantes = 96 - contadorSignificados;
    if (divsRestantes <= 0) {
      alert("Limite de resultados atingido");
      return;
    }

    let divsParaCriar = Math.min(6, divsRestantes);

    for (let i = 0; i < divsParaCriar; i++) {
      const item = data.data[contadorSignificados];
      if (!item) break;

      const significado = await buscarSignificadoPorPalavraId(item.element_id);
      await criarDivPalavra(item, significado);
      contadorSignificados++;
    }

    // Após criar os botões, adiciona evento de clique para eles
    adicionarEventosClique();

  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
  }
});

// ======= Ao carregar a página =======
window.onload = function () {
  contadorSignificados = 0;
  document.getElementById("containerSignificados").innerHTML = ""; // limpa conteúdo antes de preencher
  preencherSignificados(0);
};

function abrirSignificado(botao) {
    const wordId = botao.getAttribute("data-word-id");
    const wordName = botao.getAttribute("data-word");
    localStorage.setItem("wordIdSelecionado", wordId);
    localStorage.setItem("wordNameSelecionado", wordName);
    window.location.href = "significado.html";
}
