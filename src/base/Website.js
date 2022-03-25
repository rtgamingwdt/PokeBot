const app = require('express')();
const { getRandomPokemon } = require('./Database');
const Database = require("./Database");

module.exports = class Website {

    constructor() {

    }

    async build() {
        await this.listen();
    }

    async listen() {

        // app.get("/api/pokemon?tag", (req, res) => {

        // });

        app.get("/api/pokemon", (req, res) => {
            let pokemon = Database.getRandomPokemon();

            if (!pokemon) {
                pokemon = Database.getPokemon("000");
            }
            res.send(pokemon);
        });

        app.get('/api/pokemon/:search', (req, res) => {
            let pokemon = Database.getPokemon(req.params.search.charAt(0).toUpperCase() + req.params.search.slice(1));

            if (!pokemon) {
                pokemon = Database.getPokemon("000");
            }
            res.send(pokemon);
        });


        app.listen(3000)
    }
}