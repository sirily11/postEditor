import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { UserContext } from "../model/userContext";
import { Redirect } from "react-router-dom";
import { Trans } from "@lingui/macro";

const useStyles = makeStyles((theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    paddingTop: theme.spacing(12),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(0),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Login() {
  const classes = useStyles();

  return (
    <UserContext.Consumer>
      {({
        userName,
        password,
        onChangePassword,
        onChangeUserName,
        login,
        isLogin,
        saveLogin,
        saveLoginInfo
      }) => {
        if (isLogin) {
          return <Redirect to="/home" />;
        } else {
          return (
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  <Trans>Sign In</Trans>
                </Typography>
                <form className={classes.form} noValidate>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="User"
                    label={<Trans>User Name</Trans>}
                    name="User"
                    autoComplete="User"
                    autoFocus
                    value={userName}
                    onChange={(e) => onChangeUserName(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={<Trans>Password</Trans>}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => onChangePassword(e.target.value)}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={saveLoginInfo}
                        color="primary"
                        onChange={(e) => saveLogin(e.target.checked)}
                      />
                    }
                    label={<Trans>Remember Me</Trans>}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={login}
                  >
                    <Trans>Sign In</Trans>
                  </Button>
                </form>
              </div>
            </Container>
          );
        }
      }}
    </UserContext.Consumer>
  );
}
