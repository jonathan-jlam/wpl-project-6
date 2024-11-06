import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge, Divider, List, ListItemButton, ListItemText, Typography, Box, IconButton, ListItem} from "@mui/material";
import "./styles.css";
import axios from 'axios';

function UserList({ advancedFeaturesEnabled}) {
  const [users, setUsers] = useState(null); // State to hold the user data
  const [error, setError] = useState(null); // State to handle error
  const [userStats, setUserStats] = useState({});

  // Fetch the user data 
  useEffect(() => {
    axios.get(`/user/list`)
      .then((result) => {
        setUsers(result.data); // Set the user data in state
      })
      .catch((e) => {
        setError(`Error ${e.status}: ${e.statusText}`); // Set error message in state
      });
  }, []); 

  useEffect(() => {
    if (!users) return; // Skip if users not loaded yet
  
    const fetchUserPhotosAndCalculateStats = async () => {
      const initialStats = users.reduce((acc, user) => {
        acc[user._id] = { photoCount: 0, commentCount: 0 };
        return acc;
      }, {});
  
      try {
        // Fetch photos for all users in parallel
        const photoRequests = users.map((user) => axios.get(`/photosOfUser/${user._id}`));
  
        const photoResults = await Promise.all(photoRequests);
  
        // Process each user's photos and update stats
        photoResults.forEach((result, index) => {
          const userId = users[index]._id;
          const photos = result.data;
  
          // Increment photo count for the user
          initialStats[userId].photoCount += photos.length;
  
          // Count comments across all photos
          photos.forEach((photo) => {
            photo.comments.forEach((comment) => {
              const commenterId = comment.user._id;
              // Increment comment count for the commenter
              if (initialStats[commenterId]) {
                initialStats[commenterId].commentCount += 1;
              } else {
                // If a commenter isn't in the users list, initialize them
                initialStats[commenterId] = { photoCount: 0, commentCount: 1 };
              }
            });
          });
        });
  
        setUserStats(initialStats); // Set the final photo and comment counts
      } catch (e) {
        console.error("Failed to fetch photos for users", e);
      }
    };
  
    fetchUserPhotosAndCalculateStats();
  }, [users]);
  

  if (!users) {
    return null; 
  }

  // Return an error code in place if there is an error
  if (error) {
    return <div>{error}</div>; 
  }

  if (advancedFeaturesEnabled) {
    // Create the list of users
    const userList = users.map((user) => {
      const userFullName = `${user.first_name} ${user.last_name}`;
      const userId = user._id;
      const stats = userStats[userId] || { photoCount: null, commentCount: null };
      
      return (
        <React.Fragment key={userId}>
          <ListItem sx={{ position: 'relative' }}>
            <ListItemButton component={Link} to={`/users/${userId}`}>
              <ListItemText primary={userFullName} />
            </ListItemButton>
          
            <Box sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 3 }}>
              <IconButton component={Link} to={`/users/${userId}`} size="small">
                <Badge badgeContent={stats.photoCount} sx={{
            '& .MuiBadge-badge': {
              backgroundColor: 'green',
              color: 'white',
            },
          }} />
              </IconButton>
              <IconButton component={Link} to={`/comments/${userId}`} size="small">
                <Badge badgeContent={stats.commentCount} sx={{
            '& .MuiBadge-badge': {
              backgroundColor: 'red',
              color: 'white',
              '&:hover': {
                opacity: 0.8, 
              }
            },
          }}/>
              </IconButton>
            </Box>
          </ListItem>
          <Divider />
        </React.Fragment>
      );
    });

    // Return the rendered list
    return (
      <div>
        <Typography variant="h6">
          User List
        </Typography>
        <List component="nav">
          {userList} 
        </List>
      </div>
    );
  }

  const userList = users.map((user) => {
    const userFullName = `${user.first_name} ${user.last_name}`;
    const userId = user._id;

    return (
      <React.Fragment key={userId}>
        <ListItemButton component={Link} to={`/users/${userId}`}>
          <ListItemText primary={userFullName} />
        </ListItemButton>
        <Divider />
      </React.Fragment>
    );
  });

  // Return the rendered list
  return (
    <div>
      <Typography variant="h6">
        User List
      </Typography>
      <List component="nav">
        {userList} 
      </List>
    </div>
  );
}

export default UserList;
