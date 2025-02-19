import React from 'react'
// import { UseSelector, useSelector } from 'react-redux/es/hooks/useSelector'
import { useNavigate } from 'react-router-dom'
import { RiEditBoxLine } from "react-icons/ri"
import { formatDate  } from "../../utils/formatDate"
// import { Button } from '@material-tailwind/react'
import { useSelector } from 'react-redux'
// import React from "react";
import { Avatar, Typography, Grid, Paper, Divider } from "@mui/material";
import { Email, Phone, LocationOn, Male,Person, CalendarToday } from "@mui/icons-material";
import { Button } from '@material-tailwind/react'
// import React from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Avatar, Typography, Button, Grid, Paper, Divider } from "@mui/material";
// import { Email, Phone, LocationOn } from "@mui/icons-material";



const Profile = () => {
    const user = useSelector((state)=> state.profile.data)
    console.log(user)
    const navigate = useNavigate();
    
  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>

        <Paper
          elevation={3}
          style={{
            maxWidth: "800px",
            margin: "20px auto",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          {/* Header Section */}
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                src={user?.avatar?.secure_url } // Use dynamic avatar URL
                alt="Profile Picture"
                style={{ width: "100px", height: "100px" }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h5" component="h2">
                {user?.fullName } {/* Display user's name */}
              </Typography>
              
            </Grid>
            <Grid item>
              
            </Grid>
          </Grid>
    
          <Divider style={{ margin: "20px 0" }} />
    
          {/* Info Section */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <Email style={{ verticalAlign: "middle", marginRight: "8px" }} />
                {user?.email } {/* Dynamic email */}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <Phone style={{ verticalAlign: "middle", marginRight: "8px" }} />
                {user?.additionalDetails?.contact || "add contact"} {/* Dynamic phone */}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <Person style={{ verticalAlign: "middle", marginRight: "8px" }} />
                {user?.additionalDetails?.gender} {/* Dynamic location */}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">
            <CalendarToday style={{ verticalAlign: "middle", marginRight: "8px" }} /> {/* Date of Birth icon */}
            {user?.additionalDetails?.dateOfBirth } {/* Dynamic Date of Birth */}
          </Typography>
        </Grid>
          </Grid>
    
          <Divider style={{ margin: "20px 0" }} />
    
          {/* Additional Details */}
          <Typography variant="h6" gutterBottom>
            About
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {user?.additionalDetails?.about }
          </Typography>
        </Paper>
        <Button onClick={()=>{navigate("/dashboard/settings")}} className='text-black bg-white'>edit</Button>
        </div>
      
    
  );
};



export default Profile