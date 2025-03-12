import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, IconButton, Dialog, DialogContent, IconButton as MuiIconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Close } from "@mui/icons-material";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:500/api/gallery") // Adjust API URL
            .then((response) => setImages(response.data))
            .catch((error) => console.error("Error fetching images:", error));
    }, []);

    // Define the grid layout
    const layoutClasses = [
        "large", "small framed", "small", 
        "medium", "small framed", "medium"
    ];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <Box sx={{ position: "relative", textAlign: "center", mt: 4, px: 3 }}>
            {/* Elegant Gallery Header with Line */}
            <Box sx={{ mb: 4, maxWidth: "900px", margin: "0 auto" }}>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontFamily: "'Times New Roman', serif", 
                        fontWeight: 300,
                        letterSpacing: "0.1em",
                        color: "#333",
                        textTransform: "uppercase",
                        mb: 1
                    }}
                >
                    Our Gallery
                </Typography>
                <Box 
                    sx={{ 
                        width: "100%", 
                        height: "1px", 
                        backgroundColor: "#333",
                        mt: 1
                    }} 
                />
            </Box>

            <Box className="gallery-grid">
                {images.slice(currentIndex, currentIndex + 6).map((image, index) => (
                    <Box 
                        key={image.id} 
                        className={`gallery-item ${layoutClasses[index % layoutClasses.length]}`}
                        sx={{
                            backgroundImage: `url(${image.image_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: 2,
                            cursor: "pointer",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                            }
                        }}
                        onClick={() => handleImageClick(image)}
                    />
                ))}
            </Box>
            
            {/* Navigation Arrows */}
            <IconButton className="gallery-arrow left" onClick={prevSlide}>
                <ArrowBackIos />
            </IconButton>
            <IconButton className="gallery-arrow right" onClick={nextSlide}>
                <ArrowForwardIos />
            </IconButton>
            
            {/* Modal for Full Image View */}
            <Dialog 
                open={modalOpen} 
                onClose={handleCloseModal}
                maxWidth="lg"
                fullWidth
            >
                <DialogContent 
                    sx={{ 
                        p: 0, 
                        position: "relative",
                        bgcolor: "black",
                        height: "80vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {selectedImage && (
                        <img 
                            src={selectedImage.image_url} 
                            alt="Gallery Image" 
                            style={{ 
                                maxHeight: "100%", 
                                maxWidth: "100%", 
                                objectFit: "contain"
                            }} 
                        />
                    )}
                    <MuiIconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "white",
                            bgcolor: "rgba(0,0,0,0.5)",
                            "&:hover": {
                                bgcolor: "rgba(0,0,0,0.7)"
                            }
                        }}
                    >
                        <Close />
                    </MuiIconButton>
                </DialogContent>
            </Dialog>
            
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
                    z-index: 1;
                }
                .left { left: 10px; }
                .right { right: 10px; }
                `}
            </style>
        </Box>
    );
};

export default Gallery;