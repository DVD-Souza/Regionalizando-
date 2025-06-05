const { name } = require("ejs");

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const name = localStorage.getItem("name");


let contadorSignificados = 0;// Supondo que a resposta contenha o ID do usuário


window.onload = async function () {
  const nome = localStorage.getItem("wordNameSelecionado") || "Palavra";
  const titulo = document.querySelector(".Titulo");
  if (titulo) titulo.textContent = nome;

  await carregarSignificados(contadorSignificados, 6);
};

function telaAdicionar() { window.location.href = "adicionar.html"; }

function criarMeaning() {
  const wordId = localStorage.getItem("wordIdSelecionado");
  const token = localStorage.getItem("token");

  if (!wordId) {
    alert("Nenhuma palavra selecionada para criar o significado.");
    return;
  }

  if (!token) {
    alert("Você precisa estar logado para criar um significado.");
    window.location.href = "/login";
    return;
  }

  const payload = {
    addedBy: name, // substitua pelo id real do usuário logado, se tiver
    region: 3,
    description: 'teste',
    info: 'exemplo de uso',
    type: 'adjective',
  };

  fetch(`http://localhost:3000/meanings/word/${wordId}/meaning/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  .then(async res => {
    if (!res.ok) {
      const errorData = await res.json();
      if (
        errorData.message === 'Token expirado. Por favor, faça login novamente.' ||
        errorData.message === 'Token inválido. Por favor, faça login novamente.'
      ) {
        alert(errorData.message);
        window.location.href = '/login';
        return;
      }
      throw new Error(errorData.message || 'Erro desconhecido');
    }
    return res.json();
  })
  .then(data => {
    alert('Significado criado com sucesso!');
    // Atualize sua lista aqui se quiser
  })
  .catch(err => {
    alert('Erro: ' + err.message);
  });
}


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
  const wordId = localStorage.getItem("wordIdSelecionado");
  const meaningId = meaning.meaning_id;
  const exemploUso = meaning.additional_info || "";


  const total = await buscarTotalLikesDislikes(wordId, meaningId);
  const likes = total.total_likes || 0;
  const dislikes = total.total_dislikes || 0;

  const container = document.getElementById("containerSignificados");

  const tipo = traduzirTipoInglesParaPortugues(meaning.type) || "Tipo Significado";
  const descricao = meaning.description || "Descrição significado";
  const palavra = wordName || "Palavra";

  const regiao = buscarRegiao(meaning.location_id);
  const usuario = meaning.user_id || "Usuário";
  const data = meaning.createdAt ? new Date(meaning.createdAt).toLocaleDateString() : "Data";

  const classeDiv = contadorSignificados % 2 === 0 ? "palavra" : "palavra1";

  const div = document.createElement("div");
  div.className = classeDiv;

  div.innerHTML = `
    <button class="nomesignificado">${palavra}</button>
    <p class="tiposignificado">${tipo}</p>
    <p class="descricaosignificado">${descricao}</p>
    <p class="exemplouso">Exemplo: ${exemploUso}</p>
    <p> Significado de "${palavra}" por <button class="nomeusuario" onclick="telaPerfil()">${usuario}</button> em ${data}</p>
    <div class="likedislike">
      <button class="likeimagem">
        <img src="./assets/Like.png" alt="Imagem Like">
        <p class="likes-count">${likes}</p>
      </button>
      <button class="dislikeimagem">
        <img src="./assets/Dislike.png" alt="Imagem Dislike">
        <p class="dislikes-count">${dislikes}</p>
      </button>
    </div>
    <p class="regiaonome">${regiao}</p>
  `;

  container.appendChild(div);



  // Botão para abrir modal do significado
  const btn = div.querySelector("button.nomesignificado");
  if (btn) {
    btn.addEventListener("click", () => {
      exibirModal({
        palavra,
        tipo,
        descricao,
        regiao,
        usuario
      });
    });
  }

  const likeBtn = div.querySelector("button.likeimagem");
  const dislikeBtn = div.querySelector("button.dislikeimagem");

  if (likeBtn) {
    likeBtn.addEventListener("click", async () => {
      const resultado = await enviarInteracao(wordId, meaningId, 1, 0);
      if (resultado) {
  // Buscar totais atualizados após enviar a interação
  const totaisAtualizados = await buscarTotalLikesDislikes(wordId, meaningId);
  atualizarLikesDislikes(div, totaisAtualizados.total_likes, totaisAtualizados.total_dislikes);
  atualizarEstadoBotoes(div, resultado.user_reaction);
}

    });
  }

 if (dislikeBtn) {
  dislikeBtn.addEventListener("click", async () => {
    const resultado = await enviarInteracao(wordId, meaningId, 0, 1);
    if (resultado) {
      const totaisAtualizados = await buscarTotalLikesDislikes(wordId, meaningId);
      atualizarLikesDislikes(div, totaisAtualizados.total_likes, totaisAtualizados.total_dislikes);
      atualizarEstadoBotoes(div, resultado.user_reaction);
    }
  });
}



  // Busca interação do usuário para ajustar o estado inicial dos botões
  const interacaoUsuario = await buscarInteracaoUsuario(wordId, meaningId);
  if (interacaoUsuario) {
    if (interacaoUsuario.like) likeBtn.classList.add("selecionado");
    if (interacaoUsuario.dislike) dislikeBtn.classList.add("selecionado");
  }

  contadorSignificados++;
}


function atualizarLikesDislikes(div, likes, dislikes) {
  const likeBtn = div.querySelector("button.likeimagem");
  const dislikeBtn = div.querySelector("button.dislikeimagem");

  if (likeBtn) {
    const pLikes = likeBtn.querySelector("p");
    if (pLikes) pLikes.textContent = Number(likes) || 0;
  }
  if (dislikeBtn) {
    const pDislikes = dislikeBtn.querySelector("p");
    if (pDislikes) pDislikes.textContent = Number(dislikes) || 0;
  }
}



function atualizarEstadoBotoes(div, userReaction) {
  const likeBtn = div.querySelector("button.likeimagem");
  const dislikeBtn = div.querySelector("button.dislikeimagem");

  if (!likeBtn || !dislikeBtn) return;

  if (userReaction === "like") {
    likeBtn.classList.add("selecionado");
    dislikeBtn.classList.remove("selecionado");
  } else if (userReaction === "dislike") {
    dislikeBtn.classList.add("selecionado");
    likeBtn.classList.remove("selecionado");
  } else { // reaction "none" ou null
    likeBtn.classList.remove("selecionado");
    dislikeBtn.classList.remove("selecionado");
  }
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

// Modal
function exibirModal({ palavra, tipo, descricao, regiao, usuario }) {
  document.getElementById("modalPalavra").textContent = palavra;
  document.getElementById("modalTipo").textContent = tipo;
  document.getElementById("modalDescricao").textContent = descricao;
  document.getElementById("modalRegiao").textContent = regiao;
  document.getElementById("modalUsuario").textContent = usuario;

  const modal = document.getElementById("modalSignificado");
  modal.style.display = "flex";

  const spanClose = modal.querySelector(".close");
  spanClose.onclick = () => modal.style.display = "none";

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

// Navegação
function mostrarMensagem() {
  alert("Você clicou no botão!");
}
function telaLogin() {
  window.location.href = "login.html";
}

function telaCadastro() {
  window.location.href = "Registro.html";
}

function telaPerfil() {
  window.location.href = "perfil.html";
}
function telaIndex() {
  window.location.href = "Index.html";
}

// Botão Ver Mais
const btnVerMais = document.getElementById("btnVerMais");
if (btnVerMais) {
  btnVerMais.addEventListener("click", async () => {
    await carregarSignificados(contadorSignificados, 6);
  });
}

    function abrirmodal() {
      const modal = document.createElement("div");
      modal.classList.add("modal");

      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal_background">
            <button class="fechar" onclick="fecharmodal(this)">X</button>
            <h2 class="titulo">Adicionar novo significado</h2>

            <textarea
              id="comentarioInput"
              class="escreverSignificado"
              rows="3"
              col="3"
              maxlength="300"
              placeholder="Digite seu comentário (máximo 300 caracteres)"
            ></textarea>

              
            <textarea
              id="exemploUsoInput"
              name="exemploUso"
              placeholder="Digite um exemplo de uso"
              rows="3"
              col="3"
              maxlength="200"
              class="escreverSignificado"
            ></textarea>


            <div class="container_classe_regiao">
              <div class="classe_regiao">
                <label class="label_classe_regiao" for="classeGramaticalSelect">Classe gramatical:</label>
                <select id="classeGramaticalSelect" name="classeGramatical">
                  <option value="">Selecione</option>
                  <option value="noun">Substantivo</option>
                  <option value="verb">Verbo</option>
                  <option value="adjective">Adjetivo</option>
                  <option value="adverb">Advérbio</option>
                  <option value="pronoun">Pronome</option>
                  <option value="preposition">Preposição</option>
                  <option value="conjunction">Conjunção</option>
                  <option value="interjection">Interjeição</option>
                  <option value="article">Artigo</option>
                </select>
              </div>
            

              <div class="classe_regiao">
                <label class="label_classe_regiao" for="regiaoSelect">Região:</label>
                <select id="regiaoSelect" name="regiao">
                  <option value="">Selecione</option>
                  <option value="Sul">Sul</option>
                  <option value="Sudeste">Sudeste</option>
                  <option value="Centro-Oeste">Centro-Oeste</option>
                  <option value="Norte">Norte</option>
                  <option value="Nordeste">Nordeste</option>
                </select>
              </div>
            </div>

            <div class="termos">
              <p>Ao clicar em “Enviar” você aceita os <a href="#">Termos de uso</a></p>
            </div>


              <button class="enviar" id="btnEnviarComentario">Enviar</button>

          </div>
        </div>
      `;

      document.body.appendChild(modal);
      modal.style.display = "flex";

      document.getElementById("btnEnviarComentario").addEventListener("click", function(event) {
        event.preventDefault();
        enviarComentario(modal);
      });
    }

    function fecharmodal(botaoFechar) {
      const modal = botaoFechar.closest(".modal");
      if (modal) {
        modal.remove();
      }
    }

async function enviarComentario(modal) {
  const comentario = document.getElementById("comentarioInput").value.trim();
  const classe = document.getElementById("classeGramaticalSelect").value;
  const regiaoNome = document.getElementById("regiaoSelect").value;
  const exemploUso = document.getElementById("exemploUsoInput").value.trim();

  if (!comentario || !classe || !regiaoNome) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const regioesMap = {
    "Nordeste": 1,
    "Sul": 2,
    "Norte": 3,
    "Centro-Oeste": 4,
    "Sudeste": 5
  };

  const regiaoId = regioesMap[regiaoNome];
  if (!regiaoId) {
    alert("Região inválida");
    return;
  }

  const wordId = localStorage.getItem("wordIdSelecionado");
  if (!wordId) {
    alert("Nenhuma palavra selecionada para enviar o comentário.");
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("ID do usuário não encontrado.");
    return;
  }

  const payload = {
    addedBy: Number(userId),
    region: regiaoId,
    description: comentario,
    info: exemploUso,
    type: classe.toLowerCase()
  };

  const url = `http://localhost:3000/meanings/word/${wordId}/meaning/create`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };

  const data = await chamadaApiProtegida(url, options);
  if (data) {
    alert("Comentário enviado com sucesso!");
    if (modal) modal.remove();
    // Aqui você pode atualizar a lista de significados, se quiser
  }
}


