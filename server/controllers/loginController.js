const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//GET/Home
exports.homepage = async (req, res) => {
        const locals = {
            titulo: "Login - Escribro",
            descricao: "Login and Buscar Sistema"
        }
    
        res.render("index", locals );
    };
//GET/Painel de Controle
exports.painelpage = async (req, res) => {
const locals = {
    title: "Login - Escribro",
    description: "Login e Buscar Sistema",
  };

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const users = await User.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await User.countDocuments({});

    res.render("user/paineldecontrole", {
      locals,
      users,
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  };
};
//POST Login
exports.loginUser = async (req, res) => {
  const {email, senha} = req.body
  //Validação
/*   if(!email) {
      return res.status(422).json({ mensagem: "O E-mail é obrigatório!" })
  }

  if(!senha) {
      return res.status(422).json({ mensagem: "A Senha é obrigatória!" })
  } */

  //Checar se Usuário existe
  const user = await User.findOne({ email: email })
  if(!user) {
  return res.status(401).json({ mensagem: "Usuário e/ou senha inválidos" })
  }
  //Checar Senha
/*   const checkSenha = await bcrypt.compare(senha, user.senha)
  if(!checkSenha) {
      return res.status(401).json({ mensagem: "Usuário e/ou senha inválidos" })
  } */
  try {
      user.ultimo_login = new Date();
//       const secret = process.env.SECRET
//      const token = jwt.sign(
//          {
//              id: user.id,
//          }, secret, { expiresIn: 60 * 60 }
//      )
      res.redirect("/paineldecontrole");
      //res.status(200).json({ mensagem: "Autenticação realizada com sucesso", token})
  } catch (error) {
      console.log(error)
      res
      .status(500)
      .json({
          mensagem: "Erro no Servidor"})
  }

}

//GET/Adicionar Novo Usuário

exports.addAdminpage = async (req, res) => {
    const locals = {
        titulo: "Login - Adicionar Usuário",
        descricao: "Adicionar Novo Usuário"
    }

    res.render("user/addAdmin", locals );
};    
//Post/Adicionar Novo Usuário

exports.postAdmin = async (req, res) => {
    console.log(req.body);
    const {nome, email, senha, ddd, numero} = req.body
    //Validação
    if(!nome) {
        return res.status(422).json({ mensagem: "O Nome é obrigatório!" })
    }

    if(!email) {
        return res.status(422).json({ mensagem: "O E-mail é obrigatório!" })
    }

    if(!senha) {
        return res.status(422).json({ mensagem: "A Senha é obrigatória!" })
    }
    //Checar email
    const userExiste = await User.findOne({ email: email})
    if(userExiste) {
        return res.status(422).json({ mensagem: "E-mail já existente!" })
    }

    // Criar Senha com Criptografia
/*     const salt = await bcrypt.genSalt(12)
    const CryptografiaHash = await bcrypt.hash(senha, salt) */
    const newUser = new User({
        nome,
        email,
        senha,
        ddd,
        numero,
    });
    try {
        await User.create(newUser);
        res.status(201).json({ mensagem: "Usuário Criado com Sucesso"});
    } catch (error) {
        console.log(error);
    }

}; 

// GET Usuário Dados
exports.viewUser = async (req, res) =>{
  try {
    const user = await User.findOne({ _id: req.params.id})
    const locals = {
      titulo: "Login - Exibir Usuário",
      descricao: "Exibir Usuário"
  };
  res.render("users/view", {
    locals,
    user
  })
  } catch (error) {
    console.log(error);
  }
}

// GET Editar Usuário
exports.editUser = async (req, res) =>{
  try {
    const user = await User.findOne({ _id: req.params.id})
    const locals = {
      titulo: "Login - Editar Usuário",
      descricao: "Editar Usuário"
  };
  res.render("users/edit", {
    locals,
    user
  })
  } catch (error) {
    console.log(error);
  }
}

// Delete Deletar Usuário
exports.deleteUser = async (req, res) =>{
  try {
    await User.deleteOne({ _id: req.params.id })
    res.redirect("/paineldecontrole")
  } catch (error) {
    console.log(error);
  }
}
//Atualizar Usuário
exports.editPostUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      nome: req.body.nome,
      email: req.body.email,
      ddd: req.body.ddd,
      numero: req.body.numero,
      data_atualizacao: Date.now(),
    });
    await res.redirect(`/edit/${req.params.id}`);
    console.log("redirected");
  } catch (error) {
    console.log(error);
  }
};

// GET Buscar Usuário
exports.searchUser = async (req, res) =>{
    const locals = {
    title: "Buscar DataBase",
    description: "Login - Buscar DataBase",
  };
   try {
    let buscarTerm = req.body.buscarTerm;
    const buscarNoSpecialChar = buscarTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    const users = await User.find({
      $or: [
        { nome: { $regex: new RegExp(buscarNoSpecialChar, "i") } },
        { email: { $regex: new RegExp(buscarNoSpecialChar, "i") } },
      ]
    });
    res.render("buscar", {
      users,
      locals
    });
  } catch (error) {
    console.log(error);
  }
}