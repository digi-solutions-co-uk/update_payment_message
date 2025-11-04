import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import TVs from "./components/tvs";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/update_payment_message" element={<Home />} />
        <Route path="/tvs/:id" element={<TVs />} />
      </Routes>
    </Router>
  );
}

export default App;
