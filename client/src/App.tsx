/* React */
import React, { useEffect, useState, lazy, Suspense } from 'react';
/* Router */
import { Navigate, Routes, Route } from 'react-router-dom';
/* Redux */
import { useSelector } from 'react-redux';

/* Pages */
import {
  AuthPage,
  // EditRoomPage,
  HomePage,
  MyBookingsPage,
  // MyRoomsPage,
  // NewRoomPage,
  ProfilePage,
  UpdateProfilePage,
  UpdatePasswordPage,
  RoomDetailPage,
  SearchPage,
} from './pages';
/* Components */
import { ScrollToTop } from './components/functionality';
import { ErrorModal, Toast } from './components/ui';
import { Header } from './components/header';
import { Footer } from './components/footer';
/* Hooks */
import useAuthenticate from './hooks/useAuthenticate';
/* Store */
import type { IRootState } from './store/store';
/* Styles */
import './App.scss';
/* Lazy pages */
const EditRoomPage = lazy(() => import('./pages/EditRoomPage/EditRoomPage'));
const MyRoomsPage = lazy(() => import('./pages/MyRoomsPage/MyRoomsPage'));
const NewRoomPage = lazy(() => import('./pages/NewRoomPage/NewRoomPage'));

/* //////////////////////////////////////////////////////////////// */
export default function App() {
  const { checkIfLogin } = useAuthenticate();

  const [loadedLocalStorage, setLoadedLocalStorage] = useState<boolean>(false);

  useEffect(() => {
    checkIfLogin();
    setLoadedLocalStorage(true);
  }, [checkIfLogin]);

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <ScrollToTop />
      <Toast />
      <ErrorModal />

      <Header />
      <div className="app__content">
        {loadedLocalStorage && (
          // [NOTE] display page when loaded user auth data from local storage
          <Router />
        )}
      </div>
      <Footer />
    </>
  );
}

function Router() {
  const { isLogin, role } = useSelector((state: IRootState) => state.auth);

  /* JSX ---------------------------------------------------------- */
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
      {!isLogin ? (
        <Route path="/auth" element={<AuthPage />} />
      ) : (
        <>
          <Route path="/booking" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />}>
            <Route index element={<UpdateProfilePage />} />
            <Route path="password" element={<UpdatePasswordPage />} />
          </Route>
          {role === 'host' && (
            <>
              {/* prettier-ignore */}
              <Route path="/my-rooms" element={<Suspense><MyRoomsPage/></Suspense>} />
              {/* prettier-ignore */}
              <Route path="/my-rooms/:roomId" element={<Suspense><EditRoomPage/></Suspense>} />
              {/* prettier-ignore */}
              <Route path="/new-room" element={<Suspense><NewRoomPage/></Suspense>} />
            </>
          )}
        </>
      )}

      {/* unhandled route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
