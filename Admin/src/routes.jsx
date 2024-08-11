import CreateQRCode from "./pages/CreateQRCode";
import ListQR from "./pages/ListQR";
import MedallionProfiles from "./pages/MedallionProfiles";
import ProfileManagers from "./pages/ProfileManagers";
import SignOut from "./pages/SignOut";
import CreateIDs from "./pages/CreateIDs";
const routes = [
    {
        name: "Profiles Managers",
        layout: "/admin",
        path: "default",
        component: <ProfileManagers />,
    },
    {
        name: "Medallion Profiles",
        layout: "/admin",
        path: "medallion-profiles",
        component: <MedallionProfiles />,
    },
    {
        name: "QR Code List",
        layout: "/admin",
        path: "qr-code-list",
        component: <ListQR />,
    },
    {
        name: "Create QR Code",
        layout: "/admin",
        path: "create-qr-code",
        component: <CreateQRCode />,
    },
    {
        name: "Create IDs",
        layout: "/admin",
        path: "create-ids",
        component: <CreateIDs />,
    },
    {
        name: "Sign Out",
        layout: "/admin",
        path: "sign-out",
        component: <SignOut />,
    },
];
export default routes;
