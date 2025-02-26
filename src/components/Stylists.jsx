import { useEffect, useState } from "react";
import axios from "axios";
import { 
    Card, CardContent, Typography, Grid, IconButton, Avatar, 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button 
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Stylists = () => {
    const [stylists, setStylists] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedStylist, setSelectedStylist] = useState(null);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        username: "",
        role: "",
        house_no: "",
        street: "",
        city: "",
        phone_numbers: [""], // Store phone numbers as an array
        profile_url: ""
    });

    useEffect(() => {
        axios.get("http://localhost:5001/api/stylists")
            .then(response => setStylists(response.data))
            .catch(error => console.error("Error fetching stylists:", error));
    }, []);

    const handleEdit = (stylist) => {
        setSelectedStylist(stylist);
        setFormData({
            ...stylist,
            phone_numbers: stylist.phone_numbers ? stylist.phone_numbers.split(",") : [""] // Split phone numbers to an array
        });
        setOpenEdit(true);
    };

    const handleDelete = (stylist) => {
        setSelectedStylist(stylist);
        setOpenDelete(true);
    };

    const handleChange = (e) => {
        const { name, value, dataset } = e.target;
        if (name === "phone_numbers") {
            const updatedPhones = [...formData.phone_numbers];
            updatedPhones[dataset.index] = value; // Update the specific phone number
            setFormData({ ...formData, phone_numbers: updatedPhones });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddPhoneNumber = () => {
        setFormData({ ...formData, phone_numbers: [...formData.phone_numbers, ""] });
    };

    const handleRemovePhoneNumber = (index) => {
        const updatedPhones = formData.phone_numbers.filter((_, i) => i !== index);
        setFormData({ ...formData, phone_numbers: updatedPhones });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prevState => ({ ...prevState, profile_url: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveEdit = () => {
        axios.put(`http://localhost:5001/api/stylists/${selectedStylist.stylist_ID}`, formData)
            .then(() => {
                setStylists(stylists.map(stylist => 
                    stylist.stylist_ID === selectedStylist.stylist_ID ? formData : stylist
                ));
                setOpenEdit(false);
            })
            .catch(error => console.error("Error updating stylist:", error));
    };

    const handleConfirmDelete = () => {
        axios.delete(`http://localhost:5001/api/stylists/${selectedStylist.stylist_ID}`)
            .then(() => {
                setStylists(stylists.filter(stylist => stylist.stylist_ID !== selectedStylist.stylist_ID));
                setOpenDelete(false);
            })
            .catch(error => console.error("Error deleting stylist:", error));
    };

    const handleAddStylist = () => {
        axios.post("http://localhost:5001/api/stylists", formData)
            .then(response => {
                setStylists([...stylists, response.data]);
                setOpenAdd(false);
                setFormData({
                    firstname: "",
                    lastname: "",
                    email: "",
                    username: "",
                    role: "",
                    house_no: "",
                    street: "",
                    city: "",
                    phone_numbers: [""], // Reset phone numbers to an empty field
                    profile_url: ""
                });
            })
            .catch(error => console.error("Error adding stylist:", error));
    };

    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12}>
                <Button 
                    onClick={() => setOpenAdd(true)} 
                    sx={{
                        backgroundColor: '#FE8DA1', 
                        color: 'white', 
                        '&:hover': { backgroundColor: '#ff6f91' },
                        marginBottom: '15px'
                    }}
                >
                    Add Stylist
                </Button>
            </Grid>

            {stylists.map(stylist => (
                <Grid item key={stylist.stylist_ID} xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            textAlign: 'center',
                            height: 400,
                            boxShadow: `0 6px 12px rgba(254, 141, 161, 0.8)`,
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: `0 12px 24px rgba(254, 141, 161, 1)`,
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                margin: '20px auto 10px',
                                fontSize: '3rem',
                                backgroundColor: 'lightgray',
                            }}
                            src={stylist.profile_url || ""}
                        >
                            {stylist.firstname ? stylist.firstname[0] : "S"}
                        </Avatar>
                        <CardContent>
                            <Typography variant="h6">{stylist.firstname} {stylist.lastname}</Typography>
                            <Typography variant="body2" color="textSecondary">Role: {stylist.role}</Typography>
                            <Typography variant="body2">Email: {stylist.email}</Typography>
                            <Typography variant="body2">Username: {stylist.username}</Typography>
                            <Typography variant="body2">Address: {stylist.house_no}, {stylist.street}, {stylist.city}</Typography>
                            <Typography variant="body2">Phone: {stylist.phone_numbers ? stylist.phone_numbers.split(",").join(" | ") : "N/A"}</Typography>
                            
                            <div style={{ marginTop: '10px' }}>
                                <IconButton color="success" onClick={() => handleEdit(stylist)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(stylist)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            ))}

            {/* Add Stylist Dialog */}
            <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Stylist</DialogTitle>
                <DialogContent>
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            margin: '10px auto',
                            fontSize: '3rem',
                            backgroundColor: 'lightgray',
                        }}
                        src={formData.profile_url || ""}
                    >
                        {formData.firstname ? formData.firstname[0] : "S"}
                    </Avatar>
                    <Button
                        variant="contained"
                        component="label"
                        sx={{
                            backgroundColor: '#FE8DA1',
                            color: 'white',
                            '&:hover': { backgroundColor: '#ff6f91' },
                            marginBottom: '10px',
                            display: 'block',
                            width: '100%',
                            textAlign: 'center',
                        }}
                    >
                        Choose Picture
                        <input
                            type="file"
                            onChange={handleImageChange}
                            hidden
                        />
                    </Button>
                    <TextField fullWidth label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="Role" name="role" value={formData.role} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="House No" name="house_no" value={formData.house_no} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="Street" name="street" value={formData.street} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} margin="dense" />

                    {/* Render phone number fields */}
                    {formData.phone_numbers.map((phone, index) => (
                        <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                            <TextField
                                fullWidth
                                label={`Phone Number ${index + 1}`}
                                name="phone_numbers"
                                value={phone}
                                onChange={handleChange}
                                data-index={index}
                                margin="dense"
                            />
                            <Button onClick={() => handleRemovePhoneNumber(index)} sx={{ marginLeft: 2, color: 'red' }}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button onClick={handleAddPhoneNumber} sx={{ color: '#FE8DA1' }}>
                        Add Another Phone Number
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAdd(false)} sx={{ backgroundColor: '#FE8DA1', color: 'white', '&:hover': { backgroundColor: '#ff6f91' } }}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddStylist} sx={{ backgroundColor: '#FE8DA1', color: 'white', '&:hover': { backgroundColor: '#ff6f91' } }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Stylist Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Stylist</DialogTitle>
                <DialogContent>
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            margin: '10px auto',
                            fontSize: '3rem',
                            backgroundColor: 'lightgray',
                        }}
                        src={formData.profile_url || ""}
                    >
                        {formData.firstname ? formData.firstname[0] : "S"}
                    </Avatar>
                    <Button
                        variant="contained"
                        component="label"
                        sx={{
                            backgroundColor: '#FE8DA1',
                            color: 'white',
                            '&:hover': { backgroundColor: '#ff6f91' },
                            marginBottom: '10px',
                            display: 'block',
                            width: '100%',
                            textAlign: 'center',
                        }}
                    >
                        Choose Picture
                        <input
                            type="file"
                            onChange={handleImageChange}
                            hidden
                        />
                    </Button>
                    <TextField fullWidth label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="Role" name="role" value={formData.role} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="House No" name="house_no" value={formData.house_no} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="Street" name="street" value={formData.street} onChange={handleChange} margin="dense" />
                    <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} margin="dense" />

                    {/* Render phone number fields */}
                    {formData.phone_numbers.map((phone, index) => (
                        <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                            <TextField
                                fullWidth
                                label={`Phone Number ${index + 1}`}
                                name="phone_numbers"
                                value={phone}
                                onChange={handleChange}
                                data-index={index}
                                margin="dense"
                            />
                            <Button onClick={() => handleRemovePhoneNumber(index)} sx={{ marginLeft: 2, color: 'red' }}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button onClick={handleAddPhoneNumber} sx={{ color: '#FE8DA1' }}>
                        Add Another Phone Number
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)} sx={{ backgroundColor: '#FE8DA1', color: 'white', '&:hover': { backgroundColor: '#ff6f91' } }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} sx={{ backgroundColor: '#FE8DA1', color: 'white', '&:hover': { backgroundColor: '#ff6f91' } }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Stylist Confirmation */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Are you sure you want to delete this stylist?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)} sx={{ color: 'Blue' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} sx={{ color: 'Red' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default Stylists;
