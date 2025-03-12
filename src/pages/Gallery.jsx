import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:5001/api/gallery") // Adjust API URL
            .then((response) => setImages(response.data))
            .catch((error) => console.error("Error fetching images:", error));
    }, []);

    // Define the grid layout
    const layoutClasses = [
        "large", "small framed", "small", 
        "medium", "small framed", "medium"
    ];

    const nextSlide = () => {
        if (images.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevSlide = () => {
        if (images.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <Box sx={{ position: "relative", textAlign: "center", mt: 4, px: 3 }}>
            <Typography variant="h4" sx={{ mb: 2, fontFamily: "serif" }}>OUR GALLERY</Typography>

            {images.length > 0 ? (
                <Box className="gallery-grid">
                    {images.slice(currentIndex, currentIndex + 6).map((image, index) => (
                        <Box 
                            key={image.id} 
                            className={`gallery-item ${layoutClasses[index % layoutClasses.length]}`}
                            sx={{
                                backgroundImage: `url(${image.image_url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: 2
                            }}
                        />
                    ))}
                </Box>
            ) : (
                <Typography variant="body1">No images available</Typography>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <IconButton className="gallery-arrow left" onClick={prevSlide}>
                        <ArrowBackIos />
                    </IconButton>
                    <IconButton className="gallery-arrow right" onClick={nextSlide}>
                        <ArrowForwardIos />
                    </IconButton>
                </>
            )}

            {/* Styles */}
            <style>
                {`
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    max-width: 900px;
                    margin: auto;
                }

                .gallery-item {
                    width: 100%;
                    height: 200px;
                }

                .large { grid-column: span 2; height: 300px; }
                .medium { height: 250px; }
                .small { height: 150px; }
                .framed { border: 6px solid #a77d5a; }

                .gallery-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.8);
                    padding: 10px;
                    border-radius: 50%;
                }
                .left { left: 10px; }
                .right { right: 10px; }
                `}
            </style>
        </Box>
    );
};

export default Gallery;
