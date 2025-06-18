import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Admin from "./pages/Admin";


const App = () => {
  

  return (
    <>
      <BrowserRouter basename="/">
        <Toaster position="top-center" />

        {/* Full-page loading spinner */}
        {/* {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin" />
          </div>
        )} */}

        {/* Main routes */}
        <Routes>
          <Route exact path="/:id" element={<Home />} />
          <Route exact path="/:id/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
