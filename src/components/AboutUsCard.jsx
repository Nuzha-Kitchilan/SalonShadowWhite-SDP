// import React from 'react';
// import { 
//   Box, 
//   Card, 
//   Typography, 
//   Container,
//   Divider,
//   useMediaQuery,
//   useTheme
// } from '@mui/material';

// const AboutUsCard = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   return (
//     <Container maxWidth="lg" sx={{ my: 6, position: 'relative' }}>
//       {/* Background decorative elements */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: { xs: -30, md: -50 },
//           right: { xs: 10, md: 50 },
//           width: { xs: 100, md: 150 },
//           height: { xs: 100, md: 150 },
//           borderRadius: '50%',
//           background: 'radial-gradient(circle, rgba(190,175,155,0.1) 0%, rgba(255,255,255,0) 70%)',
//           zIndex: 0
//         }}
//       />
//       <Box
//         sx={{
//           position: 'absolute',
//           bottom: { xs: -30, md: -50 },
//           left: { xs: 10, md: 50 },
//           width: { xs: 120, md: 180 },
//           height: { xs: 120, md: 180 },
//           borderRadius: '50%',
//           background: 'radial-gradient(circle, rgba(40,37,32,0.05) 0%, rgba(255,255,255,0) 70%)',
//           zIndex: 0
//         }}
//       />

//       {/* Main Card */}
//       <Card
//         elevation={0}
//         sx={{
//           position: 'relative',
//           overflow: 'visible',
//           borderRadius: 4,
//           background: 'linear-gradient(135deg, #ffffff 0%, #faf8f5 100%)',
//           border: '1px solid #eae7e2',
//           boxShadow: '0 10px 30px rgba(40, 37, 32, 0.08)',
//           p: { xs: 2, sm: 4, md: 5 },
//           zIndex: 1
//         }}
//       >
//         {/* Decorative corner element */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             right: 0,
//             width: { xs: 50, md: 80 },
//             height: { xs: 50, md: 80 },
//             background: 'linear-gradient(135deg, transparent 50%, rgba(40, 37, 32, 0.03) 50%)',
//             borderTopRightRadius: 16,
//             zIndex: 0
//           }}
//         />

//         {/* Header */}
//         <Box sx={{ mb: 4, position: 'relative' }}>
//           <Typography 
//             variant="overline" 
//             sx={{ 
//               color: '#BEAF9B', 
//               letterSpacing: 2,
//               fontWeight: 600,
//               fontSize: { xs: '0.7rem', md: '0.8rem' },
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//             }}
//           >
//             OUR STORY
//           </Typography>
          
