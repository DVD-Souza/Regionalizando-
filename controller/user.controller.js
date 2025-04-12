//Importa a classe User.
const User = require('../model/User');
const jwt = require('jsonwebtoken');

//Função do controller que permite chamar o método da classe User para cria um objeto no banco de dados.
const create = async (req, res) =>{
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
const update = async (req, res) =>{
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
const remove = async (req, res) =>{
    try {
        await User.delete(req.params.id);
        res.send('Usuário excluído com sucesso.')
    } catch (error) {
        res.status(500).send('Erro interno do servidor.')
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca o usuário pelo email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }

        // Verifica se a senha está correta
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Senha inválida.');
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload
            process.env.JWT_SECRET, // Chave secreta
            { expiresIn: process.env.JWT_EXPIRES } // Expiração do token
        );

        // Retorna o token ao cliente
        res.status(200).json({ message: 'Login realizado com sucesso.', token });
    } catch (error) {
        res.status(500).send('Erro interno do servidor.');
    }
};

const findByName = async (req, res) => {
    try {
        const { name } = req.params; // Captura o parâmetro de nome da rota
        const users = await User.findByName(name);

        if (users.length === 0) {
            return res.status(404).send('Nenhum usuário encontrado com esse nome.');
        }

        res.status(200).json(users); // Retorna os usuários encontrados em formato JSON
    } catch (error) {
        res.status(500).send('Erro interno do servidor.');
    }
};
//Exporta os metodos(funções) do controller para ser usados por outras classes/roteadores.
module.exports = {create, update, remove, login, findByName};