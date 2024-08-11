import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";
import { addRequestedUserToProfile } from "../services/profileManager.service";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { notifyInfo, notifyError, notifySuccess } from "../utils/toastNotifications";
import { useNavigate } from "react-router-dom";

export default function NoProfileConnected() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[40rem]">
          <h1 className="text-2xl md:text-4xl font-bold text-center">
            No Profile connected with this QR code.
          </h1>
      </div>
    </Layout>
  );
}
