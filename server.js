// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items'

// Haal alle squads uit de WHOIS API op
const squadData = await fetchJson(apiUrl + '/squad')

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Messages laten versturen enzo
app.use(express.urlencoded({extended: true}))

const messages = []

// Maak een GET route voor de index
app.get('/', function (request, response) {
  // Haal alle personen uit de WHOIS API op
  fetchJson('https://fdnd.directus.app/items/person').then((apiData) => {
    // ?filter={"squad_id":3}
    // &sort=name
    // apiData bevat gegevens van alle personen uit alle squads
    // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

    // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
    response.render('index', {
      persons: apiData.data, 
      squads: squadData.data,
      messages: messages
    })
  })
})

// Maak een POST route voor de index
app.post('/', function (request, response) {
  // Voeg een nieuw bericht toe aan de messages array
  messages.push(request.body.bericht)

  // Er is nog geen afhandeling van POST, redirect naar GET op /
  response.redirect(303, '/')
})
console.log('getdetails0')

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/person/:id', function (request, response) {
  console.log('1')
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson('https://fdnd.directus.app/items/person/' + request.params.id).then((apiData) => {
    console.log('2')
    // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render('person', {
      person: apiData.data, 
      squads: squadData.data,
      messages: messages
    })
    console.log('3')
  })
})

// Maak een POST route voor person
app.post('/person/:id', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  messages.push(request.body.bericht)
  // gebruik maken van person variabele omdat er anders weer undefined staat
  response.redirect(303, '/person/' + request.params.id)
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
