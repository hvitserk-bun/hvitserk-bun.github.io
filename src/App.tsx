import { useTheme } from "@mui/material/styles";
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import "./App.css";
import { decrypt, encrypt, generateKey } from "./crypt";
import { l10n, Language } from "./l18n";

const guessLanguage = (): Language => {
  const userLanguage = navigator.language;
  const guessedLanguage = Object.entries(Language).find(([key, value]) => {
    return userLanguage.includes(value);
  });

  if (guessedLanguage) {
    guessedLanguage[0] as unknown as Language;
  }

  return Language.En;
};

function App() {
  const theme = useTheme();
  const isLessThanSmScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [language, setLanguage] = useState(guessLanguage());

  const cLn = l10n[language];

  const [pass, setPass] = useState("");

  const [messageIn, setMessageIn] = useState("");
  const [encryptedMessageOut, setEncryptedMessageOut] = useState("");

  const encryptMessage = () => {
    encrypt({ content: messageIn, rawKey: pass }).then(
      (result) => setEncryptedMessageOut(result),
      (e) => {
        console.error(e);
        setToastOpen(true);
        setToastMessage(cLn.text.encryptError);
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
        setToastMessage(cLn.text.decryptError);
      }
    );
  };

  const generatePass = () => {
    generateKey().then((key) => setPass(key));
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
        <Grid item xs={0} sm={10}></Grid>
        <Grid
          item
          xs={12}
          sm={2}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <FormControl fullWidth>
            <InputLabel id="language-select">{cLn.labels.language}</InputLabel>
            <Select
              labelId="language-select"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as unknown as Language)
              }
            >
              {Object.values(Language).map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <TextField
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            label={l10n[language].labels.pass}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              onClick={() => copyToClipboard({ content: pass })}
              sx={{ height: "100%" }}
              fullWidth
              disabled={!pass}
            >
              {cLn.actions.copy}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              onClick={generatePass}
              sx={{ height: "100%" }}
              fullWidth
            >
              {cLn.actions.generate}
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider>{isLessThanSmScreen ? cLn.actions.encrypt : ""}</Divider>
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
              label={cLn.labels.encryptMessage}
              variant="outlined"
              onChange={(e) => setMessageIn(e.target.value)}
              value={messageIn}
              multiline
              fullWidth
            />
          </Grid>
          <Grid item xs={12} mb={2}>
            <Button variant="contained" onClick={encryptMessage} fullWidth>
              {cLn.actions.encrypt}
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            onClick={() => copyToClipboard({ content: encryptedMessageOut })}
            container
            spacing={2}
          >
            <Grid item xs={12}>
              <Tooltip title={cLn.text.copy} enterDelay={100} placement="top">
                <TextField
                  value={encryptedMessageOut}
                  InputProps={{ readOnly: true }}
                  multiline
                  label={cLn.labels.encryptedMessage}
                  sx={{ textarea: { cursor: "pointer" } }}
                  fullWidth
                />
              </Tooltip>
            </Grid>
            {isLessThanSmScreen ? (
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => copyToClipboard({ content: messageOut })}
                  sx={{ height: "100%" }}
                  fullWidth
                  disabled={!pass}
                >
                  {cLn.actions.copy}
                </Button>
              </Grid>
            ) : null}
          </Grid>
        </Grid>

        {isLessThanSmScreen ? (
          <Grid item xs={12}>
            <Divider>{cLn.actions.decrypt}</Divider>
          </Grid>
        ) : null}

        <Grid
          item
          xs={12}
          sm={6}
          container
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Grid item xs={12} mb={2}>
            <TextField
              label={cLn.labels.decryptMessage}
              variant="outlined"
              onChange={(e) => setEncryptedMessageIn(e.target.value)}
              value={encryptedMessageIn}
              multiline
              fullWidth
            />
          </Grid>
          <Grid item xs={12} mb={2}>
            <Button variant="contained" onClick={decryptMessage} fullWidth>
              {cLn.actions.decrypt}
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            onClick={() => copyToClipboard({ content: messageOut })}
            container
            spacing={2}
          >
            <Grid item xs={12}>
              <Tooltip title={cLn.text.copy} enterDelay={100} placement="top">
                <TextField
                  value={messageOut}
                  InputProps={{ readOnly: true }}
                  multiline
                  label={cLn.labels.decryptedMessage}
                  sx={{ textarea: { cursor: "pointer" } }}
                  fullWidth
                />
              </Tooltip>
            </Grid>

            {isLessThanSmScreen ? (
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => copyToClipboard({ content: messageOut })}
                  sx={{ height: "100%" }}
                  fullWidth
                  disabled={!pass}
                >
                  {cLn.actions.copy}
                </Button>
              </Grid>
            ) : null}
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
