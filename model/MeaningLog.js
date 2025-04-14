// Define a classe MeaningLog para registrar mudanças de significado de palavras
class MeaningLog {
    constructor(id, palavraId, previousMeaning, newMeaning, changedBy, changedAt) {
      this.id = id;                         // ID do log
      this.palavraId = palavraId;           // ID da palavra cujo significado foi alterado
      this.previousMeaning = previousMeaning; // Significado antigo
      this.newMeaning = newMeaning;         // Novo significado
      this.changedBy = changedBy;           // ID do usuário que fez a alteração
      this.changedAt = changedAt || new Date(); // Data da alteração
    }
  }
  
  // Exporta a classe
  module.exports = MeaningLog;
  