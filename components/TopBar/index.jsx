import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";

function TopBar({ userId, advancedFeaturesEnabled, setAdvancedFeaturesEnabled }) {
  const [thisUser, setThisUser] = useState(null); // State to hold the user data
  const [error, setError] = useState(null); // State to handle error
  const [topBarContent, setTopBarContent] = useState("Photosharing App"); // Default text for TopBar
  const [version, setVersion] = useState(-1);
  const url = useLocation();
  const [isViewingWhat , setIsViewingWhat] = useState("");
  //const isViewingPhotos = url.pathname.includes("/photos") ? "Photos of " : "";
  useEffect(() => {
    if (url.pathname.includes("/photos")) {
      setIsViewingWhat("Photos of ");
    } else if (url.pathname.includes("/comments")) {
      setIsViewingWhat("Comments by ");
    } else {
      setIsViewingWhat("");
    }
  }, [url]);

  // Fetch user data when userId changes
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const result = await axios.get(`/user/${userId}`);
          setThisUser(result.data); // Set the user data in state
        } catch (e) {
          setError(`Error ${e.status}: ${e.statusText}`); // Set error message in state
        }
      }
    };

    fetchData();
  }, [userId]); // Only re-run the effect when userId changes

  // Fetch version
  useEffect(() => {
    axios.get(`/test/info`)
      .then((result) => {
        setVersion(result.data); // Set version in state
      })
      .catch((e) => {
        setError(`Error ${e.status}: ${e.statusText}`); // Set error message in state
      });
  }, []);  

  // Update top bar content based on location and user data
  useEffect(() => {
    if (url.pathname === "/") {
      // Reset to "Photosharing App" when on the home page
      setTopBarContent("Photosharing App");
    } else if (thisUser) {
      // Show user details when on user pages
      const { first_name, last_name } = thisUser;
      setTopBarContent(`${isViewingWhat}${first_name} ${last_name}`);
    }
  }, [url, thisUser, isViewingWhat]);

  // Toggle handler for the advanced features checkbox
  const handleCheckboxChange = (event) => {
    setAdvancedFeaturesEnabled(event.target.checked);
  };

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 6 }}>
          Jonathan Lam 
        </Typography>
        <Typography sx={{ flexGrow: 1}}>
          {`Version: ${version.__v}`}
        </Typography>

        {/* Checkbox for advanced features */}
        <FormControlLabel
          control={(
            <Checkbox
              checked={advancedFeaturesEnabled}
              onChange={handleCheckboxChange}
              color="secondary"
            />
          )}
          label="Enable Advanced Features"
        />

        <Typography variant="h6">
          {topBarContent}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
