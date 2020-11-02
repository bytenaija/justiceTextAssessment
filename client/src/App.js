import React, { useEffect, useState, useRef } from "react"

import "./App.css"

import Loader from "./components/Loader"
import Row from "./components/Row"

// const DATA_SIZE_HALF = "half"
const DATA_SIZE_FULL = "full"
const INTERVAL_TIME = 2000

const DATA_PER_PAGE = 2

/** Application entry point */
function App() {
  const [data, setData] = useState([])

  const [value, setValue] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [listOfIds, setListOfIds] = useState([])
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

      setListOfIds(listResponse)
    }
    fetchList()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let nextDataId = listOfIds.slice(page, page + DATA_PER_PAGE)
      let dataItems = await Promise.all(
        nextDataId.map(async (id) => {
          return (await fetch("/api/dataItem/" + id)).json()
        })
      )

      setData(dataItems)
      setLoading(false)
    }
    // only fetch when list of IDs has been fetched already
    if (listOfIds.length) {
      fetchData()
    }
  }, [page, listOfIds])

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
      const idx = allData.findIndex((row) => row.rowId == rowId)
      if (idx !== -1) {
        allData[idx].data = results.row
        // update the edited row
        setData(allData)
      }
    } catch (err) {
      console.log(err)
      setError(err.message)
      setTimeout(() => setError(""), 9000)
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
