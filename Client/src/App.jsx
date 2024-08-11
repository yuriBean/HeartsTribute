import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import CheckAuth from "./utils/CheckAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./components/Common/Spinner";
import SplashScreen from "./components/ProfileManager/SplashScreen"
import CheckVerificationOnly from "./utils/CheckVerificationOnly";
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const CompleteRegistration = lazy(() => import("./pages/CompleteRegistration"));
const Home = lazy(() => import("./pages/Home"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Profile = lazy(() => import("./pages/Profile"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ProfileManager = lazy(() => import("./pages/ProfileManager"));
const DiscoverPage = lazy(() => import("./pages/DiscoverPage"));
const EditProfilePage = lazy(() => import("./pages/EditProfilePage"));
const AddEvent = lazy(() => import("./components/ProfileManager/AddEvent"));
const QRCode = lazy(() => import("./pages/QRCode"));
const AddPostOnProfile = lazy(
  () => import("./components/EditProfilePage/AddPostOnProfile")
);
const PostsOfProfile = lazy(
  () => import("./components/EditProfilePage/PostsOfProfile")
);
const EventsOfProfile = lazy(
  () => import("./components/EditProfilePage/EventsOfProfile")
);
const EditMedallionProfileForm = lazy(
  () => import("./components/EditProfilePage/EditMedallionProfileForm")
);
const ManageAccess = lazy(
  () => import("./components/EditProfilePage/ManageAccess")
);
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const Signout = lazy(() => import("./pages/Signout"));
const BioTab = lazy(() => import("./components/Profile/BioTab"));
const MediaTab = lazy(() => import("./components/Profile/MediaTab"));
const TimelineTab = lazy(() => import("./components/Profile/TimelineTab"));
const TributeTab = lazy(() => import("./components/Profile/TributeTab"));
const MyFavoritesTab = lazy(
  () => import("./components/ProfileManager/MyFavoritesTab")
);
const PostsTab = lazy(() => import("./components/ProfileManager/PostsTab"));
const MedallionTab = lazy(
  () => import("./components/ProfileManager/MedallionTab")
);
const MyAccountTab = lazy(
  () => import("./components/ProfileManager/MyAccountTab")
);
const RequestAccess = lazy(() => import("./pages/RequestAccess"));
const NoProfileConnected = lazy(() => import("./pages/NoProfileConnected"));

const router = createBrowserRouter([
  {
    path: "/:qr_id",
    element: (
      <Suspense fallback={<Spinner />}>
        <QRCode />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <CheckAuth>
        <Suspense fallback={<Spinner />}>
          <Login />
        </Suspense>
      </CheckAuth>
    ),
  },
  {
    path: "/complete-registration",
    element: (
      <Suspense fallback={<Spinner />}>
        <CompleteRegistration />
      </Suspense>
    ),
  },
  {
    path: "/verify-email",
    element: (
      // <PrivateRoute>
      <Suspense fallback={<Spinner />}>
        <VerifyEmail />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <CheckAuth>
        <Suspense fallback={<Spinner />}>
          <CreateAccount />
        </Suspense>
      </CheckAuth>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Suspense fallback={<Spinner />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<Spinner />}>
        <CheckVerificationOnly>
          <DiscoverPage />
        </CheckVerificationOnly>
      </Suspense>
    ),
  },
  {
    path: "/shop",
    element: (
      <Suspense fallback={<Spinner />}>
        <CheckVerificationOnly>
          <ShopPage />
        </CheckVerificationOnly>
      </Suspense>
    ),
  },
  {
    path: "/discover",
    element: (
      <Suspense fallback={<Spinner />}>
        <CheckVerificationOnly>
          <DiscoverPage />
        </CheckVerificationOnly>
      </Suspense>
    ),
  },
  {
    path: "/404",
    element: (
      <Suspense fallback={<Spinner />}>
        <Unauthorized />
      </Suspense>
    ),
  },
  {
    path: "/signout",
    element: (
      <Suspense fallback={<Spinner />}>
        <Signout />
      </Suspense>
    ),
  },
  {
    path: "/profile-manager",
    element: (
      <PrivateRoute>
        <Suspense fallback={<Spinner />}>
          <ProfileManager />
        </Suspense>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <MyFavoritesTab />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "posts",
        element: (
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <PostsTab />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "tribute-tags",
        element: (
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <MedallionTab />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "my-account",
        element: (
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <MyAccountTab />
            </Suspense>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/profile/:profile_id",
    element: (
      <Suspense fallback={<Spinner />}>
        <Profile />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Spinner />}>
            <BioTab />
          </Suspense>
        ),
      },
      {
        path: "media",
        element: (
          <Suspense fallback={<Spinner />}>
            <MediaTab />
          </Suspense>
        ),
      },
      {
        path: "timeline",
        element: (
          <Suspense fallback={<Spinner />}>
            <TimelineTab />
          </Suspense>
        ),
      },
      {
        path: "tribute",
        element: (
          <Suspense fallback={<Spinner />}>
            <TributeTab />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/edit-profile/:profile_id",
    element: (
      <PrivateRoute>
        <Suspense fallback={<Spinner />}>
          <EditProfilePage />
        </Suspense>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <EditMedallionProfileForm />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "posts",
        element: (
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <PostsOfProfile />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "events",
        element: (
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <EventsOfProfile />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "add-event",
        element: (
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <AddEvent />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "add-post",
        element: (
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <AddPostOnProfile />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "manage-access",
        element: (
          <PrivateRoute>
            <Suspense fallback={<Spinner />}>
              <ManageAccess />
            </Suspense>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/request-access/:profile_id",
    element: (
      <Suspense fallback={<Spinner />}>
        <RequestAccess />
      </Suspense>
    ),
  },
  {
    path: "/splash",
    element: (
      <Suspense fallback={<Spinner />}>
        <SplashScreen />
      </Suspense>
    ),
  },
  {
    path: "no-profile-connected",
    element: (
      <Suspense fallback={<Spinner />}>
        <NoProfileConnected />
      </Suspense>
    ),
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  );
}
