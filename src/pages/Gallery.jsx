import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, IconButton, Dialog, DialogContent, Container } from "@mui/material";
import { Close } from "@mui/icons-material";
import galleryImage from "../assets/gallery.png";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5001/api/gallery")
            .then((response) => {
                if (response.data.success) {
                    setImages(response.data.data);
                } else {
                    console.error("Error: Unable to fetch images");
                }
            })
            .catch((error) => console.error("Error fetching images:", error));
    }, []);

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
                width: "100%", 
                maxWidth: "100vw", 
                minHeight: "100vh",
                overflowX: "hidden",
                position: "relative",
                bgcolor: "#faf5f0",
                display: "flex",
                flexDirection: "column"
            }}
        >
            {/* Top Banner */}
            <Box sx={{
                height: { xs: "300px", md: "400px" },
                width: "100%",
                position: "relative",
                overflow: "hidden",
            }}>
                <Box
                    component="img"
                    src={galleryImage}
                    alt="Gallery Banner"
                    sx={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover",
                        display: "block" 
                    }}
                />
            </Box>

            {/* Gallery Content */}
            <Box sx={{
                flex: 1,
                py: 4,
                px: { xs: 2, md: 4 },
                width: "100%",
            }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" component="h2" sx={{ 
                        mb: 4,
                        textAlign: "center",
                        fontWeight: 500
                    }}>
                        Our Work Gallery
                    </Typography>
                    
                    <Box sx={{
                        display: "grid",
                        gap: { xs: 2, md: 3 },
                        gridTemplateColumns: {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(3, 1fr)",
                            md: "repeat(4, 1fr)",
                        },
                    }}>
                        {images.length > 0 ? (
                            images.map((image, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        backgroundImage: `url(${image.image_url})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        borderRadius: 2,
                                        aspectRatio: "1/1",
                                        filter: "grayscale(100%)",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "scale(1.03)",
                                            boxShadow: 3,
                                            filter: "grayscale(0%)"
                                        }
                                    }}
                                    onClick={() => handleImageClick(image)}
                                />
                            ))
                        ) : (
                            Array(8).fill(0).map((_, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        backgroundColor: "grey.200",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 2,
                                        aspectRatio: "1/1"
                                    }}
                                >
                                    <Typography color="text.secondary">Loading...</Typography>
                                </Box>
                            ))
                        )}
                    </Box>
                </Container>
            </Box>

            {/* Fullscreen Image Modal */}
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: "black",
                        height: "100vh",
                        m: 0,
                        maxHeight: "none",
                        width: "100vw",
                        maxWidth: "none",
                        borderRadius: 0,
                    },
                }}
            >
                <DialogContent sx={{
                    p: 0,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {selectedImage && (
                        <Box sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <img
                                src={selectedImage.image_url}
                                alt="Full"
                                style={{
                                    maxHeight: '100%',
                                    maxWidth: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    )}
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            color: "white",
                            bgcolor: "rgba(0,0,0,0.5)",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogContent>
            </Dialog>

            {/* Global Styles */}
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
                `}
            </style>
        </Box>
    );
};

export default Gallery;