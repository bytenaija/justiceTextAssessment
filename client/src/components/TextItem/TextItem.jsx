import React, { createRef, useEffect, useState } from "react"
import "./TextItem.css"
import { motion } from "framer-motion"

const getHighlight = (props, visible) => {
  if (Math.floor(props.data.info.start / 2000) % props.value === 0 && visible) {
    return "highlight"
  }
  return ""
}

/** Component for each word controlling highlight state. */
function TextItem(props) {
  const textItemRef = createRef()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio === 1) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    )

    if (textItemRef.current) {
      observer.observe(textItemRef.current)
    }

    return () => {
      if (textItemRef.current) {
        observer.unobserve(textItemRef.current)
      }
    }
  }, [textItemRef])
  const getEditedClip = (currentData, changeText, rowId) => {
    if (currentData.text.trim() !== changeText.trim()) {
      props.handleChange(currentData.info.start, changeText, rowId)
    }
  }

  return (
    <motion.span
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        ease: "easeOut",
        delay: props.index / 100,
        duration: 0.4,
      }}
    >
      <span
        ref={textItemRef}
        className={getHighlight(props, visible)}
        data-row={props.row}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onClick={(e) => e.stopPropagation()}
        onBlur={(e) => {
          getEditedClip(
            props.data,
            e.currentTarget.innerText,
            e.target.dataset.row
          )
        }}
      >
        {props.data.text}{" "}
      </span>
    </motion.span>
  )
}

export default TextItem
