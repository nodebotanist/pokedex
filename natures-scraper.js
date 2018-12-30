const fs = require('fs')
const path = require('path')

const request = require('request')
const cheerio = require('cheerio')

request.get('https://pokemondb.net/mechanics/natures', (err, response, body) => {
  if (err) {
    throw new Error(err)
  }
  let result = {}
  const $ = cheerio.load(body)
  let name, upstat, downstat
  $('.data-table').last().find('tbody tr').each(function () {
    name = $(this).find('.ent-name').text().replace(/[\n\r\t]/g, '')
    upstat = $(this).find('.text-positive').text().replace(/[\n\r\t]/g, '')
    downstat = $(this).find('.text-negative').text().replace(/[\n\r\t]/g, '')
    result[name] = {
      upstat,
      downstat
    }
  })
  fs.writeFile(path.resolve(__dirname, './data/natures.json'), JSON.stringify(result), (err) => {
    if (err) {
      throw new Error(err)
    }
    console.log('wrote the natures file!')
  })
})
