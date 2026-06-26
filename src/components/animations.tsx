"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import Image from 'next/image'

export function FadeInUp({ 
  children, 
  delay = 0, 
  className = "",
  ...props 
}: { 
  children: React.ReactNode, 
  delay?: number,
  className?: string 
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeInRight({ 
  children, 
  delay = 0, 
  className = "",
  ...props 
}: { 
  children: React.ReactNode, 
  delay?: number,
  className?: string 
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ 
  children, 
  className = "",
  delayChildren = 0.1,
  staggerChildren = 0.1,
  ...props 
}: { 
  children: React.ReactNode, 
  className?: string,
  delayChildren?: number,
  staggerChildren?: number
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren,
            delayChildren
          }
        }
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ 
  children, 
  className = "",
  ...props 
}: { 
  children: React.ReactNode, 
  className?: string 
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ParallaxImage({
  src,
  alt,
  className = ""
}: {
  src: string,
  alt: string,
  className?: string
}) {
  return (
    <motion.div 
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="w-full h-full overflow-hidden"
    >
      <Image src={src} alt={alt} fill className={`object-cover ${className}`} sizes="(max-width: 768px) 100vw, 50vw" priority />
    </motion.div>
  )
}
