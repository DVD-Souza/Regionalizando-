
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

// Requisição do banco de dados *================================================================*

const url = "http://localhost:3000/users/signup"

const form = document.querySelector("#form");
  const inputNome = document.querySelector("#inputuser");
  const inputEmail = document.querySelector("#inputemail");
  const inputSenha = document.querySelector("#inputsenha");
  const inputConfirmarSenha = document.querySelector("#inputconfirmarsenha");

  async function registrarUsuario(event) {
    event.preventDefault();

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const senha = inputSenha.value;
    const confirmarSenha = inputConfirmarSenha.value;

    // Verificações básicas
    if (!nome || !email || !senha || !confirmarSenha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    const dados = {
      name: nome,
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
        throw new Error(erro || `Erro ao cadastrar: ${resposta.status}`);
      }

      const resultado = await resposta.text(); 

      alert(resultado);
      
      window.location.href = "login.html";

    } catch (erro) {
      console.error("Erro no cadastro:", erro.message);
      alert("Erro ao cadastrar: " + erro.message);
    }
  }

  form.addEventListener("submit", registrarUsuario);
