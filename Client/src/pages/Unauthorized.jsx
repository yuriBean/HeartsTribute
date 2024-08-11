import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[40rem]">
        <h1 className="text-4xl font-bold text-center">404</h1>
        <p className="text-center mt-4">The Page Doesn't Exist.</p>
        <Link to="/" className="mt-4 text-blue-500 hover:underline">Go back to home</Link>
      </div>
    </Layout>
  )
}