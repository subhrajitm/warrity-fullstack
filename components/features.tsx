"use client"

import { motion } from "framer-motion"
import { Layers, Code, PenTool, Zap, Users, BarChart } from "lucide-react"

const features = [
  {
    icon: <Layers className="w-6 h-6" />,
    title: "UI/UX Design",
    description: "Crafting intuitive interfaces and seamless user experiences that delight and engage.",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Web Development",
    description: "Building responsive, high-performance websites and applications with modern technologies.",
  },
  {
    icon: <PenTool className="w-6 h-6" />,
    title: "Branding",
    description: "Creating distinctive brand identities that resonate with your target audience.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Digital Marketing",
    description: "Driving growth through strategic digital marketing campaigns and SEO optimization.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Consultation",
    description: "Expert advice and strategies to help your business thrive in the digital landscape.",
  },
  {
    icon: <BarChart className="w-6 h-6" />,
    title: "Analytics",
    description: "Data-driven insights to measure performance and guide strategic decisions.",
  },
]

export default function Features() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-gray-600">
              Comprehensive digital solutions tailored to your unique business needs
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

