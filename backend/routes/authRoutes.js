const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/register", async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;


    // Checando os campos preenchidos
    if(name == null || email == null || password == null || confirmpassword == null) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos." });
    }

    // validação da senha
    if(password != confirmpassword) {
        return res.status(400).json({ error: "As senhas não conferem." });
    }

     // Verificar se o email está em uso ----------- TESTAR DEPOIS -------------------------------------------------------------------
     const isEmailExists = await User.findOne({ email: req.body.email });

     if (isEmailExists) {
         return res.status(400).json({ error: "O e-mail informado já está em uso." });
     }

      // Criando a senha
      const salt = await bcrypt.genSalt(12);
      const reqPassword = req.body.password;
      const passwordHash = await bcrypt.hash(reqPassword, salt);


      // Persistindo o usuário
      const user = new User({
        name: name,
        email: email,
        password: passwordHash
    });

    try {      

        const newUser = await user.save();

        // create token
        const token = jwt.sign(
            // payload data
            {
            name: newUser.name,
            id: newUser._id,
            },
            "nossosecret"
        );
        
        // return token
        res.json({ error: null, msg: "Você realizou o cadastro com sucesso!", token: token, userId: newUser._id });

    } catch (error) {

        res.status(400).json({ error })
        
    }




});

// login 

router.post("/login", async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    // checando se o email foi cadastrado
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(400).json({ error: "Não há usuário cadastrado com este e-mail!" });
    }

    // checando a senha
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(400).json({ error: "Senha inválida" });
    }

     // gerando o tolen
     const token = jwt.sign(
        
        {
        name: user.name,
        id: user._id,
        },
        "nossosecret"
    );

    // return token
    res.json({ error: null, msg: "Você está logado!", token: token, userId: user._id });

});

module.exports = router;

