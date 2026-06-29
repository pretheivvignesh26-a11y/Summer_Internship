import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import BrowseItems from './pages/BrowseItems/BrowseItems';
import ItemDetails from './pages/ItemDetails/ItemDetails';
import CreateItem from './pages/CreateItem/CreateItem';
import EditItem from './pages/EditItem/EditItem';
import MyListings from './pages/MyListings/MyListings';
import MyBookings from './pages/MyBookings/MyBookings';
import Wishlist from './pages/Wishlist/Wishlist';
import Reviews from './pages/Reviews/Reviews';
import Notifications from './pages/Notifications/Notifications';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {}
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="browse" element={<BrowseItems />} />
              <Route path="items/:id" element={<ItemDetails />} />
              <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} />

              {}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="items/create"
                element={
                  <ProtectedRoute>
                    <CreateItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="items/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="listings/my"
                element={
                  <ProtectedRoute>
                    <MyListings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="bookings/my"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reviews"
                element={
                  <ProtectedRoute>
                    <Reviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

              {}
              <Route
                path="admin"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
