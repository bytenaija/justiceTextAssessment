const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
app.use(express.json())
const http = require("http").createServer(app)
const port = process.env.PORT || 8000

const data = require("./data.json")

const DATA_SIZE_HALF = "half"
const DATA_SIZE_FULL = "full"

app.get("/api/dataIdList", (req, res) => {
  if (!req.query.datasize) {
    res.status(400).send("Bad Request - missing query")
    return
  }

  if (req.query.datasize === DATA_SIZE_HALF) {
    res.send(data.rowIdHalfList)
  } else {
    res.send(data.rowIdFullList)
  }
})

app.get("/api/dataItem/:id", (req, res) => {
  if (!req.params.id) {
    res.status(400).send("Bad Request - missing id")
    return
  }
  res.send({
    data: data.rows["row" + req.params.id],
    rowId: req.params.id,
  })
})

app.post("/api/update/:id", (req, res) => {
  if (!req.params.id) {
    res.status(400).send("Bad Request - missing id")
    return
  }
  let row = data.rows["row" + req.params.id]

  const idx = row.findIndex((r) => r.info.start === req.body.start)
  row[idx].text = req.body.text
  data.rows["row" + req.params.id] = row
  fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(data))

  res.send({
    row,
  })
})

http.listen(port, () => console.log(`Listening on port ${port}`))
