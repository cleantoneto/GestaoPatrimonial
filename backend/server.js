// modules ------------------------------------------------------------------------------------------------------------------------------------------------------
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

//rotas ------------------------------------------------------------------------------------------------------------------------------------------------------
const authRouter = require("./routes/authRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const patrimonyRouter = require("./routes/patrimonyRoutes.js");

//middlewares ------------------------------------------------------------------------------------------------------------------------------------------------------



//config
const dbName = "gstPatrimonio"; // NOME DO BANCO 
const port = 3000;

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.static('public'));

app.use("/api/auth", authRouter); 
app.use("/api/user", userRouter); 
app.use("/api/patrimony", patrimonyRouter); 

//conexão com o mongoDB ------------------------------------------------------------------------------------------------------------------------------------------------------

mongoose.connect(
    `mongodb://localhost/${dbName}`,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  );


  //TESTES


app.get("/", (req, res) => {

    res.json({ message: "Rota Teste"});

});

app.listen(port, () =>{

    console.log(`O backend tá rodando na porta ${port}`)

});