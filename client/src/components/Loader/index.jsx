import React from "react"
import "./loader.css"
import { motion } from "framer-motion"

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const spinTransition = {
  duration: 0.4,
  loop: Infinity,
  ease: "linear",
}
const Loader = () => (
  <motion.div
    className="loading-container"
    variants={loadingContainerVariants}
    initial="start"
    animate="end"
  >
    <motion.span
      className="loading-circle"
      animate={{ rotate: 360 }}
      transition={spinTransition}
    ></motion.span>
  </motion.div>
)

export default Loader
