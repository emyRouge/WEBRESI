import Header from "./Header"
import Footer from "./Footer"
import { useLocation } from "react-router-dom"

const Layout = ({ children }) => {
  const location = useLocation()
  const isHome = location.pathname === "/"

  return (
    <div className="app-wrapper">
      <Header />
      <main className="app-content">{children}</main>
      {!isHome && <Footer />}
    </div>
  )
}

export default Layout
