import React, { useEffect, useRef } from 'react';
import hairImage from '../assets/Hair.png';
import nailsImage from '../assets/Nails.png';
import faceImage from '../assets/face.jpg';
import bodyImage from '../assets/Body.png';
import makeupImage from '../assets/Makeup.png';
import bridalImage from '../assets/Bridal.png';

const services = [
  { name: 'hair', image: hairImage, link: '/services/hair' },
  { name: 'nails', image: nailsImage, link: '/services/nails' },
  { name: 'face', image: faceImage, link: '/services/face' },
  { name: 'body', image: bodyImage, link: '/services/body' },
  { name: 'makeup', image: makeupImage, link: '/services/makeup' },
  { name: 'bridal', image: bridalImage, link: '/services/bridal' },
];

const ServiceNavbar = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalScrollWidth = container.scrollWidth;
    const halfScrollWidth = totalScrollWidth / 2;

    let animationFrame;
    const scrollSpeed = 0.3; // Slower scroll speed

    const scroll = () => {
      if (container.scrollLeft >= halfScrollWidth) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollSpeed;
      }
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const containerStyle = {
    display: 'flex',
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    height: '375px',
  };

  const linkStyle = {
    flex: '0 0 auto',
    textDecoration: 'none',
    width: '300px',
    height: '375px',
    display: 'inline-block',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  const sectionContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  };

  const titleContainerStyle = {
    textAlign: 'center',
    padding: '2rem 0',
    backgroundColor: '#f8f8f8',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0',
    fontFamily: `'Poppins', 'Roboto', sans-serif`,
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#666',
    marginTop: '0.5rem',
    fontFamily: `'Poppins', 'Roboto', sans-serif`,
  };

  return (
    <div style={sectionContainerStyle}>
      <div style={titleContainerStyle}>
        <h2 style={titleStyle}>Discover Our Premium Services</h2>
        <p style={subtitleStyle}>Indulge in a complete beauty experience crafted just for you</p>
      </div>
      <div ref={containerRef} style={containerStyle}>
        {[...services, ...services].map((service, index) => (
          <a key={index} href={service.link} style={linkStyle}>
            <img src={service.image} alt={service.name} style={imageStyle} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ServiceNavbar;
