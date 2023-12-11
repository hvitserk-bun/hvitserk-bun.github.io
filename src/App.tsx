import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import "./App.css";

function App() {
  const [pass, setPass] = useState("");

  const [messageIn, setMessageIn] = useState("");
  const [encodedMessageOut, setEncodedMessageOut] = useState("");

  const encodeMessage = () => {
    setEncodedMessageOut("Encoded message");
  };

  const [encodedMessageIn, setEncodedMessageIn] = useState("");
  const [messageOut, setMessageOut] = useState("");

  const decodeMessage = () => {
    setMessageOut("Decoded message");
  };

  return (
    <div className="App">
      <Grid container spacing={2} m={2}>
        <Grid xs={0} sm={3}></Grid>
        <Grid
          item
          xs={12}
          sm={6}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <TextField
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            label="Passphrase"
            fullWidth
          />
        </Grid>
        <Grid xs={0} sm={3}></Grid>

        <Grid
          item
          xs={12}
          sm={6}
          container
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Grid item xs={12} mb={2}>
            <TextField
              label="Message (you want to encode)"
              variant="outlined"
              onChange={(e) => setMessageIn(e.target.value)}
              value={messageIn}
              multiline
              fullWidth
            />
          </Grid>
          <Grid item xs={12} mb={2}>
            <Button variant="contained" onClick={encodeMessage} fullWidth>
              Encode
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={encodedMessageOut}
              disabled
              multiline
              label="Encoded message"
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          container
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Grid item xs={12} mb={2}>
            <TextField
              label="Message (you want to decode)"
              variant="outlined"
              onChange={(e) => setEncodedMessageIn(e.target.value)}
              value={encodedMessageIn}
              multiline
              fullWidth
            />
          </Grid>
          <Grid item xs={12} mb={2}>
            <Button variant="contained" onClick={decodeMessage} fullWidth>
              Decode
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={messageOut}
              disabled
              multiline
              label="Decoded message"
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
