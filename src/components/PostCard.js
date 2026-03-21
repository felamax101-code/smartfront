import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reactionsApi, postsApi } from '../services/api';
import ReactionBar from './ReactionBar';

function PostCard({ post, onPostUpdate }) {
    // state
    const [isSaved, setIsSaved] = useState(post.is_saved);
    const [savesCount, setSavesCount] = useState(post.saves_count);
    const [showReactions, setShowReactions] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [userReaction, setUserReaction] = useState(null); 

    const navigate = useNavigate();

    // helpers
    const formatCount = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-KE', {
            month: 'short',
            day: 'numeric'
        });
    };

    // handlers
    const handleSave = async () => {
        try {
            const response = await postsApi.savePost(post.id); 
            setIsSaved(response.data.saved);                   
            setSavesCount(prev => response.data.saved ? prev + 1 : prev - 1);
        } catch (err) {
            console.error('save failed:', err);
        }
    };

    const handleReaction = async (reactionType) => {
        try {
            if (userReaction === reactionType) {
                await reactionsApi.removeReaction(post.id);
                setUserReaction(null);
                setLikesCount(prev => prev - 1);
            } else {
                await reactionsApi.reactToPost(post.id, reactionType);
                setUserReaction(reactionType);
                if (!userReaction) {
                    setLikesCount(prev => prev + 1);
                }
            }
            setShowReactions(false);
        } catch (err) {
            console.error('Reaction failed:', err);
        }
    };

    const handleRepost = async () => {
        try {
            await postsApi.repost(post.id, '');
            alert('Reposted successfully');
        } catch (err) {
            console.error('Repost failed:', err);
        }
    };

    // render
    return (
        <div className="post-card">
            {/* Repost indicator */}
            {post.is_repost && (
                <div className="repost-indicator">🔁 {post.author_username} reposted</div>
            )}

            {/* Post header */}
            <div className="post-header">
                <div className="post-author">
                    <div className="avatar">
                        {post.author_username[0].toUpperCase()}
                    </div>
                    <div className="author-info">
                        <span
                            className="author-name"
                            onClick={() => navigate(`/profile/${post.author}`)}
                        >
                            @{post.author_username}
                        </span>
                        <span className="post-date">
                            {formatDate(post.created_at)}
                        </span>
                    </div>
                </div>
                {post.county && (
                    <span className="county-badge">📌 {post.county}</span>
                )}
            </div>

            {/* Post content */}
            <div
                className="post-content"
                onClick={() => navigate(`/post/${post.id}`)}
            >
                {post.caption && (
                    <p className="post-caption">{post.caption}</p>
                )}
                {post.image && (
                    <img src={post.image} alt="Post" className="post-image" />
                )}
            </div>

            {/* Language badge */}
            <div className="post-meta">
                <span className="language-badge">
                    {post.language === 'sw' ? 'Swahili' :
                     post.language === 'sheng' ? 'Sheng' : 'English'}
                </span>
            </div>

            {/* Action bar */}
            <div className="post-actions">
                {/* Reaction button */}
                <div className="reaction-wrapper">
                    <button
                        className={`action-btn ${userReaction ? 'reacted' : ''}`}
                        onClick={() => setShowReactions(!showReactions)}
                    >
                        {userReaction === 'moto'  ? '🔥' :
                         userReaction === 'sawa'  ? '💯' :
                         userReaction === 'cheka' ? '😂' :
                         userReaction === 'kumbe' ? '😯' : 
                         userReaction === 'pole'  ? '🙏' :
                         userReaction === 'nguvu' ? '💪' : '♥️'} 
                        <span>{formatCount(likesCount)}</span>
                    </button>
                    {showReactions && ( 
                        <ReactionBar onReact={handleReaction} />
                    )}
                </div>

                {/* Comments */}
                <button
                    className="action-btn"
                    onClick={() => navigate(`/post/${post.id}`)}
                >
                    💬 <span>{formatCount(post.comments_count)}</span>
                </button>

                {/* Repost */}
                <button className="action-btn" onClick={handleRepost}>
                    🔁 <span>{formatCount(post.reposts_count)}</span> 
                </button>

                {/* Save */}
                <button
                    className={`action-btn ${isSaved ? 'saved' : ''}`}
                    onClick={handleSave}
                >
                    {isSaved ? '🔖' : '🏷️'}  
                    <span>{formatCount(savesCount)}</span>
                </button>
            </div>
        </div> 
    );
}

export default PostCard;