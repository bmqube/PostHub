import React, { useEffect, useState } from "react";
import SinglePost from "./SinglePost";
import axios from "axios";

export default function Newsfeed({ effect, setEffect }) {
  const [listOfPost, setListOfPost] = useState([]);
  const isAlreadyLogged = localStorage.getItem("userId");

  useEffect(() => {
    async function getData() {
      let response = await axios.get("http://localhost:8000/post/feed", {
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
        <p className="text-white text-center">There are no items to show</p>
      ) : (
        listOfPost.map((e, index) => (
          <SinglePost
            key={index}
            post={e}
            effect={effect}
            setEffect={setEffect}
          />
        ))
      )}
    </div>
  );
}
