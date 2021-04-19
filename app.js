const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const db = require("./db/connection");
const bodyParser = require("body-parser");
const path = require("path");
const Job = require("./models/Job");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const PORT = 3000;

app.listen(PORT, function () {
    console.log(`O express está rodando na porta ${PORT}`)
})

//body parser
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "public")));

//handlebars
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//banco de dados
db
    .authenticate()
    .then(() => {
        console.log("Conectado!");
    })
    .catch(err => {
        console.log("Erro ao ser conectado!");
    });



//routes
app.get("/", (req, res) => {
    let search = req.query.job;
    let query = "%" + search + "%";

    if (!search) {
        Job.findAll({
            order: [
                ["createdAt", "DESC"]
            ]
        })
            .then(jobs => {
                res.render("index", {
                    jobs
                });
            })
            .catch(err => console.log(err));
    } else {
        Job.findAll({
            where: { title: { [Op.like]: query } },
            order: [
                ["createdAt", "DESC"]
            ]
        })
            .then(jobs => {
                res.render("index", {
                    jobs, search
                });
            })
            .catch(err => console.log(err));
    }
});



//jobs routes
app.use("/jobs", require("./routes/jobs"));