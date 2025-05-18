import React, { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"

interface NavLinkProps {
  href: string
  active?: boolean
  children: React.ReactNode
}

const NavLink: React.FC<NavLinkProps> = ({ href, active, children }) => {
  return (
    <Link
      to={href}
      className={`font-medium px-2 py-1.5 transition-all duration-200 ${
        active ? "border-b-4 border-white" : "hover:border-b-2"
      }`}
    >
      {children}
    </Link>
  )
}

const Navbar: React.FC = () => {
  const location = useLocation()
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navLinks = [
    { name: "Work", href: "/work" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Ideas", href: "/ideas" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0 bg-[#F96500]/95" : "-translate-y-full"
      } text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 mb-3 sm:mb-0">
          <img
            src="/suitmedia.png"
            alt="Suitmedia Logo"
            className="h-10 invert brightness-0"
          />
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              href={link.href}
              active={location.pathname === link.href}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
