"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-100/40 to-blue-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-100/40 to-purple-100/40 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Creative Solutions
              </span>{" "}
              for the Digital Age
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We craft stunning digital experiences that captivate your audience and elevate your brand in today's
              competitive landscape.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="#services"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:from-purple-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
            >
              Explore Our Services
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="#portfolio"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-gray-800 font-medium border border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
            >
              View Our Work
            </Link>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border border-gray-100">
            <img
              src="/placeholder.svg?height=1080&width=1920"
              alt="Digital workspace"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Elements */}
          <motion.div
            className="absolute -top-6 -left-6 md:-top-8 md:-left-8 bg-white p-3 md:p-4 rounded-lg shadow-lg"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <div className="text-sm font-medium">Creative Design</div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-white p-3 md:p-4 rounded-lg shadow-lg"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: 1,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="text-sm font-medium">Modern Technology</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

