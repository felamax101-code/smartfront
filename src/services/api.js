import axios from 'axios';
//Base URL FOR DJANGO BACKEND
const BASE_URL = 'http://localhost:8000/api/';

// Create an instance of axios with the base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
//Interceptor to add the token to the headers of each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;  }
);
//Auth endpoints
export const  authApi = {
    login:(phone,password) => api.post('auth/login/',{phone,password}),
    register:(username,email,phone,password,confirmPassword) => api.post('auth/register/',{username,email,phone,password,confirm_password:confirmPassword}),
};
//Posts endpoints
export const postsApi = {
    getFeed:() => api.get('/posts/'),
    getPost:(postId) => api.get(`/posts/${postId}/`),
    createPost:(data) => api.post('/posts/',{data}),
    savePost:(postId) => api.post(`/posts/${postId}/save/`),
    repost:(postId,caption)=>api.post('/posts/$postId/repost/',{caption}),
};
//Comments endpoints
export const commentsApi = {
    getComments:(postId)=> api.get('/comments/?post=${postId}'),
    createComment:(postId,body,language) => api.post('/comments/',{post:postId},{body,language}),
    voteComment:(commentId,voteType) => api.post(`/comments/${commentId}/vote/`,{vote_type:voteType}),
};
//Reactions endpoints
export const reactionsApi = {
    getReactions:(postId) => api.get(`/reactions/?post=${postId}`),
    reactToPost:(postId,reactionType) => api.post(`/reactions/?post=${postId}`,{reaction_type:reactionType}),
    removeReaction:(postId) => api.delete(`/reactions/?post=${postId}`),
};
//Follow endpoints
export const followApi = {
    followUser:(userId) => api.post(`/follows/${userId}/`),
    unfollowUser:(userId) => api.delete(`/follows/${userId}/`),
    getFollowStatus:(userId) => api.get(`/follows/${userId}/status/`),
};
//Recommendations endpoints
export const recommendationsApi = {
    getFeed:() => api.get('/recommendations/feed/'),
    getTrending:(county)=> api.get(`/recommendations/trending/${county?`?county=${county}`:''}/`),
    getExplore:() => api.get('/recommendations/explore/'),
};
export default api;