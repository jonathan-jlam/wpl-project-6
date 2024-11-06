import React, { useState, useEffect } from "react";
import { Card, CardMedia, CardContent, Typography, Grid, Button, Link } from "@mui/material";
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'; // Import Router utilities
import "./styles.css";
import axios from 'axios';

function UserPhotos({ userId, advancedFeaturesEnabled }) {
  const { photoId } = useParams(); // Get photoId from URL
  const navigate = useNavigate(); 
  const [photos, setPhotos] = useState(null); // State to hold the user photos
  const [error, setError] = useState(null); // State to handle error
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // To track current photo index in advanced mode

  // Fetch the user photos 
  useEffect(() => {
    axios.get(`/photosOfUser/${userId}`)
      .then((result) => {
        setPhotos(result.data); 
        // Set the index if a photoId is in the URL
        if (photoId) {
          const index = result.data.findIndex(photo => photo._id === photoId);
          setCurrentPhotoIndex(index !== -1 ? index : 0); 
        }
      })
      .catch((e) => {
        setError(`Error ${e.status}: ${e.statusText}`); // Set error message in state
      });
  }, [userId, photoId]); // Run when userId or photoId changes

  // Navigate to the first photo's URL when Advanced Features is turned on
  useEffect(() => {
    if (advancedFeaturesEnabled && photos && !photoId) {
      // Navigate to the URL of the first photo
      const firstPhotoId = photos[0]?._id;
      if (firstPhotoId) {
        navigate(`/photos/${userId}/${firstPhotoId}`);
      }
    }
  }, [advancedFeaturesEnabled, photos, photoId, userId, navigate]);

  // Navigate to the gallery view URL when Advanced Features is turned off
  useEffect(() => {
    if (!advancedFeaturesEnabled && photoId) {
      navigate(`/photos/${userId}`);
    }
  }, [advancedFeaturesEnabled, photoId, userId, navigate]);

  // Handle error state
  if (error) {
    return <div>{error}</div>; 
  }

  if (!photos) {
    return null;
  }

  // Single-photo view with stepper when advanced features are on
  if (advancedFeaturesEnabled) {
    const currentPhoto = photos[currentPhotoIndex]; // Get the current photo
    const { date_time: photoDateTime, file_name, comments } = currentPhoto;

    // Format the photo date/time
    const formattedPhotoDateTime = new Date(photoDateTime).toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
    });

    // Navigate to the previous photo
    const handlePrevPhoto = () => {
      if (currentPhotoIndex > 0) {
        const prevIndex = currentPhotoIndex - 1;
        setCurrentPhotoIndex(prevIndex);
        navigate(`/photos/${userId}/${photos[prevIndex]._id}`);
      }
    };

    // Navigate to the next photo
    const handleNextPhoto = () => {
      if (currentPhotoIndex < photos.length - 1) {
        const nextIndex = currentPhotoIndex + 1;
        setCurrentPhotoIndex(nextIndex);
        navigate(`/photos/${userId}/${photos[nextIndex]._id}`);
      }
    };

    return (
      <div className="single-photo-view">
        <Typography variant="h6" gutterBottom>
          Single-Photo View
        </Typography>

        <Grid container justifyContent="center" alignItems="center">
          {/* Left arrow */}
          <Grid item>
            <Button 
              onClick={handlePrevPhoto}
              disabled={currentPhotoIndex === 0}
              sx={{fontSize: 34}}
            >
              {"<"}
            </Button>
          </Grid>

          {/* Photo display */}
          <Grid item>
            <Card sx={{ maxWidth: 600, marginBottom: 2 }}>
              <CardMedia
                component="img"
                image={`/images/${file_name}`}
                alt={`Photo by user ${userId}`}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {formattedPhotoDateTime}
                </Typography>

                {/* Display comments */}
                {Array.isArray(comments) && comments.length > 0 ? (
                  <div>
                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                      Comments:
                    </Typography>
                    {comments.map((comment) => {
                      const { _id: commentId, date_time: commentDateTime, comment: commentText, user } = comment;
                      const { _id: commentUserId, first_name: commentUserFirstName, last_name: commentUserLastName } = user;

                      const formattedCommentDateTime = new Date(commentDateTime).toLocaleString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
                      });

                      return (
                        <div key={commentId} className="comment-body">
                          <Typography variant="body2" color="textSecondary">
                            {formattedCommentDateTime}
                          </Typography>
                          <Typography variant="body2" color="textPrimary">
                            {commentText}
                          </Typography>
                          <Typography variant="body2">
                            ~
                            <Link component={RouterLink} to={`/users/${commentUserId}`}>
                              {`${commentUserFirstName} ${commentUserLastName}`}
                            </Link>
                          </Typography>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                    No comments available.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right arrow */}
          <Grid item>
            <Button 
              onClick={handleNextPhoto}
              disabled={currentPhotoIndex === photos.length - 1}
              sx={{fontSize: 34}}
            >
              {">"}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }

  // No advanced features, so show all photos (gallery view)
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        All Photos
      </Typography>
      <Grid container spacing={2}>
        {photos.map((photo) => {
          const { _id: pid, date_time: photoDateTime, file_name, comments } = photo;

          const formattedPhotoDateTime = new Date(photoDateTime).toLocaleString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
          });

          return (
            <Grid item key={pid} xs={12} sm={6} md={4}>
              <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
                <CardMedia
                  component="img"
                  image={`/images/${file_name}`}
                  alt={`Photo by user ${userId}`}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {formattedPhotoDateTime}
                  </Typography>

                  {Array.isArray(comments) && comments.length > 0 ? (
                    <div>
                      <Typography variant="body1" sx={{ marginTop: 1 }}>
                        Comments:
                      </Typography>
                      {comments.map((comment) => {
                        const { _id: commentId, date_time: commentDateTime, comment: commentText, user } = comment;
                        const { _id: commentUserId, first_name: commentUserFirstName, last_name: commentUserLastName } = user;

                        const formattedCommentDateTime = new Date(commentDateTime).toLocaleString('en-US', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric',
                        });

                        return (
                          <div key={commentId} className="comment-body">
                            <Typography variant="body2" color="textSecondary">
                              {formattedCommentDateTime}
                            </Typography>
                            <Typography variant="body2" color="textPrimary">
                              {commentText}
                            </Typography>
                            <Typography variant="body2">
                              ~
                              <Link component={RouterLink} to={`/users/${commentUserId}`}>
                                {`${commentUserFirstName} ${commentUserLastName}`}
                              </Link>
                            </Typography>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                      No comments available.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default UserPhotos;
