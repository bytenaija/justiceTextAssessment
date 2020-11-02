import React, { useState, createRef, useEffect } from "react"
import TextItem from "../TextItem/TextItem"
import { motion } from "framer-motion"

import "./row.css"

const isEven = (str) => parseInt(str) % 2 !== 0

const Row = ({ row, searchInput, value, handleTextChange, setPage }) => {
  const rowRef = createRef()

  const flipPage = (e) => {
    let page = parseInt(row.rowId)

    if (page > 0) {
      if (isEven(page)) {
        setPage(++page)
      } else {
        setPage(page - 2)
      }
    }
  }
  return (
    <div
      className={`page ${isEven(row.rowId) ? "even" : "odd"}`}
      ref={rowRef}
      onClick={flipPage}
      style={{
        zIndex: 99999,
        float: isEven(row.rowId) ? "left" : "right",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: isEven(row.rowId) ? "flex-end" : "flex-start",
          padding: "0 2rem",
          minHeight: "1px",
        }}
      >
        <h3>Page {parseInt(row.rowId) + 1}</h3>
      </div>

      <p key={`p${row.rowId}`}>
        {row.data.map((textitem, j) => {
          const regexStr = new RegExp(searchInput, "i")
          if (searchInput.length > 0 && textitem.text.search(regexStr) === -1) {
            return null
          }

          return (
            <TextItem
              key={`${row.rowId}-${j}`}
              value={value}
              data={textitem}
              row={row.rowId}
              handleChange={handleTextChange}
              index={j}
            />
          )
        })}
      </p>
    </div>
  )
}

export default React.memo(Row, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.row.data) !== JSON.stringify(nextProps.row.data)
  )
})
