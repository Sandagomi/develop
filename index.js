const PORT = 8000
const express = require ('express') // importing library
const axios = require ('axios') // importing library
const cheerio = require ('cheerio') // importing library
const { response } = require('express')

const app = express() //initiating and calling the express function

const newspapers = [
    {
        name: 'times',
        address: 'https://www.thetimes.co.uk/environment',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    }

]

const articles = []


newspapers.forEach(newspaper => {

    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {

                const title = $(this).text()
                const url = $(this).attr('href')


                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })

            })

        })

})


app.get('/', (req,res) => {
    res.json('Welcome to my climate change API')
}) // calling the get function


app.get('/news', (req,res) => {

    res.json(articles)

}) // main get function which calling and scraping the data from websites



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`)) //call and setup the app in console log to listen and check