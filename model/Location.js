// Define a classe Location para representar uma localidade (estado e região)
class Location {
    // Construtor com os campos que representam uma localidade
    constructor(id, region, state, createdAt) {
      this.id = id;                 // Identificador único da localidade
      this.region = region;         // Nome da região (ex: Nordeste)
      this.state = state;           // Nome do estado (ex: Bahia)
      this.createdAt = createdAt || new Date(); // Data de criação
    }
  }
  
  // Exporta a classe para uso externo
  module.exports = Location;
  