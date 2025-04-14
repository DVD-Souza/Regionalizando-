// Define a classe UpdateLog para registrar mudanças em qualquer campo de uma palavra
class UpdateLog {
    constructor(id, palavraId, fieldUpdated, oldValue, newValue, updatedBy, updatedAt) {
      this.id = id;                   // ID do log de atualização
      this.palavraId = palavraId;     // ID da palavra que foi modificada
      this.fieldUpdated = fieldUpdated; // Nome do campo que foi alterado (ex: 'meaning')
      this.oldValue = oldValue;       // Valor antigo do campo
      this.newValue = newValue;       // Novo valor do campo
      this.updatedBy = updatedBy;     // ID do usuário que fez a atualização
      this.updatedAt = updatedAt || new Date(); // Data da atualização
    }
  }
  
  // Exporta a classe
  module.exports = UpdateLog;
  