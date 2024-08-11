import { useAuth } from "../utils/AuthContext"
import { usePublicProfile } from "./Providers/PublicProfileProvider"
export default function CheckProfileOwner({
  children
}) {
  const { user } = useAuth()
  const { profile } = usePublicProfile()
  if (user && (user.id == profile.user_id)) {
    return <div>
      {children}
    </div>
  }
  return null
}
