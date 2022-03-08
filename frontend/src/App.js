import { Routes, Route } from "react-router-dom";
import { Register, Enter, Dashboard, Page404, Hero } from "./routes";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/Context";

export default function App() {
  const navigate = useNavigate();
  const { setUserInfo, setMyChats, fetchAgain } = useContext(UserContext);

  const getUserCredentials = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const URL = "/api/user";
      const { data } = await axios.get(URL, config);
      setUserInfo(data.user);
    } catch (error) {
      console.log("You are unauthorized");
      navigate("/login");
    }
  };

  const getAllChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const URL = "/api/chat";
      const { data } = await axios.get(URL, config);
      setMyChats(data.results);
    } catch (error) {
      console.log("You are unauthorized");
    }
  };

  useEffect(() => {
    getUserCredentials();
    getAllChats();
  }, [fetchAgain]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Enter />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}
