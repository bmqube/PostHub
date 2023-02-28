import React from "react";
import SinglePost from "./SinglePost";

export default function Newsfeed() {
  return (
    <div className="text-white mb-3">
      <SinglePost />
      <SinglePost />
    </div>
  );
}
