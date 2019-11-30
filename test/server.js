const express = require('express')
const app = express()
const port = 3000

app.use(express.static('test'))
app.use(express.static('dist'))
app.get('/', (req, res) => res.sendFile('test.html', {root: __dirname}))

app.listen(port, () => console.log(`Test running on http://localhost:${port}`))