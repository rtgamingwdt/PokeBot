const { get } = require("axios");
const { load } = require("cheerio");
const GuildModel = require("../model/GuildModel");
const UserModel = require("../model/UserModel");
const pokemon = require("../../resources/Pokemon.json");

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

  static getRandomPokemon() {
    
    const index = Math.floor(Math.random() * ((9 - 1) - 1 + 1) + 1);
    
    const data = pokemon[index];

    const formIndex = Math.floor(Math.random() * (1 - 0 + 1) + 0);
    
    console.log(formIndex)

    return {
      "name": `${data.name}`,
      "id": `${data.id}`,
      "form": `${data.forms[formIndex]}`
    }
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

  static async giveBadge(id, badge) {
    const data = await this.getUserData(id);

    const badges = data.badges;

    if (badge == "Founder") {
      await UserModel.findOneAndUpdate({
        UserID: id
      }, {
        badges: [
          {
            name: "Founder",
            has: true
          }, {
            name: "Moderator",
            has: badges[1].has
          }, {
            name: "Indigo",
            has: badges[2].has
          },
          {
            name: "Johnto",
            has: badges[3].has
          },
          {
            name: "Hoenn",
            has: badges[4].has
          },
          {
            name: "Sinnoh",
            has: badges[5].has
          },
          {
            name: "Unova",
            has: badges[6].has
          },
          {
            name: "Kalos",
            has: badges[7].has
          },
          {
            name: "Galar",
            has: badges[8].has
          }
        ]
      })
    }

    if (badge == "Moderator") {
      await UserModel.findOneAndUpdate({
        UserID: id
      }, {
        badges: [
          {
            name: "Founder",
            has: badges[0].has
          }, {
            name: "Moderator",
            has: true
          }, {
            name: "Indigo",
            has: badges[2].has
          },
          {
            name: "Johnto",
            has: badges[3].has
          },
          {
            name: "Hoenn",
            has: badges[4].has
          },
          {
            name: "Sinnoh",
            has: badges[5].has
          },
          {
            name: "Unova",
            has: badges[6].has
          },
          {
            name: "Kalos",
            has: badges[7].has
          },
          {
            name: "Galar",
            has: badges[8].has
          }
        ]
      })
    }

    if (badge == "Indigo") {
      await UserModel.findOneAndUpdate({
        UserID: id
      }, {
        badges: [
          {
            name: "Founder",
            has: badges[0].has
          }, {
            name: "Moderator",
            has: badges[1].has
          }, {
            name: "Indigo",
            has: true
          },
          {
            name: "Johnto",
            has: badges[3].has
          },
          {
            name: "Hoenn",
            has: badges[4].has
          },
          {
            name: "Sinnoh",
            has: badges[5].has
          },
          {
            name: "Unova",
            has: badges[6].has
          },
          {
            name: "Kalos",
            has: badges[7].has
          },
          {
            name: "Galar",
            has: badges[8].has
          }
        ]
      })
    }

    if (badge == "Johnto") {
      await UserModel.findOneAndUpdate({
        UserID: id
      }, {
        badges: [
          {
            name: "Founder",
            has: badges[0].has
          }, {
            name: "Moderator",
            has: badges[1].has
          }, {
            name: "Indigo",
            has: badges[2].has
          },
          {
            name: "Johnto",
            has: true
          },
          {
            name: "Hoenn",
            has: badges[4].has
          },
          {
            name: "Sinnoh",
            has: badges[5].has
          },
          {
            name: "Unova",
            has: badges[6].has
          },
          {
            name: "Kalos",
            has: badges[7].has
          },
          {
            name: "Galar",
            has: badges[8].has
          }
        ]
      })
    }

    if (badge == "Hoenn") {
      await UserModel.findOneAndUpdate({
        UserID: id
      }, {
        badges: [
          {
            name: "Founder",
            has: badges[0].has
          }, {
            name: "Moderator",
            has: badges[1].has
          }, {
            name: "Indigo",
            has: badges[2].has
          },
          {
            name: "Johnto",
            has: badges[3].has
          },
          {
            name: "Hoenn",
            has: true
          },
          {
            name: "Sinnoh",
            has: badges[5].has
          },
          {
            name: "Unova",
            has: badges[6].has
          },
          {
            name: "Kalos",
            has: badges[7].has
          },
          {
            name: "Galar",
            has: badges[8].has
          }
        ]
      })
    }

    if (badge == "Sinnoh") {
      await UserModel.findOneAndUpdate({
        UserID: id
      }, {
        badges: [
          {
            name: "Founder",
            has: badges[0].has
          }, {
            name: "Moderator",
            has: badges[1].has
          }, {
            name: "Indigo",
            has: badges[2].has
          },
          {
            name: "Johnto",
            has: badges[3].has
          },
          {
            name: "Hoenn",
            has: badges[4].has
          },
          {
            name: "Sinnoh",
            has: true
          },
          {
            name: "Unova",
            has: badges[6].has
          },
          {
            name: "Kalos",
            has: badges[7].has
          },
          {
            name: "Galar",
            has: badges[8].has
          }
        ]
      })
    }

    if (badge == "Unova") {
      await UserModel.findOneAndUpdate({
        UserID: id
      }, {
        badges: [
          {
            name: "Founder",
            has: badges[0].has
          }, {
            name: "Moderator",
            has: badges[1].has
          }, {
            name: "Indigo",
            has: badges[2].has
          },
          {
            name: "Johnto",
            has: badges[3].has
          },
          {
            name: "Hoenn",
            has: badges[4].has
          },
          {
            name: "Sinnoh",
            has: badges[5].has
          },
          {
            name: "Unova",
            has: true
          },
          {
            name: "Kalos",
            has: badges[7].has
          },
          {
            name: "Galar",
            has: badges[8].has
          }
        ]
      })
    }

    if (badge == "Kalos") {
      await UserModel.findOneAndUpdate({
        UserID: id
      }, {
        badges: [
          {
            name: "Founder",
            has: badges[0].has
          }, {
            name: "Moderator",
            has: badges[1].has
          }, {
            name: "Indigo",
            has: badges[2].has
          },
          {
            name: "Johnto",
            has: badges[3].has
          },
          {
            name: "Hoenn",
            has: badges[4].has
          },
          {
            name: "Sinnoh",
            has: badges[5].has
          },
          {
            name: "Unova",
            has: badges[6].has
          },
          {
            name: "Kalos",
            has: true
          },
          {
            name: "Galar",
            has: badges[8].has
          }
        ]
      })
    }

    if (badge == "Galar") {
      await UserModel.findOneAndUpdate({
        UserID: id
      }, {
        badges: [
          {
            name: "Founder",
            has: badges[0].has
          }, {
            name: "Moderator",
            has: badges[1].has
          }, {
            name: "Indigo",
            has: badges[2].has
          },
          {
            name: "Johnto",
            has: badges[3].has
          },
          {
            name: "Hoenn",
            has: badges[4].has
          },
          {
            name: "Sinnoh",
            has: badges[5].has
          },
          {
            name: "Unova",
            has: badges[6].has
          },
          {
            name: "Kalos",
            has: badges[7].has
          },
          {
            name: "Galar",
            has: true
          }
        ]
      })
    }
  }

  static async getBadges(id) {
    const badges = [];
    const data = await this.getUserData(id);

    data.badges.forEach((badge) => {
      if (badge.has) {
        console.log(badge)
        badges.push(badge.name);
      }
    });

    console.log(badges);
    return badges;
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
      badges: [
        {
          name: "Founder",
          has: false
        }, {
          name: "Moderator",
          has: false
        }, {
          name: "Indigo",
          has: false
        },
        {
          name: "Johnto",
          has: false
        },
        {
          name: "Hoenn",
          has: false
        },
        {
          name: "Sinnoh",
          has: false
        },
        {
          name: "Unova",
          has: false
        },
        {
          name: "Kalos",
          has: false
        },
        {
          name: "Galar",
          has: false
        }
      ]
    });
  }

  static async deleteUserData(id) {
    await UserModel.deleteOne({
      UserID: id
    })
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
