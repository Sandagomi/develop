const PORT = 8000
const express = require ('express') // importing library
const axios = require ('axios') // importing library
const cheerio = require ('cheerio') // importing library

const app = express() //initiating and calling the express function

const articles = []

app.get('/', (req,res) => {
    res.json('Welcome to my climate change API')
}) // caling get function


app.get('/news', (req,res) => {

    axios.get('https://www.theguardian.com/environment/climate-crisis')
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url
                })
            })

            res.json(articles)
        }).catch((err) => console.log(err))

})



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`)) //call and setup the app in console log to listen and check