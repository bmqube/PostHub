import React from "react";
import { MDBListGroup, MDBListGroupItem, MDBRipple } from "mdb-react-ui-kit";

export default function Sidebar({ link }) {
  let list = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "Profile",
      link: "/profile",
    },
    {
      title: "Connections",
      link: "/connections",
    },
  ];
  return (
    <MDBListGroup light>
      {list.map((e, index) => {
        if (e.title === link) {
          return (
            <MDBListGroupItem
              key={index}
              noBorders
              tag="a"
              href={e.link}
              action
              //   active
              //   aria-current="true"
              className="px-3 level1 text-warning"
            >
              {e.title}
            </MDBListGroupItem>
          );
        } else {
          return (
            <MDBListGroupItem
              key={index}
              tag="a"
              href={e.link}
              action
              noBorders
              className="px-3 level1"
            >
              {e.title}
            </MDBListGroupItem>
          );
        }
      })}

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
