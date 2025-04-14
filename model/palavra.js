// Classe que representa uma Palavra no sistema
class Palavra {
    // Construtor que define as propriedades da palavra
    constructor(id, word, meaning, region, addedBy, createdAt) {
      this.id = id; // ID da palavra no banco
      this.word = word; // Palavra em si
      this.meaning = meaning; // Significado da palavra
      this.region = region; // Região associada
      this.addedBy = addedBy; // ID do usuário que adicionou
      this.createdAt = createdAt || new Date(); // Data de criação (ou atual se não fornecida)
    }
  }
  
  module.exports = Palavra; // Exporta a classe para ser usada nos controllers
  