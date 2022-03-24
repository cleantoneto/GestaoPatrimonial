const router = require("express").Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");

const Patrimony = require("../models/patrimony")
const User = require("../models/user");


//salvando as fotos
const diskStorage = require('../helpers/file-storage');
const upload = multer({ storage: diskStorage })

//middlewares
const verifyToken = require("../helpers/check-token");

//helpers
const getUserByToken = require("../helpers/get-user-by-token");


//criando patrimonios

router.post("/", verifyToken, upload.fields([{name: "photos"}]), async (req, res) => {

    //pegar os dados da requisição
  const title = req.body.title;
  const description = req.body.description;
  const patrimonyDate = req.body.patrimony_date;
  const patrimonyCode = req.body.patrimony_code;
  const locations = req.body.locations;

  let files = [];

  if(req.files) {
    files = req.files.photos;
  }

  //validações
  if(title == "null" || description == "null" || patrimonyDate == "null" || patrimonyCode == "null" || locations == "null") {
    return res.status(400).json({ error: "Preencha pelo menos nome, descrição, data, numero de patrimonio e localização." });
  }

  //verificando usuário

  const token = req.header("auth-token");

  const userByToken = await getUserByToken(token);
  
  const userId = userByToken._id.toString(); 

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.status(400).json({ error: "O usuário não existe!" });
  }

  // criando a lista de fotos

  let photos = [];

  if(files && files.length > 0) {    

    files.forEach((photo, i) => {
      photos[i] = photo.path;
    });

  }

  const patrimony = new Patrimony({
    title: title,
    description: description,
    patrimonyDate: patrimonyDate,
    patrimonyCode: patrimonyCode,
    locations: locations,
    photos: photos,
    privacy: req.body.privacy,
    userId: user._id.toString()
  });

  try {      

    const newPatrimony = await patrimony.save();
    res.json({ error: null, msg: "Patrimônio criado com sucesso!", data: newPatrimony });

} catch (error) {

    res.status(400).json({ error })
    
}
    
});


//ler todas os patrimonios publicos

router.get("/all", async (req, res) => {

    try {      
  
      const patrimonies = await Patrimony.find({ privacy: false }).sort([['_id', -1]]);
      res.json({ error: null, patrimonies: patrimonies });
  
    } catch (error) {
  
      res.status(400).json({ error })
        
    }
  
  });


 // ler todos os patrimônios do usuário

 router.get("/userpatrimonies", verifyToken, async function (req, res)  {

    try {      
  
      const token = req.header("auth-token");
  
      const user = await getUserByToken(token);
      
      const userId = user._id.toString();
  
      const patrimonies = await Patrimony.find({ userId: userId });
      res.json({ error: null, patrimonies: patrimonies });
  
    } catch (error) {
  
      res.status(400).json({ error })
        
    }
  
  });



  //encontrar o patrimonio pelo id do user
  router.get("/userpatrimony/:id", verifyToken, async function (req, res) {

    try {      
  
      const token = req.header("auth-token");
  
      const user = await getUserByToken(token);
      
      const userId = user._id.toString();
      const patrimonyId = req.params.id;
  
      const patrimony = await Patrimony.findOne({ _id: patrimonyId, userId: userId });
  
      console.log(patrimony)
  
      res.json({ error: null, patrimony: patrimony });
  
    } catch (error) {
  
      res.status(400).json({ error })
        
    }
  
  });


  router.get("/:id", async (req, res) => {

    // encontrando patrimonio sem login

    try{
        const id = req.params.id;
  
        const patrimony = await Patrimony.findOne({ _id: id });

        // caso o patrimonio seja público...
        if(patrimony.privacy === false) {

            res.json({ error: null, patrimony: patrimony });


        // caso o patrimonio seja privado
        } else{

            const token = req.header("auth-token");

            const user = await getUserByToken(token);
            
            const userId = user._id.toString();
            const patrimonyUserId = patrimony.userId.toString();
        
            // checar o acesso
            if(userId == patrimonyUserId) {
              res.json({ error: null, patrimony: patrimony });
            } else {
              res.status(401).json({ error: "Acesso negado!" });
            }

        }
  
    }catch(error) {
        return res.status(400).json({msg:"Patrimônio não existe"})
    }
});

// Deletando Patrimônio ------- IMPLEMENTADO MAS NÃO UTILIZADO

router.delete("/", verifyToken, async (req, res) => {

    const token = req.header("auth-token");
    const user = await getUserByToken(token);
    const patrimonyId = req.body.id;
    const userId = user._id.toString();
  
    try {      
  
      await Patrimony.deleteOne({ _id: patrimonyId, userId: userId });
      res.json({ error: null, msg: "Evento removido com sucesso!" });
  
    } catch (error) {
  
      res.status(400).json({ error })
        
    }
  
  });


// atualizando o patrimônio

router.patch("/", verifyToken, upload.fields([{name: "photos"}]), async (req, res) => {

    const title = req.body.title;
    const description = req.body.description;
    const patrimonyDate = req.body.patrimony_date;
    const patrimonyCode = req.body.patrimony_code;
    const locations = req.body.locations;
    const patrimonyId = req.body.id;
    const patrimonyUserId = req.body.user_id;

    let files = [];

  if(req.files) {
    files = req.files.photos;
  }

  // validações
  if(patrimonyDate == "null" || locations == "null") {
    return res.status(400).json({ error: "Preencha pelo menos nome, descrição, data, numero de patrimonio e localização." });
  }

  //verificar usuário

  const token = req.header("auth-token");

  const userByToken = await getUserByToken(token);
  
  const userId = userByToken._id.toString(); 

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.status(400).json({ error: "O usuário não existe!" });
  }

// construindoo objeto
  const patrimony = {
    id: patrimonyId,
    title: title,
    description: description,
    patrimonyDate: patrimonyDate,
    patrimonyCode: patrimonyCode,
    locations: locations,
    privacy: req.body.privacy,
    userId: patrimonyUserId
  };

  // construindo array de fotos
  let photos = [];

  if(files && files.length > 0) {    

    files.forEach((photo, i) => {
      photos[i] = photo.path;
    });

    patrimony.photos = photos;

  }

  try {      

    // returns updated dat
    const updatedPatrimony = await Patrimony.updateOne({ _id: patrimonyId, userId: patrimonyUserId }, {$push:{patrimonyDate:patrimonyDate, locations:locations}, $set:{privacy:req.body.privacy}}) 
    
    res.json({ error: null, msg: "Patrimônio atualizado com sucesso!", data: updatedPatrimony}); 

  } catch (error) {

    res.status(400).json({ error })
      
  }

});

module.exports = router;