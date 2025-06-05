
// Funções de botões

function telaLogin(){
    window.location.href = "login.html"
}

function olhoAtual() {
const olho = document.getElementById("olho");

    if (olho.src.includes("olhofechado.png")) {
        olho.src = "./assets/olho.png";
        mudarVisibilidade();
    } else {
        olho.src = "./assets/olhofechado.png";
        mudarVisibilidade();
    }  
}

function olhoAtual1(){
    const olho1 = document.getElementById("olho1"); 

    if (olho1.src.includes("olhofechado.png")){
    olho1.src = "./assets/olho.png";
    mudarVisibilidade1();
    } else {
    olho1.src = "./assets/olhofechado.png";
    mudarVisibilidade1();
    }
}



function mudarVisibilidade(){
    const senha = document.getElementById("inputsenha")
    if (senha.type === "password") {
    senha.type = "text";
} else {
    senha.type = "password";      
}
}

function mudarVisibilidade1(){
    const confirmarSenha = document.getElementById("inputconfirmarsenha");
    if(confirmarSenha.type === "password"){
        confirmarSenha.type = "text"; // Torna a senha visível
    }
    else{
    confirmarSenha.type = "password";
    }
}

function paginaRegistro(){
    window.location.href = "Registro.html";
}


// Requisição do banco de dados *================================================================*

const url = "http://localhost:3000/users/user/login"

const form = document.querySelector("#form");
const inputEmail = document.querySelector("#inputemail");
const inputSenha = document.querySelector("#inputsenha");

async function fazerLogin(event) {
event.preventDefault();

const email = inputEmail.value.trim();
const senha = inputSenha.value;

if (!email || !senha) {
    alert("Por favor, preencha todos os campos.");
    return;
}

const dados = {
    email: email,
    password: senha
};

try {
    const resposta = await fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(erro || `Erro ao logar: ${resposta.status}`);
    }

    const resultado = await resposta.json();

    alert(resultado.message);

    localStorage.setItem("token", resultado.token);
    localStorage.setItem("userId", resultado.userId);
    localStorage.setItem("name", resultado.name);
    console.log("ID salvo:", resultado.userId);


    // Redireciona para a página inicial
    window.location.href = "Index.html";

} catch (erro) {
    console.error("Erro no login:", erro.message);
    alert("Erro ao fazer login: " + erro.message);
}
}

form.addEventListener("submit", fazerLogin);