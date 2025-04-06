import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Box, Link, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePhoneChange = (index, value) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

  const handleAddPhone = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const handleRemovePhone = (index) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers.splice(index, 1);
    setPhoneNumbers(newPhoneNumbers);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Filter out empty phone numbers
    const filteredPhoneNumbers = phoneNumbers.filter(phone => phone.trim() !== "");

    // Match case with backend expectations (firstname vs firstName)
    const data = {
      firstname: firstName,  // Changed to match backend
      lastname: lastName,    // Changed to match backend
      phoneNumbers: filteredPhoneNumbers,
      email,
      username,
      password,
    };

    try {
      const response = await axios.post("http://localhost:5001/api/customers/register", data);
      console.log("Registration successful:", response.data);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleRegister}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Grid>

          {phoneNumbers.map((phone, index) => (
            <Grid item xs={12} key={index} sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                label={`Phone Number ${index + 1}`}
                fullWidth
                value={phone}
                onChange={(e) => handlePhoneChange(index, e.target.value)}
                required={index === 0}
              />
              <IconButton
                color="error"
                onClick={() => handleRemovePhone(index)}
                disabled={phoneNumbers.length === 1}
              >
                <RemoveCircle />
              </IconButton>
              {index === phoneNumbers.length - 1 && (
                <IconButton color="primary" onClick={handleAddPhone}>
                  <AddCircle />
                </IconButton>
              )}
            </Grid>
          ))}

          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              type="password"
              label="Password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Register
            </Button>
          </Grid>
        </Grid>
      </form>

      <Box sx={{ marginTop: 2 }}>
        <Typography>
          Already have an account?{" "}
          <Link href="/login" underline="hover">
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;