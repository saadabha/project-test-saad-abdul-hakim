import React, { useEffect, useState } from "react"

interface BannerProps {
  imageUrl: string
  title: string
  subtitle: string
}

const Banner: React.FC<BannerProps> = ({ imageUrl, title, subtitle }) => {
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY)
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-100"
        style={{
          backgroundImage: `url(${imageUrl})`,
          transform: `translateY(${offsetY * 0.4}px)`,
          clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-lg mt-2">{subtitle}</p>
      </div>
    </div>
  )
}

export default Banner
