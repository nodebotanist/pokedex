const fs = require('fs')
const path = require('path')

const request = require('request')
const cheerio = require('cheerio')

const download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    if (err) {
      throw new Error(err)
    }
    request(uri).pipe(fs.createWriteStream(path.resolve(__dirname, filename))).on('close', callback)
  })
}

request.get('https://pokemondb.net/pokedex/game/lets-go-pikachu-eevee', (err, response, body) => {
  if (err) {
    throw new Error(err)
  }
  let result = {}
  const $ = cheerio.load(body)
  let imgPath, name, types
  $('.infocard').each(function (number) {
    name = $(this).find('.ent-name').text()
    imgPath = './data/img/' + name + '.png'
    download($(this).find('.img-sprite').attr('src'), imgPath, (err) => { if (err) throw new Error(err) })
    types = []
    $(this).find('a.itype').each(function () {
      types.push($(this).text())
    })
    console.log('image path:', imgPath, '\nname: ', name)
    result[number + 1] = {
      imgPath,
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
