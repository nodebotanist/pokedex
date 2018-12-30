const fs = require('fs')
const path = require('path')

const request = require('request')
const cheerio = require('cheerio')

request.get('https://pokemondb.net/pokedex/game/lets-go-pikachu-eevee', (err, response, body) => {
  if (err) {
    throw new Error(err)
  }
  let result = {}
  const $ = cheerio.load(body)
  let imgurl, name, types
  $('.infocard').each(function (number) {
    imgurl = $(this).find('.img-sprite').attr('src')
    name = $(this).find('.ent-name').text()
    types = []
    $(this).find('a.itype').each(function () {
      types.push($(this).text())
    })
    console.log('image url:', imgurl, '\nname: ', name)
    result[number + 1] = {
      imgurl,
      name,
      types
    }
  })
  fs.writeFile(path.resolve(__dirname, './data/pokemon.json'), JSON.stringify(result), (err) => {
    if (err) {
      throw new Error(err)
    }
    console.log('wrote the pokedex file!')
  })
})
