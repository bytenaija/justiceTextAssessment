import React, { useEffect, useState, useRef } from "react"

import "./App.css"

import Loader from "./components/Loader"
import Row from "./components/Row"

// const DATA_SIZE_HALF = "half"
const DATA_SIZE_FULL = "full"
const INTERVAL_TIME = 2000
let TOTAL_DATA_SIZE = 0

const DATA_ITEMS_PER_REFRESH = 2
let LIST_OF_IDS = []

/** Application entry point */
function App() {
  const [data, setData] = useState([])

  const [value, setValue] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)

  const [error, setError] = useState("")

  /** DO NOT CHANGE THE FUNCTION BELOW */
  useEffect(() => {
    setInterval(() => {
      // Find random bucket of words to highlight
      setValue(Math.floor(Math.random() * 10))
    }, INTERVAL_TIME)
  }, [])
  /** DO NOT CHANGE THE FUNCTION ABOVE */

  // This fetches the list of IDs. Ensure we only fetch it once
  useEffect(() => {
    const fetchList = async () => {
      setLoading(true)
      let response = await fetch("/api/dataIdList?datasize=" + DATA_SIZE_FULL)
      let listResponse = await response.json()
      TOTAL_DATA_SIZE = listResponse.length
      LIST_OF_IDS = listResponse
    }
    fetchList()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let nextDataId = LIST_OF_IDS.slice(page, page + DATA_ITEMS_PER_REFRESH)
      let dataItems = await Promise.all(
        nextDataId.map(async (id) => {
          return (await fetch("/api/dataItem/" + id)).json()
        })
      )

      setData(dataItems)
      setLoading(false)
    }
    // only fetch when list of IDs has been fetched already
    if (LIST_OF_IDS.length) {
      fetchData()
    }
  }, [page, LIST_OF_IDS])

  const handleChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handleTextChange = async (start, changeText, rowId) => {
    try {
      let response = await fetch(`/api/update/${rowId}`, {
        method: "POST",
        body: JSON.stringify({
          start,
          text: changeText,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      let results = await response.json()

      const allData = [...data]
      allData[rowId].data = results.row
      // update the edited row
      setData(allData)
    } catch (err) {
      console.log(err)
      setError(err.message)
      setTimeout(() => setError(""), 3000)
    }
  }
  return (
    <div className="App">
      <div className="header">
        <h1>JT Online Book</h1>

        <input
          type="text"
          placeholder="Search text"
          value={searchInput}
          onChange={handleChange}
        />
      </div>
      {error && <div className="error">{error}</div>}
      <div className="book-pages">
        {data.map((row) => {
          return (
            <Row
              row={row}
              value={value}
              handleTextChange={handleTextChange}
              searchInput={searchInput}
              setPage={setPage}
              key={row.rowId}
            />
          )
        })}
      </div>

      {loading && (
        <div className="loader">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default App
