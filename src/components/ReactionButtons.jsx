import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { formatReactionCount } from '../utils/numberFormatter'
import './ReactionButtons.css'

export default function ReactionButtons({
  entityId,
  theme = 'light',
  initialLikes = 0,
  initialDislikes = 0,
  serverData = null,
  onReactionChange = null,
  className = '',
}) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [userReaction, setUserReaction] = useState(null)
  const [loading, setLoading] = useState(false)

  // Sync with serverData when provided by parent
  useEffect(() => {
    if (serverData) {
      if (serverData.totalLikes !== undefined) setLikes(serverData.totalLikes)
      if (serverData.totalDislikes !== undefined) setDislikes(serverData.totalDislikes)
      if (serverData.userReaction !== undefined) setUserReaction(serverData.userReaction)
    }
  }, [serverData])

  const handleAction = async (action) => {
    if (loading || !entityId) return

    // If user is not logged in, seamlessly redirect to sign-in with return state
    if (!user) {
      navigate('/signin', {
        state: {
          from: location.pathname + (location.search || '')
        }
      })
      return
    }

    const prevReaction = userReaction
    const prevLikes = likes
    const prevDislikes = dislikes

    // Optimistic UI state calculation
    let nextReaction = null
    let nextLikes = likes
    let nextDislikes = dislikes

    if (prevReaction === action) {
      // Toggle off
      nextReaction = null
      if (action === 'like') nextLikes = Math.max(0, likes - 1)
      if (action === 'dislike') nextDislikes = Math.max(0, dislikes - 1)
    } else {
      // Switch or new action
      nextReaction = action
      if (prevReaction === 'like') nextLikes = Math.max(0, likes - 1)
      if (prevReaction === 'dislike') nextDislikes = Math.max(0, dislikes - 1)

      if (action === 'like') {
        nextLikes = nextLikes + 1
      } else if (action === 'dislike') {
        // Optimistically increment or preserve local visual feedback
        nextDislikes = nextDislikes + 1
      }
    }

    // Set optimistic values immediately for instant feedback
    setUserReaction(nextReaction)
    setLikes(nextLikes)
    setDislikes(nextDislikes)
    setLoading(true)

    try {
      const { data } = await api.post(`/reactions/${entityId.toLowerCase()}`, {
        action,
      })

      if (data) {
        setLikes(data.totalLikes ?? nextLikes)
        setDislikes(data.totalDislikes ?? nextDislikes)
        setUserReaction(data.userReaction ?? nextReaction)
        if (onReactionChange) {
          onReactionChange(entityId, data)
        }
      }
    } catch (err) {
      console.error(`Error submitting ${action} for ${entityId}:`, err)
      // If 401 unauthenticated, redirect to signin
      if (err.response?.status === 401) {
        navigate('/signin', {
          state: {
            from: location.pathname + (location.search || '')
          }
        })
      }
      // Rollback on error
      setUserReaction(prevReaction)
      setLikes(prevLikes)
      setDislikes(prevDislikes)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`reaction-buttons-group ${theme === 'dark' ? 'reaction-buttons-dark' : ''} ${className}`}>
      {/* Like Button */}
      <button
        type="button"
        className={`reaction-btn-col ${userReaction === 'like' ? 'is-active' : ''}`}
        onClick={() => handleAction('like')}
        title={user ? (userReaction === 'like' ? 'Unlike' : 'Like') : 'Sign in to like'}
        aria-label={`Like (${likes})`}
      >
        <i className={`bi ${userReaction === 'like' ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'} reaction-btn-icon`}></i>
        <span className="reaction-btn-count">{formatReactionCount(likes)}</span>
      </button>

      {/* Dislike Button */}
      <button
        type="button"
        className={`reaction-btn-col ${userReaction === 'dislike' ? 'is-active' : ''}`}
        onClick={() => handleAction('dislike')}
        title={user ? (userReaction === 'dislike' ? 'Remove dislike' : 'Dislike') : 'Sign in to dislike'}
        aria-label={`Dislike (${dislikes})`}
      >
        <i className={`bi ${userReaction === 'dislike' ? 'bi-hand-thumbs-down-fill' : 'bi-hand-thumbs-down'} reaction-btn-icon`}></i>
        <span className="reaction-btn-count">{formatReactionCount(dislikes)}</span>
      </button>
    </div>
  )
}
