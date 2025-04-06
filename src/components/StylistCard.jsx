import React from 'react';
import { Grid, Typography, Avatar, Box } from '@mui/material';

const StylistCard = ({ stylist, index }) => {
  const {
    firstname,
    lastname,
    role,
    profile_url,
    bio,
  } = stylist;

  const isEven = index % 2 === 0;

  return (
    <Grid
      container
      spacing={4}
      sx={{ my: 6, alignItems: 'center', flexDirection: isEven ? 'row' : 'row-reverse' }}
    >
      {/* Image Section */}
      <Grid item xs={12} md={4}>
        <Avatar
          alt={`${firstname} ${lastname}`}
          src={profile_url || ''}
          variant="square"
          sx={{
            width: '100%',
            height: { xs: 250, md: 350 },
            objectFit: 'cover',
            borderRadius: 0,
            mx: 'auto',
            fontSize: 64,
            bgcolor: '#ccc',
          }}
        >
          {(!profile_url && firstname) ? firstname[0].toUpperCase() : ''}
        </Avatar>
      </Grid>

      {/* Text Section */}
      <Grid item xs={12} md={8}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          {firstname} {lastname}, {role}
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, textAlign: 'justify' }}
        >
          {bio || 'No biography available for this stylist.'}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default StylistCard;
