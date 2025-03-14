"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Working with Nova transformed our online presence. Their creative approach and technical expertise delivered results beyond our expectations.",
    author: "Sarah Johnson",
    position: "CEO, TechStart Inc.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "The team at Nova understood our vision perfectly and translated it into a stunning website that has significantly increased our conversion rates.",
    author: "Michael Chen",
    position: "Marketing Director, Elevate Brands",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "Their attention to detail and commitment to excellence made all the difference. Nova delivered a product that perfectly represents our brand.",
    author: "Emma Rodriguez",
    position: "Founder, Artisan Collective",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it - hear from some of our satisfied clients
            </p>
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 flex-shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto">
                      <img
                        src={testimonials[current].image || "/placeholder.svg"}
                        alt={testimonials[current].author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-purple-100 rounded-full p-2 text-purple-600">
                      <Quote className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <blockquote className="text-lg md:text-xl text-gray-700 italic mb-6">
                    "{testimonials[current].quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonials[current].author}</div>
                    <div className="text-gray-500">{testimonials[current].position}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={prev}
              className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    current === index ? "bg-purple-600" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

