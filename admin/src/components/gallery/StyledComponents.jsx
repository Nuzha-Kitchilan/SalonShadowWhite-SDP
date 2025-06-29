import { styled } from "@mui/material/styles";
import { Button, Card } from "@mui/material";


export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#BEAF9B",
  color: "#fff",
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 500,
  borderRadius: "8px",
  padding: "10px 24px",
  boxShadow: "0 4px 10px rgba(190, 175, 155, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#A89683",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
  },
}));

export const FileInput = styled('input')({
  display: 'none',
});

export const UploadButton = styled('label')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(190, 175, 155, 0.1)',
  border: '2px dashed rgba(190, 175, 155, 0.5)',
  borderRadius: '8px',
  padding: '20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginTop: '16px',
  '&:hover': {
    backgroundColor: 'rgba(190, 175, 155, 0.15)',
    borderColor: 'rgba(190, 175, 155, 0.7)',
  },
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(190, 175, 155, 0.2)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  border: "1px solid rgba(190, 175, 155, 0.3)",
  background: "linear-gradient(to right, #f9f5f0, #ffffff)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 16px rgba(190, 175, 155, 0.3)",
  },
}));