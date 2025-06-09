const Project = require('../models/Project');
const mongoose = require('mongoose');

// Get all projects with filtering and pagination
exports.getProjects = async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      client, 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      search 
    } = req.query;

    // Build filter object
    const filter = { createdBy: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (client) filter.client = new RegExp(client, 'i');

    // Add text search if provided
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { client: new RegExp(search, 'i') }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get projects with pagination
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    // Get total count for pagination info
    const totalProjects = await Project.countDocuments(filter);
    const totalPages = Math.ceil(totalProjects / parseInt(limit));

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProjects,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

// Get single project by ID
exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    const project = await Project.findOne({ 
      _id: id, 
      createdBy: req.user._id 
    })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      createdBy: req.user._id
    };

    // Validate required fields
    if (!projectData.title || !projectData.description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Create project
    const project = new Project(projectData);
    await project.save();

    // Populate user data before sending response
    await project.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    // Find project and verify ownership
    const project = await Project.findOne({ 
      _id: id, 
      createdBy: req.user._id 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Update project with new data
    const updateData = {
      ...req.body,
      updatedBy: req.user._id
    };

    // Remove fields that shouldn't be updated
    delete updateData.createdBy;
    delete updateData._id;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    )
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    // Find and delete project (verify ownership)
    const project = await Project.findOneAndDelete({ 
      _id: id, 
      createdBy: req.user._id 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

// Get project statistics
exports.getProjectStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get basic counts
    const totalProjects = await Project.countDocuments({ createdBy: userId });
    const upcomingProjects = await Project.countDocuments({ 
      createdBy: userId, 
      status: 'upcoming' 
    });
    const ongoingProjects = await Project.countDocuments({ 
      createdBy: userId, 
      status: 'ongoing' 
    });
    const completedProjects = await Project.countDocuments({ 
      createdBy: userId, 
      status: 'completed' 
    });
    const onHoldProjects = await Project.countDocuments({ 
      createdBy: userId, 
      status: 'on_hold' 
    });

    // Get total budget
    const budgetStats = await Project.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: '$budget' },
          averageBudget: { $avg: '$budget' },
          averageProgress: { $avg: '$progress' }
        }
      }
    ]);

    // Get overdue projects
    const overdueProjects = await Project.countDocuments({
      createdBy: userId,
      endDate: { $lt: new Date() },
      status: { $nin: ['completed'] }
    });

    // Get projects by priority
    const priorityStats = await Project.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent projects (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentProjects = await Project.countDocuments({
      createdBy: userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const stats = {
      totalProjects,
      statusBreakdown: {
        upcoming: upcomingProjects,
        ongoing: ongoingProjects,
        completed: completedProjects,
        on_hold: onHoldProjects
      },
      priorityBreakdown: priorityStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      budgetStats: budgetStats[0] || {
        totalBudget: 0,
        averageBudget: 0,
        averageProgress: 0
      },
      overdueProjects,
      recentProjects,
      completionRate: totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project statistics',
      error: error.message
    });
  }
};

// Update project progress
exports.updateProjectProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const project = await Project.findOne({ 
      _id: id, 
      createdBy: req.user._id 
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Use the instance method to update progress
    await project.updateProgress(progress);
    await project.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Project progress updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Update project progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project progress',
      error: error.message
    });
  }
};