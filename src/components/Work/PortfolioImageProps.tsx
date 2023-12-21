import React from 'react'
import Image from 'next/image'

interface PortfolioImageProps {
  src: string
  alt: string
  width?: string
  height?: string
}

const PortfolioImage: React.FC<PortfolioImageProps> = ({
  src,
  alt,
  width,
  height
}) => {
  const containerStyle: React.CSSProperties = {
    width: width || '100%', // Adjust the width or use default value
    height: height || '200px', // Adjust the height or use default value
    overflow: 'hidden',
    borderRadius: '8px' // Optional: Add border radius for rounded corners
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
  }

  return (
    <div style={containerStyle}>
      <Image src={src} alt={alt} width={200} height={200} style={imageStyle} />
    </div>
  )
}

export default PortfolioImage
