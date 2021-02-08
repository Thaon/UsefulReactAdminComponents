import React, { useState } from "react";

import {
  Modal,
  Fade,
  Paper,
  Backdrop,
  Grid,
  Button,
  TextField,
} from "@material-ui/core";

import ops from "../operations";

export default function EditNoteModal(props) {
  let open = props.open;
  const taskID = props.taskID;
  const workID = props.workID;
  const revisionID = props.revisionID;

  const [text, setText] = useState("");

  return (
    <div
      style={{
        width: props.open ? "100vw" : "0px",
        height: props.open ? "100vh" : "0px",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fade in={open}>
          <Paper
            elevation={3}
            style={{ padding: "2rem", width: "50%", height: "40%" }}
          >
            <Grid container style={{ height: "95%" }}>
              <Grid item xs={12}>
                <h2 id="transition-modal-title">Create Note</h2>
              </Grid>
              <Grid
                container
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                <TextField
                  id="transition-modal-description"
                  multiline
                  rows="10"
                  defaultValue={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{ width: "100%", height: "100%" }}
                />
              </Grid>
            </Grid>
            <Grid container justify="space-evenly">
              <Button
                color="primary"
                onClick={async () => {
                  await ops.createNote(taskID, workID, revisionID, text);
                  props.callback(null);
                  window.location.reload();
                }}
              >
                SAVE
              </Button>
              <Button
                color="primary"
                onClick={async () => {
                  props.callback(null);
                }}
              >
                CANCEL
              </Button>
            </Grid>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
}
