//Importa a classe User.
const User = require('../model/User');

//Função do controller que permite chamar o método da classe User para cria um objeto no banco de dados.
const criar = async (req, res) =>{
    try{
        const {name, email, password} = req.body;
        const newuser = new User(null, name, email, password);
        await User.create(newuser);
        res.status(201).send("Usuário cadastrado com sucesso.");
    } catch(error){
        res.status(500).send("Erro interno do servidor.");
    }
};

//Função do controller para chamar o método da classe User para atualiza um objeto no banco de dados.
const atualizar = async (req, res) =>{
    try{
        const {name, email, password} = req.body;
        const user = {name, email, password};
        await User.update(req.params.id, user);
        res.send('Usuário atualizado com sucesso.');
    } catch(error){
        res.status(500).send('Erro interno do servidor.')
    }
};

//Função do controller para chamar o método da classe User para excluir um objeto no banco de dados.
const remover = async (req, res) =>{
    try {
        await User.delete(req.params.id);
        res.send('Usuário excluído com sucesso.')
    } catch (error) {
        res.status(500).send('Erro interno do servidor.')
    }
};

//O codigo abaixo segue em construção, manutenção ou correção.
login(req, res)
buscarPorId(req, res)


//Exporta os metodos(funções) do controller para ser usados por outras classes/roteadores.
module.exports = {criar, atualizar, remover};