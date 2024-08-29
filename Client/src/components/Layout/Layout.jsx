import Navbar from "../Common/Navbar"
import Footer from "../Common/Footer"

export default function Layout({ children }) {
  return (
    <>
      <div className="flex flex-col min-h-screen" id="layout">
        <Navbar />
        <main className="flex-grow mb-16">{children}</main>
        <Footer />
      </div>
    </>
  )
}
