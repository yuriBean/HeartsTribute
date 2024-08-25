import Layout from "../components/Layout/Layout"
import { Outlet, useParams } from "react-router-dom"
import HeaderForEditProfile from "../components/EditProfilePage/HeaderForEditProfile"
import { EditProfileProvider, useProfile } from "../components/Providers/EditProfileProvider"


export default function EditProfilePage() {
  const { profile_id , loading } = useParams();

  return (
    <EditProfileProvider profile_id={profile_id}>
      <Layout>
        <div className="body-margin">
          {/* <HeaderForEditProfile /> */}
          <main className="rounded-md shadow-md px-6 py-12 md:px-12 md:py-24 ">
            <Outlet />
          </main>
        </div>
      </Layout>
    </EditProfileProvider>
  )
}
