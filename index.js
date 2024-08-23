import reactionRoutes from './reactionRoutes';
import commentRoutes from './commentRoutes';
import commentReactionRoutes from './commentReactionRoute';
import friendRequestRoutes from './friendRequestRoute';

app.use('/api/comments', commentRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/comment-reactions', commentReactionRoutes);
app.use('/api/friend-requests', friendRequestRoutes);