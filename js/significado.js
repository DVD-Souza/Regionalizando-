

function mostrarMensagem() {
    alert("Você clicou no botão!");
}
function telaLogin() {
    window.location.href = "login.html";
}

function fecharModal() {
    modal.style.display = 'none';
}

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



window.onload = function () {
    const wordId = localStorage.getItem("wordIdSelecionado");
  if (wordId) {
    console.log("ID da palavra recebido:", wordId);
    // Aqui você pode usar esse wordId para buscar os dados no backend e mostrar na tela
  } else {
    console.warn("Nenhum ID de palavra foi recebido.");
  }

    const botoes = document.querySelectorAll('.nomesignificado');
    const total = botoes.length;

    botoes.forEach((botao, index) => {
        botao.textContent = `${index + 1}. Nome Significado`;
    });

    var modal = document.getElementById("myModal");
    var btn = document.getElementById("openModalBtn");
    var span = document.getElementsByClassName("close")[0];

    // Verifica se os elementos existem antes de usar
    if (btn) {
        btn.onclick = function () {
            modal.style.display = "block";
        };
    }

    if (span) {
        span.onclick = function () {
            modal.style.display = "none";
        };
    }

    if (modal) {
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }
};

// =====================================================================================================

const contadorInicial = 6; // já carrega 6
let contadorSignificados = contadorInicial;

async function criarDivSignificado(item) {
    const container = document.getElementById("containerSignificados");

    // Exemplo de dados retornados (ajuste conforme sua API)
    const likes = item.likes || 0;
    const dislikes = item.dislikes || 0;
    const tipo = item.type || "Tipo Significado";
    const descricao = item.description || "Descrição significado";
    const palavra = item.word || "Palavra";
    const usuario = item.name || "Usuário";
    const data = item.date || "Data";
    const regiao = item.region || "Região";

    // Alternar classes para estilo (palavra, palavra1)
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
                <img src="/assets/Like.png" alt="Imagem Like">
                <p>${likes}</p>
            </button>
            <button class="dislikeimagem">
                <img src="/assets/Dislike.png" alt="Imagem Dislike">
                <p>${dislikes}</p>
            </button>
        </div>
        <p class="regiaonome">${regiao}</p>
    `;

    container.appendChild(div);
    contadorSignificados++;
}

// Evento botão Ver Mais
document.getElementById("btnVerMais").addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:3000/words/word");
        if (!response.ok) throw new Error("Erro na requisição");
        const data = await response.json();

        // Pega próximos 6 significados a partir do contador
        const proximosSignificados = data.data.slice(contadorSignificados, contadorSignificados + 6);

        if (proximosSignificados.length === 0) {
            alert("Não há mais significados para mostrar.");
            return;
        }

        for (const item of proximosSignificados) {
            // Pode buscar likes/dislikes e outras infos aqui se não vierem direto do endpoint
            await criarDivSignificado(item);
        }
    } catch (error) {
        console.error("Erro ao carregar mais significados:", error);
    }
});
