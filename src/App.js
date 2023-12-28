import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loader from './common/Loader';
const AddMovie = lazy(() => import("./components/home/AddMovie"));
const EditMovie = lazy(() => import("./components/home/EditMovie"));
const ProtectedRoute = lazy(() => import("./common/ProtectedRoute"));
const SignIn = lazy(() => import("./components/auth/SignIn"));
const MovieListComp = lazy(() => import("./components/home/MovieListComp"));

function App() {
  return (
    <>
      <Suspense fallback={<Loader/>}>
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<ProtectedRoute><MovieListComp /></ProtectedRoute>} />
            <Route path="/add-movie" element={<ProtectedRoute><AddMovie /></ProtectedRoute>} />
            <Route path="/edit-movie/:id" element={<ProtectedRoute><EditMovie /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </Suspense>

    </>
  );
}

export default App;
