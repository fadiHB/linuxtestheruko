require('dotenv').config();

const express = require('express');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT;
const pg = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);


app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));



app.get('/',renderHome);
app.post('/fav',addtoDB);
app.get('/fav',renderFav);

function Digimon (data) {
    this.name = data.name,
    this.img = data.img,
    this.level = data.level
}


function renderHome (req,res) {
    const url = 'https://digimon-api.herokuapp.com/api/digimon'
    superagent.get(url).then( data => {
        let array = data.body.map( obj => {
            return new Digimon(obj)
        })
        res.render('home',{result:array})
    })
}


function renderFav (req,res) {
    const sqlGet = 'select * from exam301;';
    console.log('11111');
    client.query(sqlGet).then( data => {
        console.log('22222222');
        if (data.rows === 0) {
            res.send (' no data was added yet ..')
        }
        else {
            res.render('fav',{result:data.rows})
        }
    })
}



function addtoDB (req,res) {
    console.log('hiiiiiiiiiiii');
    const {name,img,level} = req.body;
    console.log(name,img,level);
    const sqlInsert = 'insert into exam301 (name,img,level) values ($1,$2,$3);';
    console.log('after the sqlInsert');
    const safeValue = [name,img,level]
    client.query(sqlInsert,safeValue).then ( ()=> {
        console.log('insode the client.query');
        res.redirect('/fav');
    } ).catch((error) => console.log('error in  addtoDB',error));
}


client.connect().then( () => {
    app.listen( PORT, ()=> {
        console.log('connected to port:' + PORT);
    } )
})