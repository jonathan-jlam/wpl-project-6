import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Routes, useParams } from "react-router-dom";
import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";

function UserDetailRoute({ setUserId, advancedFeaturesEnabled, setAdvancedFeaturesEnabled }) {
  const { userId } = useParams();

  useEffect(() => {
    setUserId(userId); // Set the userId
  }, [userId, setUserId]);

  // Return User Detail component
  return (
    <UserDetail
      userId={userId}
      advancedFeaturesEnabled={advancedFeaturesEnabled}
      setAdvancedFeaturesEnabled={setAdvancedFeaturesEnabled}
    />
  );
}

function UserPhotosRoute({ setUserId, advancedFeaturesEnabled, setAdvancedFeaturesEnabled }) {
  const { userId, photoId } = useParams();

  useEffect(() => {
    setUserId(userId);
    
    // Automatically enable Advanced Features if a photoId is in the URL
    if (photoId) {
      setAdvancedFeaturesEnabled(true);
    }
  }, [userId, photoId, setUserId, setAdvancedFeaturesEnabled]);

  return (
    <UserPhotos
      userId={userId}
      photoId={photoId}
      advancedFeaturesEnabled={advancedFeaturesEnabled}
    />
  );
}

function UserCommentsRoute({ setUserId, advancedFeaturesEnabled, setAdvancedFeaturesEnabled }) {
  const { userId } = useParams();

  useEffect(() => {
    setUserId(userId);
    
    setAdvancedFeaturesEnabled(true);
    
  }, [userId, setUserId, setAdvancedFeaturesEnabled]);

  return (
    <UserComments
      userId={userId}
      advancedFeaturesEnabled={advancedFeaturesEnabled}
    />
  );

}

function PhotoShare() {
  const [userId, setUserId] = useState(null); // State to hold userid
  const [advancedFeaturesEnabled, setAdvancedFeaturesEnabled] = useState(false); // State to hold AF status

  return (
    <HashRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar
              userId={userId}
              advancedFeaturesEnabled={advancedFeaturesEnabled}
              setAdvancedFeaturesEnabled={setAdvancedFeaturesEnabled}
            />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList advancedFeaturesEnabled={advancedFeaturesEnabled}/>
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item" sx={{ height: 'auto', minHeight: '90vh', padding: 2 }}>
              <Routes>
                <Route
                  path="/users/:userId"
                  element={<UserDetailRoute setUserId={setUserId} advancedFeaturesEnabled={advancedFeaturesEnabled} setAdvancedFeaturesEnabled={setAdvancedFeaturesEnabled} />}
                />
                <Route
                  path="/photos/:userId"
                  element={<UserPhotosRoute setUserId={setUserId} advancedFeaturesEnabled={advancedFeaturesEnabled} setAdvancedFeaturesEnabled={setAdvancedFeaturesEnabled} />}
                />
                <Route
                  path="/photos/:userId/:photoId"
                  element={<UserPhotosRoute setUserId={setUserId} advancedFeaturesEnabled={advancedFeaturesEnabled} setAdvancedFeaturesEnabled={setAdvancedFeaturesEnabled} />}
                />
                <Route path="/users" element={<UserList />} />
                <Route 
                  path="/comments/:userId"
                  element={<UserCommentsRoute setUserId={setUserId} advancedFeaturesEnabled={advancedFeaturesEnabled} setAdvancedFeaturesEnabled={setAdvancedFeaturesEnabled} />}
                />
                <Route path="/" element={(
                  <Typography variant="body1">
                  Welcome to the Photosharing app! Click on a user&apos;s name on the 
                  left to view their details and photos.
                  </Typography>
                )} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </HashRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("photoshareapp"));
root.render(<PhotoShare />);
