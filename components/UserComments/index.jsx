import React, { useState, useEffect } from "react";
import { Card, CardMedia, Typography, Grid, Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import axios from 'axios';

function UserComments( {userId, advancedFeaturesEnabled }) {

  const [users, setUsers] = useState(null); // State to hold the user data
  const [error, setError] = useState(null); // State to handle error
  const [photosWithUserComment, setPhotosWithUserComment] = useState([]);
  const navigate = useNavigate();

  function handleCommentCardClick(photoUserId, photoId) {
    navigate(`/photos/${photoUserId}/${photoId}`);
  }

  useEffect(() => {
    if (!advancedFeaturesEnabled) {
      navigate(`/users/${userId}`);
    }
  }, [advancedFeaturesEnabled, navigate]);

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
  
    const fetchPhotosWithUserComments = async () => {
      try {
        // Fetch photos for all users in parallel
        const photoRequests = users.map((user) => axios.get(`/photosOfUser/${user._id}`));
  
        const photoResults = await Promise.all(photoRequests);
  
        const initialStats = [];
  
        // Process each user's photos
        photoResults.forEach((result) => {
          const photos = result.data;
  
          // Find all photos with comments from the current user
          photos.forEach((photo) => {
            photo.comments.forEach((comment) => {
              const commenterId = comment.user._id;
              if (commenterId === userId && !initialStats.includes(photo)) {
                initialStats.push(photo);
              }
            });
          });
        });
  
        setPhotosWithUserComment(initialStats); // Set the photos with comments from the user
      } catch (e) {
        console.error(`Failed to fetch photos for users`, e);
      }
    };
  
    fetchPhotosWithUserComments();
  }, [users, userId]);
  

  // Handle error state
  if (error) {
    return <div>{error}</div>; 
  }

  if (!photosWithUserComment) {
    return null;
  }

  const photoCard = photosWithUserComment.map((photo) => {
    const allComments = photo.comments;
    const comments = allComments.filter((comment) => comment.user._id === userId);

    const commentCards = comments.map((comment) => {
      const { _id: commentId, date_time: commentDateTime, comment: commentText } = comment;
      // const { _id: commentUserId, first_name: commentUserFirstName, last_name: commentUserLastName } = user;

      const formattedCommentDateTime = new Date(commentDateTime).toLocaleString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
      }); 

      return (
        <Card sx={{ maxWidth: 600, marginBottom: 2, padding: 1 }} key={commentId}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item >
              <CardMedia
                component="img"
                image={`/images/${photo.file_name}`}
                alt={`Photo by user ${userId}`}
                sx={{
                  width: 50, 
                  height: 50, 
                  borderRadius: 1, 
                  cursor: 'pointer', 
                  '&:hover': {
                    opacity: 0.8, 
                  }
                }}
                onClick={() => handleCommentCardClick(photo.user_id, photo._id)}
                
              />
            </Grid>
        
        {/* Right side: Comment text */}
            <Grid item xs>
              <Box key={commentId} className="comment-body"
                sx={{cursor: 'pointer', 
                  '&:hover': {
                  opacity: 0.8, 
                  }}}
                onClick={() => handleCommentCardClick(photo.user_id, photo._id)}>
                <Typography variant="body2" color="textSecondary">
                  {formattedCommentDateTime}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {commentText}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      );
    });

    return <div key={photo._id}>{commentCards}</div>;
  });

  return (
  <React.Fragment>
    <Typography variant="h6" gutterBottom>
        All Comments
    </Typography>
    <div>
      {photoCard}
    </div>
  </React.Fragment>
  );
}


export default UserComments;