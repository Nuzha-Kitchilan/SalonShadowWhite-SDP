import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, IconButton, Dialog, DialogContent } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Close } from "@mui/icons-material";
import galleryImage from "../assets/gallery1.jpeg";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5001/api/gallery")
            .then((response) => setImages(response.data))
            .catch((error) => console.error("Error fetching images:", error));
    }, []);

    const layoutClasses = ["large", "small framed", "small", "medium", "small framed", "medium"];

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
        <Box 
            sx={{ 
                textAlign: "center", 
                mt: 0, 
                px: 2, // Reduce padding to prevent overflow
                position: "relative", 
                width: "100%", 
                maxWidth: "100vw", // Ensure it doesn't exceed viewport width
                overflowX: "hidden", // Prevent horizontal scrolling
                background: "linear-gradient(to bottom, #f5d6b4, #e29587)" 
            }}
        >
            {/* Header Section */}
            <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                mb: 0, 
                width: "100%",
                flexDirection: { xs: "column", md: "row" },
                gap: 2
            }}>
                {/* Title */}
                <Box sx={{ 
                    width: { xs: "100%", md: "30%" }, 
                    pr: { xs: 0, md: 2 },
                    textAlign: { xs: "center", md: "right" }
                }}>
                    <Box sx={{
                        backgroundColor: "rgba(90, 62, 54, 0.85)",
                        padding: { xs: "10px 20px", md: "15px 30px" },
                        borderRadius: "4px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        display: "inline-block",
                    }}>
                        <Typography 
                            variant="h2"
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: { xs: "2.5rem", md: "3.5rem" },
                                color: "#ffffff",
                                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                                margin: 0,
                            }}
                        >
                            Our Gallery
                        </Typography>
                    </Box>
                </Box>

                {/* Image */}
                <Box sx={{ 
                    width: { xs: "100%", md: "70%" },
                    height: { xs: "300px", md: "400px" },
                    overflow: "hidden",
                    borderRadius: "8px",
                }}>
                    <img 
                        src={galleryImage} 
                        alt="Gallery Background" 
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                        }} 
                    />
                </Box>
            </Box>

            {/* Gallery Grid */}

{/* Gallery Grid */}
{/* Gallery Grid */}
{/* Gallery Grid */}
<Box sx={{ position: "relative", px: { xs: 1, md: 2 }, my: 4 }}>
    <Box 
        className="gallery-grid"
        sx={{
            display: "grid",
            gap: "10px",
            gridTemplateColumns: {
                xs: "repeat(2, 1fr)", // 2 columns on small screens
                sm: "repeat(3, 1fr)", // 3 columns on tablets
                md: "repeat(4, 1fr)"  // 4 columns on large screens
            },
            gridAutoRows: "minmax(200px, auto)", // Allow items to grow or shrink based on content
            justifyContent: "center",
            maxWidth: "100%",
            mx: "auto",
        }}
    >
        {images.length > 0 ? (
            images.map((image, index) => {
                return (
                    <Box 
                        key={image.id || index} 
                        className="gallery-item"
                        sx={{
                            backgroundImage: `url(${image.image_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            cursor: "pointer",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            borderRadius: "8px",
                            "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                            },
                            height: "auto", // Let height adjust naturally to the image aspect ratio
                            width: "100%",  // Allow width to stretch
                        }}
                        onClick={() => handleImageClick(image)}
                    />
                );
            })
        ) : (
            Array(6).fill(0).map((_, index) => {
                return (
                    <Box 
                        key={index} 
                        className="gallery-item"
                        sx={{
                            backgroundColor: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            height: "100%", // Keep placeholder height flexible
                        }}
                    >
                        <Typography color="text.secondary">Loading...</Typography>
                    </Box>
                );
            })
        )}
    </Box>
</Box>








            {/* Modal for Full Image View */}
            <Dialog 
                open={modalOpen} 
                onClose={handleCloseModal} 
                maxWidth="lg" 
                fullWidth
                PaperProps={{ sx: { bgcolor: "black", height: "80vh" } }}
            >
                <DialogContent 
                    sx={{ 
                        p: 0, 
                        position: "relative",
                        height: "100%",
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
                    <IconButton
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
                        aria-label="Close image view"
                    >
                        <Close />
                    </IconButton>
                </DialogContent>
            </Dialog>

            {/* Styles */}
            <style>
                {`
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                    overflow-x: hidden;
                }
                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    max-width: 100%;
                    margin: 0 auto;
                }
                .gallery-item {
                    width: 100%;
                    height: 200px;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .large { grid-column: span 2; height: 300px; }
                .medium { height: 250px; }
                .small { height: 150px; }
                .framed { border: 6px solid #a77d5a; box-sizing: border-box; }
                `}
            </style>
        </Box>
    );
};

export default Gallery;
