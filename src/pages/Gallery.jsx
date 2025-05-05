import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, IconButton, Dialog, DialogContent } from "@mui/material";
import { Close } from "@mui/icons-material";
import galleryImage from "../assets/gallery.png";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5001/api/gallery")
            .then((response) => {
                console.log(response.data); // Log the full response object
                if (response.data.success) {
                    setImages(response.data.data); // Store the images in state
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
        <Box sx={{ textAlign: "center", mt: 0, position: "relative", width: "100%", overflowX: "hidden", backgroundColor: "#f2f2f2" }}>
            {/* Full-width Header Image */}
            <Box sx={{ position: 'relative', width: '100%', height: { xs: '200px', sm: '300px', md: '400px' }, overflow: 'hidden' }}>
                <Box component="img" src={galleryImage} alt="Gallery Banner" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>

            {/* Gallery Grid */}
            <Box sx={{ position: "relative", px: { xs: 1, md: 2 }, my: 4 }}>
                <Box sx={{
                    display: "grid",
                    gap: "10px",
                    gridTemplateColumns: {
                        xs: "repeat(2, 1fr)", // 2 per row on small screens
                        sm: "repeat(3, 1fr)", // 3 per row on medium screens
                        md: "repeat(4, 1fr)", // 4 per row on larger screens
                    },
                    gridAutoRows: "minmax(250px, auto)", // Adjusting height for larger images
                    justifyContent: "center",
                    maxWidth: "100%",
                    mx: "auto",
                }}>
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <Box
                                key={index}
                                sx={{
                                    backgroundImage: `url(${image.image_url})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    cursor: "pointer",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    borderRadius: "8px",
                                    height: "400px", // Set a larger height for the images
                                    filter: "grayscale(100%)", // Apply grayscale for black and white effect
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                                    }
                                }}
                                onClick={() => handleImageClick(image)}
                            />
                        ))
                    ) : (
                        Array(6).fill(0).map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    backgroundColor: "#e0e0e0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "8px",
                                    height: "500px", // Adjust the height to match image containers
                                }}
                            >
                                <Typography color="text.secondary">Loading...</Typography>
                            </Box>
                        ))
                    )}
                </Box>
            </Box>

            {/* Modal for Full Image View */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: "black", height: "80vh" } }}>
                <DialogContent sx={{ p: 0, position: "relative", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {selectedImage && (
                        <img
                            src={selectedImage.image_url}
                            alt="Gallery Image"
                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                        />
                    )}
                    <IconButton onClick={handleCloseModal} sx={{ position: "absolute", top: 8, right: 8, color: "white", bgcolor: "rgba(0,0,0,0.5)", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }} aria-label="Close image view">
                        <Close />
                    </IconButton>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Gallery;
