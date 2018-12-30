const request = require('request')
const cheerio = require('cheerio')

request.get('https://pokemondb.net/pokedex/game/lets-go-pikachu-eevee', (err, response, body) => {
  const $ = cheerio.load(body)
  $('.infocard .ent-name').each(function (number, pokemon) {
    console.log(`#${number + 1} -- ${$(this).text()}`)
  })
})