const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User', 
      },
    ],
    // Optional reference to the Article that originated the conversation
    article: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: false,
    },
  },
  {
    
    timestamps: true,
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
