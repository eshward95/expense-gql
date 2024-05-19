import { useQuery } from "@apollo/client";
import { LoaderIcon, Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";
import Transaction from "./pages/Transaction";

function App() {
  const { loading, error, data } = useQuery(GET_AUTHENTICATED_USER);
  console.log(data);
  if (loading) {
    return <LoaderIcon />;
  }
  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route
          path="/"
          element={data.authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!data.authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!data.authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/transaction/:id"
          element={data.authUser ? <Transaction /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
