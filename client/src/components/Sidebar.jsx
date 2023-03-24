import React, { useState } from "react";
import { MDBListGroup, MDBListGroupItem, MDBRipple } from "mdb-react-ui-kit";

export default function Sidebar({ link }) {
  const [isSmall, setIsSmall] = useState(window.innerWidth < 992);
  window.onresize = function (event) {
    setIsSmall(window.innerWidth < 992);
  };

  let list = [
    {
      title: "Home",
      link: "/",
      icon: "fa-solid fa-house",
    },
    {
      title: "Profile",
      link: "/profile",
      icon: "fa-solid fa-user",
    },
    {
      title: "Connections",
      link: "/connections",
      icon: "fa-solid fa-user-group",
    },
    {
      title: "Notifications",
      link: "/notifications",
      icon: "fa-solid fa-bell",
    },
  ];
  return (
    <MDBListGroup
      horizontal={isSmall}
      light
      className={`${isSmall ? "mb-3 border-bottom" : ""}`}
    >
      {list.map((e, index) => (
        <MDBListGroupItem
          key={index}
          tag="a"
          href={e.link}
          action
          noBorders
          className={`px-3 level1 ${e.title === link ? "text-warning" : ""} ${
            isSmall ? "text-center" : ""
          }`}
        >
          <i class={e.icon}> </i> {!isSmall ? e.title : ""}
        </MDBListGroupItem>
      ))}

      {/* 
        <MDBListGroupItem
          tag="a"
          href="#"
          action
          noBorders
          className="px-3 level1"
        >
          Porta ac consectetur ac
        </MDBListGroupItem>
       */}
    </MDBListGroup>
  );
}
