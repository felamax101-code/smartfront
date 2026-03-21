import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationsApi, postsApi } from '../services/api';
import PostCard from '../components/PostCard';

function FeedPage() {
  // ── State ──────────────────────────────────────────
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');  // feed, trending, explore

  const navigate = useNavigate();

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // ── Auth check ─────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // ── Load posts ─────────────────────────────────────
  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const loadPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (activeTab === 'feed') {
        response = await recommendationsApi.getFeed();
        setPosts(response.data.feed);
      } else if (activeTab === 'trending') {
        response = await recommendationsApi.getTrending();
        setPosts(response.data);
      } else if (activeTab === 'explore') {
        response = await recommendationsApi.getExplore();
        setPosts(response.data);
      }

    } catch (err) {
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // ── Render ─────────────────────────────────────────
  return (
    <div className="feed-container">

      {/* Top navigation */}
      <nav className="top-nav">
        <h2>🇰🇪 Jamii</h2>
        <div className="nav-actions">
          <button
            className="btn-outline"
            onClick={() => navigate('/create')}
          >
            + Post
          </button>
          <div
            className="nav-avatar"
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            {user.username?.[0]?.toUpperCase()}
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Tab bar */}
      <div className="tab-bar">
        <button
          className={`tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          🏠 Feed
        </button>
        <button
          className={`tab ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          🔥 Trending
        </button>
        <button
          className={`tab ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          🔍 Explore
        </button>
      </div>

      {/* Content */}
      <div className="feed-content">

        {/* Loading */}
        {isLoading && (
          <div className="loading-container">
            {[1,2,3].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-header">
                  <div className="skeleton-avatar" />
                  <div className="skeleton-lines">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line shorter" />
                  </div>
                </div>
                <div className="skeleton-line full" />
                <div className="skeleton-line medium" />
                <div className="skeleton-actions">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line short" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-container">
            <p>😔 {error}</p>
            <button className="btn-primary" onClick={loadPosts}>
              Try Again
            </button>
          </div>
        )}

        {/* Posts */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="empty-feed">
            <p>😴 No posts yet</p>
            <p>Follow people or create your first post!</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/create')}
            >
              Create Post
            </button>
          </div>
        )}

        {!isLoading && !error && posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onPostUpdate={(updatedPost) => {
              setPosts(prev =>
                prev.map(p => p.id === updatedPost.id ? updatedPost : p)
              );
            }}
          />
        ))}

      </div>
    </div>
  );
}

export default FeedPage;