import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import EditIcon from "@material-ui/icons/Edit";
import RefeashIcon from "@material-ui/icons/Refresh";

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: 400
    },
    input: {
      marginLeft: 8,
      flex: 1
    },
    iconButton: {
      padding: 10
    },
    divider: {
      width: 1,
      height: 28,
      margin: 4
    }
  })
);

interface Props {
  onSearchTextChange: any;
  refeash: any
}

export default function SearchBar(props: Props) {
  const classes = useStyles();

  return (
    <Paper
      className="d-flex my-2"
      elevation={0}
      style={{ position: "sticky", top: 0, zIndex: 100 }}
    >
      <div className="row w-100 mx-3 mt-1 mb-3">
        <IconButton className={classes.iconButton} aria-label="Menu" onClick={props.refeash}>
          <RefeashIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="Search Post"
          onChange={props.onSearchTextChange}
        />
        <IconButton className={classes.iconButton} aria-label="Search" disabled>
          <SearchIcon />
        </IconButton>
        <Divider className={classes.divider} />
        <IconButton className={classes.iconButton} aria-label="Search">
          <EditIcon />
        </IconButton>
      </div>
    </Paper>
  );
}
