const express = require('express')
app = express()
port = 3000

app.use(express.static('lib'))

app.route("/", (req, res) => {
    return res.sendFile("/home/rohan/Documents/PtAi/lib/index.html")
})

app.listen(port, () => {
    console.log("serving :3000")
})