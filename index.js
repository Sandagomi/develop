const PORT = process.env.PORT || 8000 // for deploying in heroku
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
}) // calling the get function to the root page


app.get('/news', (req,res) => {

    res.json(articles)

}) // main get function which calling and scraping the data from websites


app.get('/news/:newspaperId', async(req,res) => {

    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address 
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
    

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {

                const title = $(this).text()
                const url = $(this).attr('href')

                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })

            })

            res.json(specificArticles)

        }).catch((err) => {
            console.log(err)
        })

})



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`)) //call and setup the app in console log to listen and check