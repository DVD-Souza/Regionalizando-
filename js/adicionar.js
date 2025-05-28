document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAdicionar");
  const loading = document.getElementById("loading");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Captura os valores dos campos
    const palavraInput = document.getElementById("termo");
    const significadoInput = document.getElementById("significado");
    const infoInput = document.getElementById("info");
    const tipoSelect = document.getElementById("tipo");
    const regiaoSelect = document.getElementById("regiao");

    // Limpa bordas de erro
    [palavraInput, significadoInput, tipoSelect, regiaoSelect].forEach(el => {
      el.style.border = "";
    });

    // Validação dos campos obrigatórios
    let valido = true;

    if (!palavraInput.value.trim()) {
      palavraInput.style.border = "2px solid red";
      valido = false;
    }

    if (!significadoInput.value.trim()) {
      significadoInput.style.border = "2px solid red";
      valido = false;
    }

    if (tipoSelect.value === "Vazio") {
      tipoSelect.style.border = "2px solid red";
      valido = false;
    }

    if (regiaoSelect.value === "Vazio") {
      regiaoSelect.style.border = "2px solid red";
      valido = false;
    }

    if (!valido) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Mostra loading
    loading.style.display = "block";

    // Mapeamento da região para id numérico
    const regioes = {
      "Nordeste": 1,
      "Sul": 2,
      "Norte": 3,
      "Centro-Oeste": 4,
      "Sudeste": 5
    };

    // Mapeamento para tipo em inglês (enum)
    const tipos = {
      "Substantivo": "noun",
      "Adjetivo": "adjective",
      "Artigo": "article",
      "Pronome": "pronoun",
      "Numeral": "numeral",
      "Verbo": "verb",
      "Advérbio": "adverb",
      "Preposição": "preposition",
      "Conjunção": "conjunction",
      "Interjeição": "interjection"
    };

    // Dados a enviar
    const dados = {
      word: palavraInput.value.trim(),
      description: significadoInput.value.trim(),
      info: infoInput.value.trim(),
      type: tipos[tipoSelect.value],
      region: regioes[regiaoSelect.value]
    };

    // Pega o token do localStorage
    const token = localStorage.getItem("token");

    try {
      const resposta = await fetch("http://localhost:3000/words/word/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });

      loading.style.display = "none";

      if (resposta.ok) {
        alert("✅ Palavra adicionada com sucesso!");
        form.reset();
      } else if (resposta.status === 409) {
        // Palavra duplicada
        alert("❌ Essa palavra já existe no banco de dados.");
      } else {
        const erro = await resposta.json();
        alert("❌ Erro ao adicionar palavra: " + (erro.message || "Erro desconhecido"));
      }
    } catch (erro) {
      loading.style.display = "none";
      alert("❌ Falha ao conectar com o servidor.");
      console.error(erro);
    }
  });
});
