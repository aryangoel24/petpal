// Frontend/src/App.js
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,} from 'react-router-dom';
import Welcome from './Welcome';
import Login from './components/accounts/Login';
import ViewProfile from './components/accounts/ViewProfile';
import ShelterListComponent from './components/accounts/Shelters';
import { AuthProvider } from './components/accounts/AuthContext';
import RegisterShelter from './components/accounts/RegisterShelter';
import RegisterSeeker from './components/accounts/RegisterSeeker';
import UpdateProfile from './components/accounts/UpdateProfile';
import CreatePetListing from './components/listings/CreatePetListing';
import ViewPetListing from './components/listings/ViewPetListing';
import SearchPage from './components/listings/Search';
import AdoptionApplication from './components/applications/AdoptionApplication';
import ViewApplications from './components/applications/ViewApplications';
import ApplicationDetail from './components/applications/ApplicationDetail';
import UpdatePetListing from './components/listings/UpdatePetListing';
import NotificationsPage from './components/notifications/Notifications';
import NotificationDetailPage from './components/notifications/NotificationDetail';
import BlogList from './components/blogs/BlogList';
import BlogDetail from './components/blogs/BlogDetail';
import CreateBlog from './components/blogs/CreateBlog';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:userId" element={<ViewProfile />} />
        <Route path="/register_seeker" element={<RegisterSeeker />} />
        <Route path="/register_shelter" element={<RegisterShelter />} />
        <Route path="/shelters" element={<ShelterListComponent />} />
        <Route path="/profile/update" element={<UpdateProfile />} />
        <Route path="/create-pet" element={<CreatePetListing />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/create_application" element={<AdoptionApplication />} />
        <Route path="/view_applications" element={<ViewApplications />} />
        <Route path="/listings/:listingId" element={<ViewPetListing />} />
        <Route path="/listings/:listingId/update" element={<UpdatePetListing />} />
        <Route path="/applications/:applicationId" element={<ApplicationDetail />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/notifications/:notificationId" element={<NotificationDetailPage />} />
        <Route path="/all-blogs" element={<BlogList />} />
        <Route path="/blogposts/:blogId" element={<BlogDetail />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
