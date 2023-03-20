import React from "react";
import FriendRequests from "./FriendRequests";
import Friends from "./Friends";
import Suggestions from "./Suggestions";

export default function Connections() {
  return (
    <>
      <Friends />
      <FriendRequests />
      <Suggestions />
    </>
  );
}
