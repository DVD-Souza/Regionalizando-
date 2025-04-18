class Significado {
    constructor(id, id_regiao, id_elemento, descricao, infor_adicionais, tipo) {
      this.id = id;
      this.id_regiao = id_regiao;
      this.id_elemento = id_elemento;
      this.descricao = descricao;
      this.infor_adicionais = infor_adicionais;
      this.tipo = tipo || 'vazio';
    }
  }
  
  module.exports = Significado;
  