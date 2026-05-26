document.addEventListener('DOMContentLoaded', () => {
  // Redireciona para login se não estiver logado
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); // id salvo no login
  if (!token || !userId) {
    window.location.href = 'login.html';
    return;
  }

  const form = document.getElementById('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('inputnome').value.trim();
    const email = document.getElementById('inputemail').value.trim();
    const senha = document.getElementById('inputsenha').value.trim();

    if (!nome && !email && !senha) {
      alert('Por favor, preencha pelo menos um dos campos antes de enviar.');
      return;
    }

    const confirmar = confirm('Você tem certeza que deseja atualizar seus dados?');
    if (!confirmar) return;

    // Monta dados só com campos preenchidos
    const dados = {};
    if (nome) dados.name = nome;
    if (email) dados.email = email;
    if (senha) dados.password = senha;

    try {
      const response = await fetch(`http://localhost:3000/users/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });

      if (response.status === 401 || response.status === 403) {
        // Token inválido ou usuário não autorizado
        alert('Sua sessão expirou ou você não tem permissão. Faça login novamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = 'login.html';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert('Erro: ' + (errorData.message || 'Não foi possível atualizar os dados.'));
        return;
      }

      alert('Dados atualizados com sucesso!');
      localStorage.removeItem('token'); // expira token após atualizar dados
      localStorage.removeItem('userId');
      window.location.href = 'login.html';

    } catch (error) {
      alert('Erro ao atualizar os dados. Tente novamente mais tarde.');
      console.error(error);
    }
  });
});

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

function mudarVisibilidade(){
    const senha = document.getElementById("inputsenha")
    if (senha.type === "password") {
    senha.type = "text";
} else {
    senha.type = "password";      
}
}