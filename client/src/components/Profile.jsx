import React, { useEffect, useState } from "react";
import SinglePost from "./SinglePost";
import axios from "axios";

export default function Profile({ effect }) {
  const [listOfPost, setListOfPost] = useState([]);
  const isAlreadyLogged = localStorage.getItem("userId");

  useEffect(() => {
    async function getData() {
      let response = await axios.get("http://localhost:8000/post/feed/mine", {
        headers: {
          userId: isAlreadyLogged,
        },
      });
      // console.log(response.data);
      setListOfPost(response.data.data);
    }
    getData();
  }, [effect]);

  return (
    <div className="text-white mb-3">
      {listOfPost.length === 0 ? (
        <p className="text-white text-center">
          You have not made a post yet. Post now?
        </p>
      ) : (
        listOfPost.map((e, index) => (
          <SinglePost key={index} post={e} user="Self" />
        ))
      )}
    </div>
  );
}
