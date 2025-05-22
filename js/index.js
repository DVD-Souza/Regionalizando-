// ======= Variável do usuário logado (ajuste conforme seu sistema) =======
const userIdAtual = 2;
// const token = localStorage.getItem("token");
// fetch("http://localhost:3000/rota-protegida", {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//     "authorization": token
//   }
// });


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
        const response = await fetch(`http://localhost:3000/interactions/word/${wordId}/meaning/${meaningId}/interaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userIdAtual, like, dislike })
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

    const interacoes = await buscarLikesDislikes(item.element_id, significado.meaning_id);

    const corClasse = contadorSignificados % 2 === 0 ? "bc-terciary" : "bc-secondary";

    const div = document.createElement("div");
    div.className = `palavra ${corClasse}`;

    div.setAttribute("data-word-id", item.element_id);
    div.setAttribute("data-meaning-id", significado.meaning_id);

    div.innerHTML = `
        <button id="btnSignificado${contadorSignificados}" class="nomesignificado" onclick="telaSignificado()">
            ${item.word || "Sem palavra"}
        </button>
        <p class="tiposignificado">${significado.type || "Tipo Significado"}</p>
        <p class="descricaosignificado">${significado.description || "Descrição significado"}</p>
        <p> Significado de "${item.word}" por 
            <button class="nomeusuario" onclick="telaPerfil()">${item.name || "Usuário"}</button>.
        </p>
        <div class="likedislike">
            <button class="likeimagem">
                <img src="./assets/Like.png" alt="Imagem Like">
                <p>${interacoes.total_likes || 0}</p>
            </button>
            <button class="dislikeimagem">
                <img src="./assets/Dislike.png" alt="Imagem Dislike">
                <p>${interacoes.total_dislikes || 0}</p>
            </button>
        </div>
        <p class="regiaonome">"Região"</p>
    `;

    // Eventos para like/dislike
    const btnLike = div.querySelector(".likeimagem");
    const btnDislike = div.querySelector(".dislikeimagem");

    btnLike.addEventListener("click", async () => {
        await enviarInteracao(item.element_id, significado.meaning_id, 1, 0);
        const interacoesAtualizadas = await buscarLikesDislikes(item.element_id, significado.meaning_id);
        atualizarLikesDislikes(div, interacoesAtualizadas.total_likes, interacoesAtualizadas.total_dislikes);
    });

    btnDislike.addEventListener("click", async () => {
        await enviarInteracao(item.element_id, significado.meaning_id, 0, 1);
        const interacoesAtualizadas = await buscarLikesDislikes(item.element_id, significado.meaning_id);
        atualizarLikesDislikes(div, interacoesAtualizadas.total_likes, interacoesAtualizadas.total_dislikes);
    });

    container.appendChild(div);
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
            contadorSignificados++;
            await criarDivPalavra(item, significado);
        }
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
            contadorSignificados++;
            await criarDivPalavra(item, significado);
        }
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

function abrirSignificado(elemento) {
    const wordId = elemento.getAttribute("data-word-id");
    localStorage.setItem("wordIdSelecionado", wordId);
    window.location.href = "significado.html"; // nome da página de destino
}