function traduzirTipoInglesParaPortugues(tipoIngles) {
  const mapaTipos = {
    noun: "Substantivo",
    verb: "Verbo",
    adjective: "Adjetivo",
    adverb: "Advérbio",
    pronoun: "Pronome",
    preposition: "Preposição",
    conjunction: "Conjunção",
    interjection: "Interjeição",
    article: "Artigo"
  };
    return mapaTipos[tipoIngles] || tipoIngles; // retorna o original se não achar
}

async function enviarInteracao(wordId, meaningId, like, dislike) {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("ID do usuário não encontrado.");
    return null;
  }

  const payload = { userId: Number(userId), like, dislike };

  const url = `http://localhost:3000/interactions/word/${wordId}/meaning/${meaningId}/interaction`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };

  const data = await chamadaApiProtegida(url, options);
  return data;
}




async function buscarInteracaoUsuario(wordId, meaningId) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await fetch(`http://localhost:3000/interactions/word/${wordId}/count/meaning/${meaningId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data; // Exemplo esperado: { like: true, dislike: false }
  } catch (error) {
    console.error("Erro ao buscar interação do usuário:", error);
    return null;
  }
}

async function buscarTotalLikesDislikes(wordId, meaningId) {
  try {
    const response = await fetch(`http://localhost:3000/interactions/word/${wordId}/count/meaning/${meaningId}`);
    if (!response.ok) throw new Error("Erro ao buscar totais");
    return await response.json(); // Deve retornar { total_likes: "3", total_dislikes: "2" }
  } catch (error) {
    console.error(error);
    return { total_likes: 0, total_dislikes: 0 };
  }
}
async function chamadaApiProtegida(url, options = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Você precisa estar logado para acessar esta funcionalidade.');
    window.location.href = './login.html';
    return null;
  }

  // Adiciona o header Authorization no options
  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      const data = await response.json();
      if (data.message.includes('Token expirado') || data.message.includes('Token inválido')) {
        alert('Sua sessão expirou ou o token é inválido. Você será redirecionado para o login.');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login.html';
        return null;
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro na requisição');
    }

    return await response.json();

  } catch (error) {
    alert(error.message);
    return null;
  }
}

function atualizarEstadoBotoes(div, userReaction) {
  const likeBtn = div.querySelector("button.likeimagem");
  const dislikeBtn = div.querySelector("button.dislikeimagem");

  if (!likeBtn || !dislikeBtn) return;

  if (userReaction === "like") {
    likeBtn.classList.add("selecionado");
    dislikeBtn.classList.remove("selecionado");
  } else if (userReaction === "dislike") {
    dislikeBtn.classList.add("selecionado");
    likeBtn.classList.remove("selecionado");
  } else { // "none"
    likeBtn.classList.remove("selecionado");
    dislikeBtn.classList.remove("selecionado");
  }
}
