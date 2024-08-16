const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Like', 'Love', 'Haha', 'Angry'],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Reaction = mongoose.model('Reaction', ReactionSchema);

module.exports = Reaction;
