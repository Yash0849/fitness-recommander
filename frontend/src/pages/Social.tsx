import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChatMessage, User } from '../lib/localStorage';
import { Users, MessageSquare, Heart, Share2, Award, Plus, Image as ImageIcon, Send, Search } from 'lucide-react';
import Modal from '../components/Modal';
import ImageUpload from '../components/ImageUpload';
import { chatAPI } from '../lib/api';
import { profileAPI } from '../lib/api';

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
    badge: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLiked?: boolean;
}

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

export default function Social() {
  const { user } = useAuth();
  const postImageInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'chat'>('feed');
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        badge: '🏋️‍♀️ Elite Trainer'
      },
      content: 'Just completed a 5K run in 22 minutes! New personal best! 🎉',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      likes: 124,
      comments: [
        {
          id: 1,
          user: {
            name: 'Emma Wilson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
          },
          content: 'Amazing achievement! Keep it up! 💪',
          timestamp: '1 hour ago'
        }
      ],
      timestamp: '2 hours ago',
      isLiked: false
    },
    {
      id: 2,
      user: {
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        badge: '💪 Fitness Pro'
      },
      content: 'Here\'s my go-to healthy breakfast! Packed with proteins and healthy fats.',
      image: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=800',
      likes: 89,
      comments: [],
      timestamp: '5 hours ago',
      isLiked: false
    }
  ]);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', image: '' });
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const allUsers = chatAPI.getAllUsers().filter((u: any) => u.id !== user.id);
      setUsers(allUsers);
      const messages = chatAPI.getMessages(user.id);
      setChatMessages(messages);
      setUnreadCount(messages.filter((msg: any) => msg.receiverId === user.id && !msg.read).length);
      
      const userProfile = profileAPI.get(user.id);
      if (userProfile?.galleryImages) {
        setGalleryImages(userProfile.galleryImages);
      }
    }
  }, [user]);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (!newPost.content.trim()) return;

    const post: Post = {
      id: posts.length + 1,
      user: {
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        badge: '🌟 Fitness Enthusiast'
      },
      content: newPost.content,
      image: newPost.image || undefined,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      isLiked: false
    };

    setPosts([post, ...posts]);
    setNewPost({ content: '', image: '' });
    setIsCreatePostOpen(false);
  };

  const handlePostImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPost((current) => ({
        ...current,
        image: reader.result as string,
      }));
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, {
            id: post.comments.length + 1,
            user: {
              name: 'Current User',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
            },
            content: newComment,
            timestamp: 'Just now'
          }]
        };
      }
      return post;
    }));

    setNewComment('');
    setActiveCommentId(null);
  };

  const handleSendMessage = () => {
    if (!user || !selectedChat || !chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: user.id,
      receiverId: selectedChat.id,
      content: chatMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    chatAPI.saveMessage(newMessage);
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

  const handleGalleryPhotoSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setGalleryImages(prev => [...prev, base64String]);
      
              if (user) {
          const profile = profileAPI.get(user.id) || {};
          profileAPI.save(user.id, {
            ...profile,
            galleryImages: [...(profile.galleryImages || []), base64String]
          });
        }
      setShowGalleryModal(false);
    };
    reader.readAsDataURL(file);
  };

  const filteredUsers = users.filter(u => 
    u.profile?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChatMessages = (chatUser: User) => {
    return chatMessages.filter(msg => 
      (msg.senderId === user?.id && msg.receiverId === chatUser.id) ||
      (msg.senderId === chatUser.id && msg.receiverId === user?.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const feedStats = [
    { label: 'Members', value: `${users.length + 1}`, note: 'active connections' },
    { label: 'Posts', value: `${posts.length}`, note: 'shared updates' },
    { label: 'Photos', value: `${galleryImages.length}`, note: 'gallery moments' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Community Space</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-white">Fitness Community</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Share progress, browse community wins, and jump into private chats from a cleaner social workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('feed')}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium transition ${
              activeTab === 'feed'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium transition ${
              activeTab === 'chat'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat</span>
            {unreadCount > 0 && (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-3 font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95"
          >
            <Plus className="w-5 h-5" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-xl shadow-slate-950/30 backdrop-blur">
          <div className="grid h-[700px] grid-cols-12">
            <div className="col-span-12 border-b border-white/10 md:col-span-4 md:border-b-0 md:border-r">
              <div className="border-b border-white/10 p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition focus:border-cyan-400"
                  />
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div className="h-[280px] overflow-y-auto md:h-[calc(700px-81px)]">
                {filteredUsers.map(chatUser => (
                  <div
                    key={chatUser.id}
                    onClick={() => setSelectedChat(chatUser)}
                    className={`flex cursor-pointer items-center gap-4 border-b border-white/5 p-4 transition hover:bg-white/5 ${
                      selectedChat?.id === chatUser.id ? 'bg-cyan-500/10' : ''
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/15">
                      {chatUser.profile?.profilePhoto ? (
                        <img
                          src={chatUser.profile.profilePhoto}
                          alt={chatUser.profile.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-cyan-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {chatUser.profile?.fullName || chatUser.email}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {chatUser.profile?.username || 'Fitness Enthusiast'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 flex flex-col md:col-span-8">
              {selectedChat ? (
                <>
                  <div className="border-b border-white/10 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15">
                        {selectedChat.profile?.profilePhoto ? (
                          <img
                            src={selectedChat.profile.profilePhoto}
                            alt={selectedChat.profile.fullName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-5 h-5 text-cyan-300" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {selectedChat.profile?.fullName || selectedChat.email}
                        </h3>
                        <p className="text-sm text-slate-400">Ready to chat</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {getChatMessages(selectedChat).map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === user?.id
                              ? 'bg-cyan-500 text-white'
                              : 'bg-white/10 text-slate-100'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 p-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="rounded-2xl bg-cyan-500 p-3 text-white transition hover:bg-cyan-400"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="mx-auto mb-4 h-16 w-16 text-slate-500" />
                    <h3 className="mb-2 text-xl font-semibold text-white">No Chat Selected</h3>
                    <p className="text-slate-400">
                      Select a user from the list to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 mb-2 rounded-[2rem] border border-white/10 bg-gradient-to-r from-slate-900 via-indigo-900/80 to-cyan-900/70 p-6 shadow-xl shadow-slate-950/30">
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/80">Community Snapshot</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Fitness Gallery and shared wins</h2>
                <p className="mt-3 max-w-2xl text-sm text-slate-300">
                  Post milestones, upload transformation photos, and keep the social side of your journey in one place.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {feedStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-300">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-400">{stat.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Fitness Gallery</h2>
              <button
                onClick={() => setShowGalleryModal(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2 font-medium text-white transition hover:bg-indigo-400"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.length > 0 ? galleryImages.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                </div>
              )) : (
                <div className="col-span-full rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-8 text-center">
                  <p className="text-lg font-medium text-white">No gallery photos yet</p>
                  <p className="mt-2 text-sm text-slate-400">Upload progress photos to start building your fitness gallery.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {posts.map(post => (
              <div key={post.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-xl shadow-slate-950/30">
                <div className="p-6">
                  <div className="mb-4 flex items-center space-x-4">
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{post.user.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-400">{post.timestamp}</span>
                        <span className="rounded-full bg-indigo-500/15 px-2 py-1 text-xs text-indigo-200">
                          {post.user.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-4 text-slate-200">{post.content}</p>
                  
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="mb-4 h-64 w-full rounded-[1.5rem] object-cover"
                    />
                  )}
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex space-x-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 ${
                          post.isLiked ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      <button
                        onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                        className="flex items-center space-x-2 text-slate-400 hover:text-cyan-300"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span>{post.comments.length}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-slate-400 hover:text-cyan-300">
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex space-x-3">
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white">{comment.user.name}</span>
                            <span className="text-xs text-slate-400">{comment.timestamp}</span>
                          </div>
                          <p className="mt-1 text-slate-200">{comment.content}</p>
                        </div>
                      </div>
                    ))}

                    {activeCommentId === post.id && (
                      <div className="flex items-center space-x-3 mt-4">
                        <img
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                          alt="Current user"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 pr-10 text-white outline-none transition focus:border-cyan-400"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300 hover:text-cyan-200"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="glass-panel glow-border rounded-[2rem] p-6">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-white">
                <Award className="mr-2 h-6 w-6 text-indigo-300" />
                Top Achievers
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'Emma Wilson', achievement: '30-Day Streak', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
                  { name: 'David Kim', achievement: 'Weight Goal Reached', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
                ].map((achiever, index) => (
                  <div key={index} className="flex items-center space-x-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <img
                      src={achiever.avatar}
                      alt={achiever.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-white">{achiever.name}</p>
                      <p className="text-sm text-indigo-200">{achiever.achievement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel glow-border rounded-[2rem] p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">Trending Tags</h2>
              <div className="flex flex-wrap gap-2">
                {['#FitnessGoals', '#HealthyEating', '#WorkoutMotivation', '#FitFam', '#StrengthTraining'].map(tag => (
                  <span
                    key={tag}
                    className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-cyan-500/15 hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        title="Create New Post"
      >
        <div className="space-y-4">
          <textarea
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            placeholder="What's on your mind?"
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            ref={postImageInputRef}
            type="file"
            accept="image/*"
            onChange={handlePostImageSelect}
            className="hidden"
          />
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newPost.image}
              onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
              placeholder="Image URL (optional)"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => postImageInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-indigo-600"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsCreatePostOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePost}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Post
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        title="Add Photo to Gallery"
      >
        <ImageUpload onImageSelect={handleGalleryPhotoSelect}>
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors">
            <Plus className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Click or drag to upload a photo</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 10MB</p>
          </div>
        </ImageUpload>
      </Modal>
    </div>
  );
}