//           <Typography 
//             variant="h4" 
//             component="h2" 
//             sx={{ 
//               fontWeight: 600,
//               fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
//               color: '#282520',
//               mb: 2,
//               position: 'relative',
//               display: 'inline-block',
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               '&::after': {
//                 content: '""',
//                 position: 'absolute',
//                 bottom: -8,
//                 left: 0,
//                 width: 80,
//                 height: 3,
//                 background: 'linear-gradient(to right, #BEAF9B 0%, rgba(190, 175, 155, 0.3) 100%)',
//                 borderRadius: 2
//               }
//             }}
//           >
//             Salon Shadow White
//           </Typography>
//         </Box>

//         {/* About Us Content */}
//         <Typography 
//           variant="body1" 
//           sx={{ 
//             color: '#3a352e',
//             fontSize: { xs: '0.95rem', md: '1.05rem' },
//             lineHeight: 1.8,
//             mb: 4,
//             maxWidth: 900,
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//           }}
//         >
//           Founded in 2018, Salon Shadow White emerged from a vision to create a space where artistry meets wellness in the world of hairstyling. Our name reflects our philosophy: like shadows that add depth and dimension, we enhance your natural beauty with subtle expertise, while "white" represents our clean, pure approach to beauty and self-care. Located in the heart of the city, our salon has quickly become known for its distinctive blend of forward-thinking techniques and personalized attention that celebrates each client's individuality.
//         </Typography>

//         <Typography 
//           variant="body1" 
//           sx={{ 
//             color: '#3a352e',
//             fontSize: { xs: '0.95rem', md: '1.05rem' },
//             lineHeight: 1.8,
//             mb: 5,
//             maxWidth: 900,
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//           }}
//         >
//           Our team consists of passionate professionals who view their craft not just as a career but as an ongoing artistic journey. Each stylist brings their unique perspective while sharing our collective commitment to excellence. Whether you're seeking a subtle refresh or a bold transformation, at Salon Shadow White, you'll discover an experience that nurtures both your appearance and wellbeing.
//         </Typography>

//         {/* Divider */}
//         {/* <Divider 
//           sx={{ 
//             my: { xs: 4, md: 5 },
//             opacity: 0.8,
//             background: 'linear-gradient(to right, rgba(40, 37, 32, 0.2) 0%, rgba(40, 37, 32, 0.05) 100%)',
//           }} 
//         />

//         {/* Footer quote */}
//         {/* <Box
//           sx={{
//             mt: { xs: 4, md: 6 },
//             p: { xs: 3, md: 4 },
//             borderRadius: 2,
//             background: 'linear-gradient(135deg, rgba(40, 37, 32, 0.02) 0%, rgba(40, 37, 32, 0.06) 100%)',
//             textAlign: 'center',
//             position: 'relative',
//             overflow: 'hidden'
//           }}
//         >
//           <Box 
//             sx={{ 
//               position: 'absolute',
//               top: -15,
//               left: -15,
//               width: 50,
//               height: 50,
//               opacity: 0.1,
//               transform: 'rotate(45deg)',
//               background: '#282520'
//             }} 
//           />
          
//           <Typography 
//             variant="h6" 
//             sx={{ 
//               fontStyle: 'italic',
//               fontSize: { xs: '1rem', md: '1.2rem' },
//               color: '#282520',
//               fontWeight: 500,
//               lineHeight: 1.8,
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//             }}
//           >
//             "At Salon Shadow White, we don't just style hair – we craft experiences that empower you to embrace your authentic beauty."
//           </Typography>
//         </Box>  */}
//       </Card>
//     </Container>
//   );
// };

// export default AboutUsCard;












// import React, { useEffect, useState } from 'react';
// import styled, { keyframes } from 'styled-components';

// // Styled Components
// const fadeIn = keyframes`
//   from { opacity: 0; transform: translateY(20px); }
//   to { opacity: 1; transform: translateY(0); }
// `;

// const shimmer = keyframes`
//   0% { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// `;

// const Container = styled.div`
//   max-width: 1200px;
//   margin: 3rem auto;
//   padding: 0 2rem;
//   position: relative;
  
//   @media (max-width: 768px) {
//     margin: 2rem auto;
//     padding: 0 1rem;
//   }
// `;

// const BackgroundCircle = styled.div`
//   position: absolute;
//   border-radius: 50%;
//   z-index: 0;
  
//   &.top-right {
//     top: -50px;
//     right: 50px;
//     width: 150px;
//     height: 150px;
//     background: radial-gradient(circle, rgba(190, 175, 155, 0.12) 0%, rgba(255, 255, 255, 0) 70%);
    
//     @media (max-width: 768px) {
//       top: -30px;
//       right: 10px;
//       width: 100px;
//       height: 100px;
//     }
//   }
  
//   &.bottom-left {
//     bottom: -50px;
//     left: 50px;
//     width: 180px;
//     height: 180px;
//     background: radial-gradient(circle, rgba(40, 37, 32, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
    
//     @media (max-width: 768px) {
//       bottom: -30px;
//       left: 10px;
//       width: 120px;
//       height: 120px;
//     }
//   }
// `;

// const MainCard = styled.div`
//   position: relative;
//   overflow: visible;
//   border-radius: 16px;
//   background: linear-gradient(135deg, #ffffff 0%, #faf8f5 100%);
//   border: 1px solid #eae7e2;
//   box-shadow: 0 15px 40px rgba(40, 37, 32, 0.08);
//   padding: 3rem;
//   z-index: 1;
//   opacity: 0;
//   animation: ${fadeIn} 0.8s ease-out forwards;
  
//   @media (max-width: 768px) {
//     padding: 1.5rem;
//     border-radius: 12px;
//   }
  
//   &::before {
//     content: '';
//     position: absolute;
//     top: 0;
//     right: 0;
//     width: 80px;
//     height: 80px;
//     background: linear-gradient(135deg, transparent 50%, rgba(40, 37, 32, 0.03) 50%);
//     border-top-right-radius: 16px;
//     z-index: 0;
    
//     @media (max-width: 768px) {
//       width: 50px;
//       height: 50px;
//     }
//   }
// `;

// const FloatingAccent = styled.div`
//   position: absolute;
//   z-index: 2;
  
//   &.accent-1 {
//     top: 30px;
//     right: -10px;
//     width: 25px;
//     height: 25px;
//     background: linear-gradient(135deg, #BEAF9B 0%, #d3c7b8 100%);
//     border-radius: 50%;
//     opacity: 0.7;
//   }
  
//   &.accent-2 {
//     bottom: 50px;
//     left: -15px;
//     width: 40px;
//     height: 40px;
//     border: 2px solid rgba(190, 175, 155, 0.3);
//     border-radius: 50%;
//   }
// `;

// const Header = styled.div`
//   margin-bottom: 2.5rem;
//   position: relative;
// `;

// const Overline = styled.p`
//   color: #BEAF9B;
//   letter-spacing: 3px;
//   font-weight: 600;
//   font-size: 0.8rem;
//   font-family: 'Poppins', 'Roboto', sans-serif;
//   margin-bottom: 0.5rem;
  
//   @media (max-width: 768px) {
//     font-size: 0.7rem;
//     letter-spacing: 2px;
//   }
// `;

// const Title = styled.h2`
//   font-weight: 600;
//   font-size: 2.5rem;
//   color: #282520;
//   margin-bottom: 1.5rem;
//   position: relative;
//   display: inline-block;
//   font-family: 'Poppins', 'Roboto', sans-serif;
  
//   @media (max-width: 768px) {
//     font-size: 1.8rem;
//   }
  
//   &::after {
//     content: "";
//     position: absolute;
//     bottom: -10px;
//     left: 0;
//     width: 80px;
//     height: 3px;
//     background: linear-gradient(to right, #BEAF9B 0%, rgba(190, 175, 155, 0.3) 100%);
//     border-radius: 2px;
//   }
// `;

// const ContentWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 2.5rem;
  
//   @media (max-width: 960px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const ContentColumn = styled.div`
//   &.image-column {
//     position: relative;
//     min-height: 300px;
    
//     @media (max-width: 960px) {
//       order: 2;
//       min-height: 250px;
//     }
//   }
// `;

// const ImagePlaceholder = styled.div`
//   position: relative;
//   width: 100%;
//   height: 100%;
//   background: linear-gradient(135deg, #f5f2ee 0%, #eae7e2 100%);
//   border-radius: 8px;
//   overflow: hidden;
//   box-shadow: 0 10px 25px rgba(40, 37, 32, 0.1);
  
//   &::before {
//     content: '';
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: linear-gradient(90deg, 
//       rgba(255, 255, 255, 0) 0%, 
//       rgba(255, 255, 255, 0.5) 50%, 
//       rgba(255, 255, 255, 0) 100%);
//     background-size: 200% 100%;
//     animation: ${shimmer} 2s infinite;
//   }
// `;

// const Paragraph = styled.p`
//   color: #3a352e;
//   font-size: 1.05rem;
//   line-height: 1.8;
//   margin-bottom: 1.5rem;
//   font-family: 'Poppins', 'Roboto', sans-serif;
  
//   @media (max-width: 768px) {
//     font-size: 0.95rem;
//   }
// `;

// const Divider = styled.div`
//   height: 1px;
//   margin: 2.5rem 0;
//   background: linear-gradient(to right, rgba(40, 37, 32, 0.2) 0%, rgba(40, 37, 32, 0.05) 100%);
//   opacity: 0.8;
// `;

// const QuoteBox = styled.div`
//   margin-top: 2.5rem;
//   padding: 2rem;
//   border-radius: 8px;
//   background: linear-gradient(135deg, rgba(40, 37, 32, 0.02) 0%, rgba(40, 37, 32, 0.06) 100%);
//   text-align: center;
//   position: relative;
//   overflow: hidden;
  
//   &::before {
//     content: '"';
//     position: absolute;
//     top: -20px;
//     left: 20px;
//     font-size: 8rem;
//     opacity: 0.07;
//     font-family: 'Georgia', serif;
//     color: #282520;
//   }
// `;

// const Quote = styled.p`
//   font-style: italic;
//   font-size: 1.2rem;
//   color: #282520;
//   font-weight: 500;
//   line-height: 1.8;
//   font-family: 'Poppins', 'Roboto', sans-serif;
//   position: relative;
//   z-index: 1;
  
//   @media (max-width: 768px) {
//     font-size: 1rem;
//   }
// `;


// const AboutUsCard = () => {
//   const [isVisible, setIsVisible] = useState(false);
  
//   useEffect(() => {
//     // Set a small delay to trigger the animation
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 100);
    
//     return () => clearTimeout(timer);
//   }, []);
  
//   return (
//     <Container>
//       <BackgroundCircle className="top-right" />
//       <BackgroundCircle className="bottom-left" />
      
//       <MainCard style={{ animationDelay: isVisible ? '0s' : '0.5s' }}>
//         <FloatingAccent className="accent-1" />
//         <FloatingAccent className="accent-2" />
        
//         <Header>
//           <Overline>OUR STORY</Overline>
//           <Title>Salon Shadow White</Title>
//         </Header>

//         <ContentWrapper>
//           <ContentColumn>
//             <Paragraph>
//               Founded in 2018, Salon Shadow White emerged from a vision to create a space where artistry meets wellness in the world of hairstyling. Our name reflects our philosophy: like shadows that add depth and dimension, we enhance your natural beauty with subtle expertise, while "white" represents our clean, pure approach to beauty and self-care.
//             </Paragraph>
            
//             <Paragraph>
//               Located in the heart of the city, our salon has quickly become known for its distinctive blend of forward-thinking techniques and personalized attention that celebrates each client's individuality.
//             </Paragraph>
            
//             <Paragraph>
//               Our team consists of passionate professionals who view their craft not just as a career but as an ongoing artistic journey. Each stylist brings their unique perspective while sharing our collective commitment to excellence. Whether you're seeking a subtle refresh or a bold transformation, at Salon Shadow White, you'll discover an experience that nurtures both your appearance and wellbeing.
//             </Paragraph>
//           </ContentColumn>
          
//           <ContentColumn className="image-column">
//             <ImagePlaceholder />
//           </ContentColumn>
//         </ContentWrapper>
        
//         <Divider />
        
       
        
//         <QuoteBox>
//           <Quote>
//             "At Salon Shadow White, we don't just style hair – we craft experiences that empower you to embrace your authentic beauty."
//           </Quote>
//         </QuoteBox>
//       </MainCard>
//     </Container>
//   );
// };

// export default AboutUsCard;
















import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Cup from '../assets/cup.png'

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmerAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 2rem;
  position: relative;

  @media (max-width: 768px) {
    margin: 2rem auto;
    padding: 0 1rem;
  }
`;

const BackgroundCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  z-index: 0;

  &.top-right {
    top: -50px;
    right: 50px;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(190, 175, 155, 0.12) 0%, rgba(255, 255, 255, 0) 70%);

    @media (max-width: 768px) {
      top: -30px;
      right: 10px;
      width: 100px;
      height: 100px;
    }
  }

  &.bottom-left {
    bottom: -50px;
    left: 50px;
    width: 180px;
    height: 180px;
    background: radial-gradient(circle, rgba(40, 37, 32, 0.05) 0%, rgba(255, 255, 255, 0) 70%);

    @media (max-width: 768px) {
      bottom: -30px;
      left: 10px;
      width: 120px;
      height: 120px;
    }
  }
`;

const MainCard = styled.div`
  position: relative;
  overflow: visible;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #faf8f5 100%);
  border: 1px solid #eae7e2;
  box-shadow: 0 15px 40px rgba(40, 37, 32, 0.08);
  padding: 3rem;
  z-index: 1;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out forwards;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.5),
      transparent
    );
    transform: translateX(-100%);
  }

  &:hover::before {
    animation: ${shimmerAnimation} 1.5s infinite;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const FloatingAccent = styled.div`
  position: absolute;
  z-index: 2;

  &.accent-1 {
    top: 30px;
    right: -10px;
    width: 25px;
    height: 25px;
    background: linear-gradient(135deg, #BEAF9B 0%, #d3c7b8 100%);
    border-radius: 50%;
    opacity: 0.7;
  }

  &.accent-2 {
    bottom: 50px;
    left: -15px;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(190, 175, 155, 0.3);
    border-radius: 50%;
  }
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
  position: relative;
`;

const Overline = styled.p`
  color: #BEAF9B;
  letter-spacing: 3px;
  font-weight: 600;
  font-size: 0.8rem;
  font-family: 'Poppins', 'Roboto', sans-serif;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    letter-spacing: 2px;
  }
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 2.5rem;
  color: #282520;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  font-family: 'Poppins', 'Roboto', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, #BEAF9B 0%, rgba(190, 175, 155, 0.3) 100%);
    border-radius: 2px;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const ShimmerEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  transform: translateX(-100%);
  pointer-events: none;
  z-index: 2;
`;

const ContentColumn = styled.div`
  position: relative;
  overflow: hidden;

  &.text-column {
    padding: 1rem;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(190, 175, 155, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(190, 175, 155, 0.2);
    }
    
    &:hover ${ShimmerEffect} {
      animation: ${shimmerAnimation} 1.5s infinite;
    }
  }

  &.image-column {
    position: relative;
    min-height: 300px;

    @media (max-width: 960px) {
      order: 2;
      min-height: 250px;
    }
  }
`;

const ImagePlaceholder = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f2ee 0%, #eae7e2 100%);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(40, 37, 32, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const Paragraph = styled.p`
  color: #3a352e;
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-family: 'Poppins', 'Roboto', sans-serif;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const Divider = styled.div`
  height: 1px;
  margin: 2.5rem 0;
  background: linear-gradient(to right, rgba(40, 37, 32, 0.2) 0%, rgba(40, 37, 32, 0.05) 100%);
  opacity: 0.8;
`;

const QuoteBox = styled.div`
  margin-top: 2.5rem;
  padding: 2rem;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(40, 37, 32, 0.02) 0%, rgba(40, 37, 32, 0.06) 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(190, 175, 155, 0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(190, 175, 155, 0.2);
  }

  &:hover ${ShimmerEffect} {
    animation: ${shimmerAnimation} 1.5s infinite;
  }

  &::before {
    content: '"';
    position: absolute;
    top: -20px;
    left: 20px;
    font-size: 8rem;
    opacity: 0.07;
    font-family: 'Georgia', serif;
    color: #282520;
  }
`;

const Quote = styled.p`
  font-style: italic;
  font-size: 1.2rem;
  color: #282520;
  font-weight: 500;
  line-height: 1.8;
  font-family: 'Poppins', 'Roboto', sans-serif;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AboutUsCard = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      <BackgroundCircle className="top-right" />
      <BackgroundCircle className="bottom-left" />

      <MainCard style={{ animationDelay: isVisible ? '0s' : '0.5s' }}>
        <FloatingAccent className="accent-1" />
        <FloatingAccent className="accent-2" />

        <Header>
          <Overline>OUR STORY</Overline>
          <Title>Salon Shadow White</Title>
        </Header>

        <ContentWrapper>
          <ContentColumn className="text-column">
            <ShimmerEffect />
            <Paragraph>
              Founded in 2018, Salon Shadow White emerged from a vision to create a space where artistry meets wellness in the world of hairstyling. Our name reflects our philosophy: like shadows that add depth and dimension, we enhance your natural beauty with subtle expertise, while "white" represents our clean, pure approach to beauty and self-care.
            </Paragraph>

            <Paragraph>
              Located in the heart of the city, our salon has quickly become known for its distinctive blend of forward-thinking techniques and personalized attention that celebrates each client's individuality.
            </Paragraph>

            <Paragraph>
              Our team consists of passionate professionals who view their craft not just as a career but as an ongoing artistic journey. Each stylist brings their unique perspective while sharing our collective commitment to excellence. Whether you're seeking a subtle refresh or a bold transformation, at Salon Shadow White, you'll discover an experience that nurtures both your appearance and wellbeing.
            </Paragraph>
          </ContentColumn>

          <ContentColumn className="image-column">
            <ImagePlaceholder >
                 <img src={Cup} alt="Salon visual" />
            </ImagePlaceholder>
          </ContentColumn>
        </ContentWrapper>

        <Divider />

        <QuoteBox>
          <ShimmerEffect />
          <Quote>
            "At Salon Shadow White, we don't just style hair – we craft experiences that empower you to embrace your authentic beauty."
          </Quote>
        </QuoteBox>
      </MainCard>
    </Container>
  );
};

export default AboutUsCard;