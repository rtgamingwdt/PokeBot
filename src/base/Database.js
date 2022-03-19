const { get } = require("axios");
const GuildModel = require("../model/GuildModel");
const UserModel = require("../model/UserModel");

module.exports = class Database {
  static async getUserData(id) {
    const data = await UserModel.findOne({
      UserID: id,
    });
    return data;
  }

  static async getGuildData(id) {
    const data = await GuildModel.findOne({
      GuildID: id,
    });
    return data;
  }

  static async getPokespawnChannel(id) {
    const data = await this.getGuildData(id);
    return data.channel;
  }

  static async getPokemonData() {
    const { data } = await get(
      "https://pokeapi.co/api/v2/pokemon?limit=999999999999999&offset=0"
    );
    return data;
  }

  static async getPokemon(name) {
    const data = await get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    return data;
  }

  static async getRandomPokemon() {
    const data = await this.getPokemonData();
    const count = data.results.length;
    const index = Math.floor(Math.random() * (count - 1));
    const { name } = data.results[index];

    const data2 = await this.getPokemon(name);

    return data2;
  }

  static async givePokemon(id, name) {
    const { data } = await this.getPokemon(name);
    await UserModel.findOneAndUpdate(
      {
        UserID: id,
      },
      {
        $push: {
          pokemon: {
            name: name,
            stats: {
              health: {
                current: data.stats[0].base_stat,
                max: data.stats[0].base_stat,
              },
              attack: {
                current: data.stats[1].base_stat,
                max: data.stats[1].base_stat,
              },
              defense: {
                current: data.stats[2].base_stat,
                max: data.stats[2].base_stat,
              },
              specialAttack: {
                current: data.stats[3].base_stat,
                max: data.stats[3].base_stat,
              },
              specialDefense: {
                current: data.stats[4].base_stat,
                max: data.stats[4].base_stat,
              },
              speed: {
                current: data.stats[5].base_stat,
                max: data.stats[5].base_stat,
              },
            },
          },
        },
      }
    );
  }

  static async takePokemon(id, name) {
    const { data } = await this.getPokemon(name);
    await UserModel.findOneAndUpdate(
      {
        UserID: id,
      },
      {
        $pull: {
          pokemon: {
            name: name,
            stats: {
              health: {
                current: data.stats[0].base_stat,
                max: data.stats[0].base_stat,
              },
              attack: {
                current: data.stats[1].base_stat,
                max: data.stats[1].base_stat,
              },
              defense: {
                current: data.stats[2].base_stat,
                max: data.stats[2].base_stat,
              },
              specialAttack: {
                current: data.stats[3].base_stat,
                max: data.stats[3].base_stat,
              },
              specialDefense: {
                current: data.stats[4].base_stat,
                max: data.stats[4].base_stat,
              },
              speed: {
                current: data.stats[5].base_stat,
                max: data.stats[5].base_stat,
              },
            },
          },
        },
      }
    );
  }

  static async togglePokespawns(id, enabled) {
    const data = await this.getGuildData(id);
    await GuildModel.findOneAndUpdate(
      {
        GuildID: id,
      },
      {
        spawns: enabled,
      }
    );
  }

  static async setPokespawnChannel(guildId, channelId) {
    const data = await this.getGuildData(guildId);
    await GuildModel.findOneAndUpdate(
      {
        GuildID: guildId,
      },
      {
        channel: channelId,
      }
    );
  }

  static async createUserData(id, name) {
    const { data } = await this.getPokemon(name);
    await UserModel.create({
      UserID: id,
      pokemon: [
        {
          name: name,
          stats: {
            health: {
              current: data.stats[0].base_stat,
              max: data.stats[0].base_stat,
            },
            attack: {
              current: data.stats[1].base_stat,
              max: data.stats[1].base_stat,
            },
            defense: {
              current: data.stats[2].base_stat,
              max: data.stats[2].base_stat,
            },
            specialAttack: {
              current: data.stats[3].base_stat,
              max: data.stats[3].base_stat,
            },
            specialDefense: {
              current: data.stats[4].base_stat,
              max: data.stats[4].base_stat,
            },
            speed: {
              current: data.stats[5].base_stat,
              max: data.stats[5].base_stat,
            },
          },
        },
      ],
    });
  }

  static async tradePokemon(trainer1, trainer2, pokemon1, pokemon2) {
    const trainer1Pokemon = [];
    const trainer2Pokemon = [];

    const trainer1Data = await UserModel.findOne({
      UserID: trainer1,
    });

    const trainer2Data = await UserModel.findOne({
      UserID: trainer2,
    });

    trainer1Data.pokemon.some((pokemon) => {
      if (pokemon.name == pokemon1.toLowerCase()) {
        trainer1Pokemon.push(pokemon);
      }
    });

    trainer2Data.pokemon.some((pokemon) => {
      if (pokemon.name == pokemon2.toLowerCase()) {
        trainer2Pokemon.push(pokemon);
      }
    });

    await UserModel.findOneAndUpdate(
      {
        UserID: trainer1,
      },
      {
        $push: {
          pokemon: trainer2Pokemon[0],
        },
      }
    );

    await UserModel.findOneAndUpdate(
      {
        UserID: trainer2,
      },
      {
        $push: {
          pokemon: trainer1Pokemon[0],
        },
      }
    );

    await UserModel.findOneAndUpdate(
      {
        UserID: trainer1,
      },
      {
        $pull: {
          pokemon: trainer1Pokemon[0],
        },
      }
    );

    await UserModel.findOneAndUpdate(
      {
        UserID: trainer2,
      },
      {
        $pull: {
          pokemon: trainer2Pokemon[0],
        },
      }
    );
  }

  static async createGuildData(id) {
    await GuildModel.create({
      GuildID: id,
      channel: null,
      spawns: false,
    });
  }

  static async deleteGuildData(id) {
    await GuildModel.deleteOne({
      GuildID: id,
    });
  }
};