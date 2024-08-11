
import Layout from "../components/Layout/Layout"
import HeaderForProfileManager from "../components/ProfileManager/HeaderForProfileManager"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import { ProfileManagerProvider } from "../components/Providers/ProfileManagerProvider"



export default function ProfileManager() {
  const [tab, setTab] = useState(1)
  return (
    <ProfileManagerProvider>
      <Layout>
        <div className="body-margin">
          <HeaderForProfileManager tab={tab} setTab={setTab} />
          <main className="">
            <Outlet />
          </main>
        </div>
      </Layout>
    </ProfileManagerProvider>
  )
}
