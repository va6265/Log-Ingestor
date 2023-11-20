const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    level: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    resourceId: {
        type: String,
        trim: true,
    },
    timestamp: {
      type: Date,
    },
    traceId: {
      type: String,
      trim: true,
    },
    spanId: {
        type: String,
        trim: true,
    },
    commit:{
        type: String,
        trim: true,
    },
    metadata:{
        parentResourceId:{
            type: String,
            trim: true,
        }
    },
  });

  // Add text indexes for fields where you want to support full-text search
// logSchema.index({ level: 'text', message: 'text', resourceId:'text', traceId: 'text', spanId: 'text', commit: 'text' });



// logSchema.index({'$**': 'text'});

  const Log = mongoose.model('Log', logSchema);

  module.exports = Log;