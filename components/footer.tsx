import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <Link href="/" className="inline-block">
                <div className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  NOVA
                </div>
              </Link>
            </div>
            <p className="mb-4 text-gray-400">
              Crafting exceptional digital experiences that drive results and elevate your brand.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#web-design" className="text-gray-400 hover:text-white transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link href="#development" className="text-gray-400 hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="#branding" className="text-gray-400 hover:text-white transition-colors">
                  Branding
                </Link>
              </li>
              <li>
                <Link href="#marketing" className="text-gray-400 hover:text-white transition-colors">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="#consultation" className="text-gray-400 hover:text-white transition-colors">
                  Consultation
                </Link>
              </li>
              <li>
                <Link href="#analytics" className="text-gray-400 hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#team" className="text-gray-400 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="#careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>123 Design Street, Creative City, 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                <span>hello@novaagency.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Nova Creative Agency. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm">
                <li>
                  <Link href="#terms" className="text-gray-500 hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#privacy" className="text-gray-500 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#cookies" className="text-gray-500 hover:text-white transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

