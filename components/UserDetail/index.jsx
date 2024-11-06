import React, { useState, useEffect } from "react";
import { Typography, Paper, Grid, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import axios from 'axios';

function UserDetail({ userId }) {
  const [thisUser, setThisUser] = useState(null); // State to hold the user data
  const [error, setError] = useState(null); // State to handle error
  const navigate = useNavigate();

  // Fetch user data when userId changes
  useEffect(() => {
    axios.get(`/user/${userId}`)
      .then((result) => {
        setThisUser(result.data); // Set the user data in state
      })
      .catch((e) => {
        setError(`Error ${e.status}: ${e.statusText}`); // Set error message in state
      });
  }, [userId]);

  if (!thisUser) {
    return null; // Return null to render nothing until users are available
  }

  // Return an error code in place if there is an error
  if (error) {
    return <div>{error}</div>;
  }

 
  // Destructure user details
  const { first_name, last_name, location, description, occupation } = thisUser;

  // Return the user detail display
  return (
    <Paper className="user-detail-container" elevation={3}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" className="user-name">
            {`${first_name} ${last_name}`}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" className="user-detail-label">
            <strong>Location:</strong> {location}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body1" className="user-detail-label">
            <strong>Occupation:</strong> {occupation}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" className="user-detail-description">
            <strong>Description:</strong> {description}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            onClick={() => navigate(`/photos/${userId}`)} 
            variant="contained"
            color="primary"
          >
            View Photos
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default UserDetail;
