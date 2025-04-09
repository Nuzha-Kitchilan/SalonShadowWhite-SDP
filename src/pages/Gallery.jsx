import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, IconButton, Dialog, DialogContent } from "@mui/material";
import { Close } from "@mui/icons-material";
import galleryImage from "../assets/gallery.png";

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
                position: "relative",
                width: "100%",
                overflowX: "hidden",
                backgroundColor: "#f2f2f2"
            }}
        >
            {/* Full-width Header Image */}
            <Box sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '200px', sm: '300px', md: '400px' },
                overflow: 'hidden',
                padding: 0, // Ensure there's no padding that could create space on the sides
                margin: 0, // Remove any margin from the header container
            }}>
                <Box
                    component="img"
                    src={galleryImage}
                    alt="Gallery Banner"
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </Box>

            {/* Gallery Grid */}
            <Box sx={{ position: "relative", px: { xs: 1, md: 2 }, my: 4 }}>
                <Box
                    className="gallery-grid"
                    sx={{
                        display: "grid",
                        gap: "10px",
                        gridTemplateColumns: {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(3, 1fr)",
                            md: "repeat(4, 1fr)"
                        },
                        gridAutoRows: "minmax(200px, auto)",
                        justifyContent: "center",
                        maxWidth: "100%",
                        mx: "auto",
                    }}
                >
                    {images.length > 0 ? (
                        images.map((image, index) => (
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
                                    height: "auto",
                                    width: "100%",
                                }}
                                onClick={() => handleImageClick(image)}
                            />
                        ))
                    ) : (
                        Array(6).fill(0).map((_, index) => (
                            <Box
                                key={index}
                                className="gallery-item"
                                sx={{
                                    backgroundColor: "#e0e0e0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "8px",
                                    height: "100%",
                                }}
                            >
                                <Typography color="text.secondary">Loading...</Typography>
                            </Box>
                        ))
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
