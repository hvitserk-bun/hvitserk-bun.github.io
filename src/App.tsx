import { Button, Grid, Snackbar, TextField, Tooltip } from "@mui/material";
import { useState } from "react";
import "./App.css";
import { decrypt, encrypt, generateKey } from "./crypt";

function App() {
  const [pass, setPass] = useState("");

  const [messageIn, setMessageIn] = useState("");
  const [encryptedMessageOut, setEncryptedMessageOut] = useState("");

  const encryptMessage = () => {
    encrypt({ content: messageIn, rawKey: pass }).then(
      (result) => setEncryptedMessageOut(result),
      (e) => {
        console.error(e);
        setToastOpen(true);
        setToastMessage("Cannot encrypt message, check your passphrase");
      }
    );
  };

  const [encryptedMessageIn, setEncryptedMessageIn] = useState("");
  const [messageOut, setMessageOut] = useState("");

  const decryptMessage = () => {
    decrypt({ encryptedMessage: encryptedMessageIn, rawKey: pass }).then(
      (result) => setMessageOut(result),
      (e) => {
        console.error(e);
        setToastOpen(true);
        setToastMessage("Cannot decrypt message, check your passphrase or encrypted message");
      }
    );
  };

  const [generatedPass, setGeneratedPass] = useState("");

  const generatePass = () => {
    generateKey().then((key) => setGeneratedPass(key));
  };

  const [isToastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const copyToClipboard = ({
    content,
    toastMessage,
  }: {
    content: string;
    toastMessage?: string;
  }) => {
    const m = toastMessage ?? "Copied!";
    window.navigator.clipboard.writeText(content);
    setToastOpen(true);
    setToastMessage(m);
  };

  const onToastClose = () => setToastOpen(false);

  return (
    <div className="App">
      <Grid container spacing={2} p={2}>
        <Grid item xs={0} sm={3}></Grid>
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
        <Grid item xs={0} sm={3}></Grid>

        <Grid
          item
          xs={12}
          sm={6}
          container
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Grid item xs={12} mb={2}>
            <TextField
              label="Message (you want to encrypt)"
              variant="outlined"
              onChange={(e) => setMessageIn(e.target.value)}
              value={messageIn}
              multiline
              fullWidth
            />
          </Grid>
          <Grid item xs={12} mb={2}>
            <Button variant="contained" onClick={encryptMessage} fullWidth>
              Encrypt
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            onClick={() => copyToClipboard({ content: encryptedMessageOut })}
          >
            <Tooltip title="Click to copy" enterDelay={100} placement="top">
              <TextField
                value={encryptedMessageOut}
                InputProps={{ readOnly: true }}
                multiline
                label="Encrypted message"
                fullWidth
              />
            </Tooltip>
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
              label="Message (you want to decrypt)"
              variant="outlined"
              onChange={(e) => setEncryptedMessageIn(e.target.value)}
              value={encryptedMessageIn}
              multiline
              fullWidth
            />
          </Grid>
          <Grid item xs={12} mb={2}>
            <Button variant="contained" onClick={decryptMessage} fullWidth>
              Decrypt
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            onClick={() => copyToClipboard({ content: messageOut })}
          >
            <Tooltip title="Click to copy" enterDelay={100} placement="top">
              <TextField
                value={messageOut}
                InputProps={{ readOnly: true }}
                multiline
                label="Decrypted message"
                fullWidth
              />
            </Tooltip>
          </Grid>
        </Grid>

        <Grid item xs={12} mt={2}>
          <Grid item xs={12} mb={2}>
            <Button variant="contained" onClick={generatePass} fullWidth>
              Generate Passphrase
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            onClick={() => copyToClipboard({ content: generatedPass })}
          >
            <Tooltip title="Click to copy" enterDelay={100} placement="top">
              <TextField
                value={generatedPass}
                label="Generated Passphrase"
                InputProps={{ readOnly: true }}
                sx={{ input: { cursor: "pointer" } }}
                fullWidth
              />
            </Tooltip>
          </Grid>
        </Grid>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={isToastOpen}
          message={toastMessage}
          autoHideDuration={3000}
          onClose={onToastClose}
        />
      </Grid>
    </div>
  );
}

export default App;
