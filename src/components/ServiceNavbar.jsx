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

    let scrollAmount = 0;
    const scrollSpeed = 0.5;
    let animationFrameId;

    const scroll = () => {
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollSpeed;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={styles.sectionContainer}>
      <div style={styles.titleContainer}>
        <h2 style={styles.title}>Discover Our Premium Services</h2>
        <p style={styles.subtitle}>Indulge in a complete beauty experience crafted just for you</p>
      </div>

      <div
        ref={containerRef}
        style={styles.carouselContainer}
        className="no-scrollbar"
      >
        {[...services, ...services].map((service, index) => (
          <a key={index} href={service.link} style={styles.card}>
            <img src={service.image} alt={service.name} style={styles.image} />
          </a>
        ))}
      </div>
    </div>
  );
};

const styles = {
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  titleContainer: {
    textAlign: 'center',
    padding: '2rem 0',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
    fontFamily: `'Poppins', 'Roboto', sans-serif`,
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginTop: '0.5rem',
    fontFamily: `'Poppins', 'Roboto', sans-serif`,
  },
  carouselContainer: {
    display: 'flex',
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
    height: '375px',
    width: '100%',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  card: {
    flex: '0 0 auto',
    textDecoration: 'none',
    width: '300px',
    height: '375px',
    display: 'inline-block',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
};

export default ServiceNavbar;
