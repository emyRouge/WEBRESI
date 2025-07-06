import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import Talleres from "./pages/Talleres"
import Projects from "./pages/Projects"
import Blog from "./pages/Blog"
import Store from "./pages/Store"
import Support from "./pages/Support"
import Login from "./pages/Login"
import Panel from "./pages/Panel"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas con Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/conocenos"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/talleres"
          element={
            <Layout>
              <Talleres />
            </Layout>
          }
        />
        <Route
          path="/proyectos"
          element={
            <Layout>
              <Projects />
            </Layout>
          }
        />
        <Route
          path="/blog"
          element={
            <Layout>
              <Blog />
            </Layout>
          }
        />
        <Route
          path="/tienda"
          element={
            <Layout>
              <Store />
            </Layout>
          }
        />
        <Route
          path="/apoyo"
          element={
            <Layout>
              <Support />
            </Layout>
          }
        />

        {/* Ruta de login sin Layout */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida del panel sin Layout */}
        <Route
          path="/panel"
          element={
            <ProtectedRoute>
              <Panel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
