// api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Replace with your actual API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    // Add any additional headers if needed
  },
});

const api_no_token = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add any additional headers if needed
  },
});

// Request interceptor to add the token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication Endpoints
export const getToken = async (username, password) => {
  try {
    const response = await api.post('/accounts/token/', {
      username,
      password,
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error obtaining token:', error);
    throw error;
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/accounts/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

export const registerSeeker = async (userData) => {
  try {
    const response = await api_no_token.post('/accounts/seeker/', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering seeker:', error);
    throw error;
  }
};

export const registerShelter = async (userData) => {
  try {
    const response = await api_no_token.post('/accounts/shelter/', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering shelter:', error);
    throw error;
  }
};

export const getProfile = async (userId) => {
  try {
    const response = await api.get(`/accounts/profile/${userId}/`);
    return response.data;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};

export const currentUser = async () => {
  try {
    const response = await api.get(`/accounts/current-user/`);
    return response.data;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/accounts/profile/', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const deleteProfile = async () => {
  try {
    const response = await api.delete('/accounts/profile/');
    return response.data;
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
};

export const getShelters = async () => {
  try {
    const response = await api_no_token.get('/accounts/all_shelters/');
    return response.data;
  } catch (error) {
    console.error('Error getting shelters:', error);
    throw error;
  }
};

// Listings Endpoints
export const createPetListing = async (listingData) => {
  try {
    const response = await api.post('/listings/', listingData);
    return response.data;
  } catch (error) {
    console.error('Error creating pet listing:', error);
    throw error;
  }
};

export const getPetListingDetails = async (listingId) => {
  try {
    const response = await api.get(`/listings/${listingId}/`);
    return response.data;
  } catch (error) {
    console.error('Error getting pet listing details:', error);
    throw error;
  }
};

export const searchPetListings = async (queryParams) => {
  try {
    const response = await api.get(`/listings/`, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Error getting pet listing details:', error);
    throw error;
  }
};


export const updatePetListing = async (petListingId, updatedData) => {
  try {
    console.log(updatedData)
    const response = await api.put(`/listings/${petListingId}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating pet listing:', error);
    throw error;
  }
};

export const deletePetListing = async (petListingId) => {
  try {
    const response = await api.delete(`/listings/${petListingId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting pet listing:', error);
    throw error;
  }
};

// Add more listings endpoints as needed

// Comments Endpoints
export const getComments = async (requestData) => {
  try {
    const response = await api.get('/comments/', { params: requestData });
    console.log(requestData);
    console.log("hello");
    return response.data;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

export const postComment = async (commentData) => {
  try {
    const response = await api.post('/comments/', commentData);
    return response.data;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};

// Add more comments endpoints as needed

// Applications Endpoints
export const getApplications = async () => {
  try {
    const response = await api.get('/applications/');
    return response.data;
  } catch (error) {
    console.error('Error getting applications:', error);
    throw error;
  }
};

export const createApplication = async (applicationData) => {
  try {
    console.log(applicationData)
    const response = await api.post('/applications/', applicationData);
    return response.data;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

export const getApplicationDetails = async (applicationId) => {
  try {
    const response = await api.get(`/applications/${applicationId}/`);
    return response.data;
  } catch (error) {
    console.error('Error getting application details:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId, newStatus) => {
  try {
    const response = await api.put(`/applications/${applicationId}/`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

// Add more applications endpoints as needed

// Notifications Endpoints
export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications/');
    return response.data;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

export const getNotificationDetails = async (notificationId) => {
  try {
    const response = await api.get(`/notifications/${notificationId}/`);
    return response.data;
  } catch (error) {
    console.error('Error getting notification details:', error);
    throw error;
  }
};

export const deleteNotif = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}/`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Add more notifications endpoints as needed

export const createBlogPost = async (blogData) => {
  try {
    const response = await api.post('/accounts/blogposts/', blogData);
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const getBlogPosts = async (queryParams) => {
  try {
    const response = await api.get('/accounts/blogposts/', { params: queryParams });
    console.log(queryParams)
    return response.data;
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
};

export const getBlogDetail = async (blogId) => {
  try {
    const response = await api.get(`/accounts/blogposts/${blogId}/`);
    return response.data;
  } catch (error) {
    console.error('Error getting blog posts:', error);
    throw error;
  }
};

export default api;
