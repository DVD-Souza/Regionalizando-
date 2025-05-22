
// Funções de botões de navegação

function mostrarMensagem() {
    alert("Em Breve");
}

function telaLogin(){
    window.location.href = "login.html";
}

function telaSignificado() {
    window.location.href = "significado.html";
}

function telaPerfil(){
    window.location.href = "perfil.html";
}
function telaAdicionar(){
    window.location.href = "adicionar.html";
}
function telaIndex(){
    window.location.href = "Index.html";
}

// Requisição do banco de dados *================================================================*


let contadorSignificados = 6; // Já existem 6 no HTML

// Função que preenche os botões com dados do backend
function preencherSignificado() {
    fetch("http://localhost:3000/words/word")
        .then(response => {
            if (!response.ok) throw new Error("Erro na requisição");
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data.data) && data.data.length > 0) {
                for (let i = 0; i < data.data.length; i++) {
                    const item = data.data[i];
                    const btn = document.getElementById(`btnSignificado${i + 1}`);
                    if (btn) {
                        btn.textContent = item?.name || "Sem nome";
                    }
                }
            }
        })
        .catch(error => {
            console.error("Erro ao buscar os nomes:", error);
        });
}

// Ao carregar a página
window.onload = function () {
    telaSignificado();
};

// Ao clicar no botão Ver mais
document.getElementById("btnVerMais").addEventListener("click", function () {
    const container = document.getElementById("containerSignificados");

    for (let i = 0; i < 6; i++) {
        contadorSignificados++;

        const corClasse = contadorSignificados % 2 === 0 ? "bc-terciary" : "bc-secondary";

        const div = document.createElement("div");
        div.className = `palavra ${corClasse}`;
        div.innerHTML = `
            <button id="btnSignificado${contadorSignificados}" class="nomesignificado" onclick="telaSignificado()"> </button>
            <p class="tiposignificado">"Tipo Significado"</p>
            <p class="descricaosignificado">"Descrição significado"</p>
            <p> Significado de "Palavra" por 
                <button class="nomeusuario" onclick="telaPerfil()">"Usuário"</button> em "Data"
            </p>
            <div class="likedislike">
                <button class="likeimagem">
                    <img src="./assets/Like.png" alt="Imagem Like">
                    <p>"Likes"</p>
                </button>
                <button class="dislikeimagem">
                    <img src="./assets/Dislike.png" alt="Imagem Dislike">
                    <p>"Dislikes"</p>
                </button>
            </div>
            <p class="regiaonome">"Região"</p>
        `;

        container.appendChild(div);
    }

    // Preenche os novos botões com dados
    preencherSignificados();
});


// Rodar automaticamente ao abrir a página
window.onload = preencherSignificado;


