import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Login from "./screens/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./screens/Register";
import Home from "./screens/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ConnectionsPage from "./screens/ConnectionsPage";
import ProfilePage from "./screens/ProfilePage";
import MessagePage from "./screens/MessagePage";
import NotificationPage from "./screens/NotificationPage";
import MessageDetails from "./screens/MessageDetails";
import PostDetails from "./screens/PostDetails";
import EditProfile from "./screens/EditProfile";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/connections" element={<ConnectionsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/messages" element={<MessagePage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/message/:userId" element={<MessageDetails />} />
      <Route path="/post/:postId" element={<PostDetails />} />
      <Route path="/profile/edit" element={<EditProfile />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
