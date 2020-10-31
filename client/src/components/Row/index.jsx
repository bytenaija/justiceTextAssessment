import React, { useState, createRef, useEffect } from "react"
import TextItem from "../TextItem/TextItem"
import { motion } from "framer-motion"

import "./row.css"
const isEven = (str) => parseInt(str) % 2 !== 0

const Row = ({
  row,
  searchInput,
  value,
  handleTextChange,
  setPage,
  setCurrentPages,
  currentPages,
}) => {
  const rowRef = createRef()
  const [visible, setVisible] = useState(true)
  // useEffect(() => {
  //   var options = {
  //     root: null,
  //     rootMargin: "10px",
  //     threshold: 0.5,
  //   }
  //   const observer = new IntersectionObserver(handleObserver, options)
  //   if (rowRef.current) {
  //     observer.observe(rowRef.current)
  //   }

  //   return () => {
  //     if (rowRef.current) {
  //       observer.unobserve(rowRef.current)
  //     }
  //   }
  // }, [rowRef.current])

  // const handleObserver = (entities) => {
  //   const target = entities[0]
  //   if (target.isIntersecting) {
  //     setVisible(true)
  //   } else {
  //     setVisible(false)
  //   }
  // }

  useEffect(() => {
    const flip = () => {
      if (parseInt(row.rowId) > 1) {
        if (rowRef.current) {
          rowRef.current.style = {
            ...rowRef.current.style,
            zIndex: 1,
            transform: "rotate3d(0, 1, 0, 10deg)",
            top: 0,
            left: 0,
          }
        }
      }
    }
    if (rowRef.current) {
      rowRef.current.addEventListener("animationstart", flip)
    }
    return () => {
      if (rowRef.current) {
        rowRef.current.removeEventListener("animationstart", flip)
      }
    }
  }, [rowRef.current])

  const flipPage = (e) => {
    let page = parseInt(row.rowId)

    if (page > 0) {
      if (isEven(page)) {
        setCurrentPages([page + 1, page + 2])
        setPage(page++)
      } else {
        setCurrentPages([page - 2, page - 1])
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
        zIndex: currentPages.includes(parseInt(row.rowId))
          ? 99999
          : 90 - parseInt(row.rowId),
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
      {currentPages.includes(parseInt(row.rowId)) && (
        <motion.p key={`p${row.rowId}`}>
          {row.data.map((textitem, j) => {
            const regexStr = new RegExp(searchInput, "i")
            if (
              searchInput.length > 0 &&
              textitem.text.search(regexStr) === -1
            ) {
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

          {}
        </motion.p>
      )}
    </div>
  )
}

export default Row
