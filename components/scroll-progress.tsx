"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className="container px-8">
        <motion.div
          className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 origin-left rounded-full"
          style={{ scaleX, opacity: isVisible ? 1 : 0 }}
          transition={{ opacity: { duration: 0.3 } }}
        />
      </div>
    </div>
  )
}
