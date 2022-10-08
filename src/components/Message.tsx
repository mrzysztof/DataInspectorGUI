import React from "react";
import * as Redux from "react-redux";
import { parse, draw } from "jsroot";

import DeviceIcon from "icons/device.svg";
import { Device, DisplayMethod, Message } from "store/state";
import { Box, Typography, Toolbar } from "@mui/material";
import { setDisplayMethod } from "store/actions";

interface MessageHeaderProps {
  device: Device;
}

const MessageHeader = ({ device }: MessageHeaderProps) => (
  <Toolbar sx={{ backgroundColor: "#e0e0e0", flex: 0.1 }}>
    <Box display="flex" width="100%">
      <img src={DeviceIcon} alt="DeviceIcon" width="5%" />
      <Typography variant="h5" width="50%" sx={{ ml: "0.5em", my: "auto" }}>
        {device.name}
      </Typography>
    </Box>
  </Toolbar>
);

interface MessageProps {
  message: Message;
}

const MessageView = ({ message }: MessageProps) => (
  <Box flex="0.8">
    {message.payload === undefined ? null : (
      <div id="display-selection">
        <span>Display method:</span>
        <hr />
        <DisplaySelection message={message} />
      </div>
    )}
    <Typography variant="h5">Header</Typography>
    <hr />
    <Header message={message} />
    <Typography variant="h5">Payload</Typography>
    <hr />
    <Payload message={message} />
  </Box>
);

const Header = ({ message }: MessageProps) => (
  <div>
    <table>
      <tr>
        <td>Origin: {message.origin}</td>
        <td>Payload parts: {message.payloadParts}</td>
      </tr>
      <tr>
        <td>Description: {message.description}</td>
        <td>Payload split index: {message.payloadSplitIndex}</td>
      </tr>
      <tr>
        <td>Sub-specification: {message.subSpecification}</td>
        <td>Start time: {message.startTime ? message.startTime : "N/A"}</td>
      </tr>
      <tr>
        <td>Payload size: {message.payloadSize} B</td>
        <td>Duration: {message.duration ? message.duration : "N/A"}</td>
      </tr>
      <tr>
        <td>Serialization: {message.payloadSerialization}</td>
        <td>
          Creation time: {message.creationTime ? message.creationTime : "N/A"}
        </td>
      </tr>
      <tr>
        <td>FirstTForbit: {message.firstTForbit}</td>
        <td>Task&apos;s hash: {message.taskHash ? message.taskHash : "N/A"}</td>
      </tr>
      <tr>
        <td>Run numer: {message.runNumber}</td>
        <td></td>
      </tr>
    </table>
  </div>
);

const DisplaySelection = ({ message }: MessageProps) => {
  const store = Redux.useStore();

  function onClick(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    const method =
      event.currentTarget.name === "plot"
        ? DisplayMethod.Plot
        : DisplayMethod.Raw;
    store.dispatch(setDisplayMethod(message, method));
  }

  return (
    <div>
      <label>
        <input
          type="checkbox"
          name="default"
          onClick={onClick}
          checked={message.payloadDisplay === DisplayMethod.Default}
        />
        Default ({message.payloadSerialization})
      </label>
      <label>
        <input
          type="checkbox"
          name="raw"
          onClick={onClick}
          checked={message.payloadDisplay === DisplayMethod.Raw}
        />
        Raw
      </label>
      <label>
        <input
          type={message.payloadSerialization === "ROOT" ? "checkbox" : "hidden"}
          name="plot"
          onClick={onClick}
          checked={message.payloadDisplay === DisplayMethod.Plot}
        />
        Plot
      </label>
    </div>
  );
};

const Payload = ({ message }: MessageProps) => {
  return (
    <div id="message-payload">
      <div>
        {message.payload ? displayPayload(message) : <span>empty payload</span>}
      </div>
    </div>
  );
};

function displayPayload(m: Message) {
  switch (m.payloadDisplay) {
    case DisplayMethod.Plot:
      return plotPayload(m);
    default:
      return <span>{m.payload?.toString()}</span>;
  }
}

function plotPayload(m: Message): JSX.Element {
  const obj = parse(JSON.stringify(m.payload));
  draw("message-payload", obj, "colz");
  return <div>Message type does not support drawing.</div>;
}

export { MessageHeader, MessageView };
