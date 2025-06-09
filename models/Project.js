const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'on_hold'],
    default: 'upcoming',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    required: true
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  estimatedEndDate: {
    type: Date,
    default: null
  },
  client: {
    type: String,
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },
  teamMembers: [{
    type: String,
    trim: true
  }],
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative'],
    default: null
  },
  progress: {
    type: Number,
    min: [0, 'Progress cannot be less than 0'],
    max: [100, 'Progress cannot exceed 100'],
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ startDate: 1, endDate: 1 });
projectSchema.index({ title: 'text', description: 'text' }); // Text search

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days
  }
  return null;
});

// Virtual for overdue status
projectSchema.virtual('isOverdue').get(function() {
  if (this.endDate && this.status !== 'completed') {
    return new Date() > this.endDate;
  }
  return false;
});

// Pre-save middleware to validate dates
projectSchema.pre('save', function(next) {
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    const error = new Error('Start date cannot be after end date');
    error.name = 'ValidationError';
    return next(error);
  }
  
  // Auto-update progress to 100% if status is completed
  if (this.status === 'completed' && this.progress < 100) {
    this.progress = 100;
  }
  
  next();
});

// Static method to get project statistics
projectSchema.statics.getStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalProjects: { $sum: 1 },
        totalBudget: { $sum: '$budget' },
        averageProgress: { $avg: '$progress' },
        statusCounts: {
          $push: {
            status: '$status',
            count: 1
          }
        },
        priorityCounts: {
          $push: {
            priority: '$priority',
            count: 1
          }
        }
      }
    }
  ]);

  // Get status breakdown
  const statusBreakdown = await this.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get priority breakdown
  const priorityBreakdown = await this.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    ...stats[0],
    statusBreakdown: statusBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    priorityBreakdown: priorityBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
};

// Instance method to update progress
projectSchema.methods.updateProgress = function(newProgress) {
  this.progress = Math.max(0, Math.min(100, newProgress));
  
  // Auto-update status based on progress
  if (this.progress === 100 && this.status !== 'completed') {
    this.status = 'completed';
  } else if (this.progress > 0 && this.status === 'upcoming') {
    this.status = 'ongoing';
  }
  
  return this.save();
};

module.exports = mongoose.model('Project', projectSchema);