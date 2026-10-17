import Task from '../models/Task.js';

// @desc    Get all tasks with search, filter, sort, pagination
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      assignedTo,
    } = req.query;

    // Build filter object
    const filter = {};

    // Admin sees all, users see their own tasks or tasks assigned to them
    if (req.user.role !== 'admin') {
      filter.$or = [
        { createdBy: req.user._id },
        { assignedTo: req.user._id },
      ];
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(filter),
    ]);

    // Dashboard stats
    const stats = await Task.aggregate([
      ...(req.user.role !== 'admin'
        ? [
            {
              $match: {
                $or: [
                  { createdBy: req.user._id },
                  { assignedTo: req.user._id },
                ],
              },
            },
          ]
        : []),
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statsMap = { pending: 0, 'in-progress': 0, completed: 0, cancelled: 0 };
    stats.forEach((s) => {
      statsMap[s._id] = s.count;
    });

    res.status(200).json({
      success: true,
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      stats: {
        total: Object.values(statsMap).reduce((a, b) => a + b, 0),
        pending: statsMap['pending'],
        inProgress: statsMap['in-progress'],
        completed: statsMap['completed'],
        cancelled: statsMap['cancelled'],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Check access (admin or creator or assigned user)
    if (
      req.user.role !== 'admin' &&
      task.createdBy._id.toString() !== req.user._id.toString() &&
      (!task.assignedTo || task.assignedTo._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this task.',
      });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo, tags } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Title and due date are required.',
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      tags: tags || [],
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Only creator or admin can update
    if (
      req.user.role !== 'admin' &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this task.',
      });
    }

    const { title, description, priority, status, dueDate, assignedTo, tags } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, status, dueDate, assignedTo, tags },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Only creator or admin can delete
    if (
      req.user.role !== 'admin' &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this task.',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats only
// @route   GET /api/tasks/stats
// @access  Private
export const getStats = async (req, res, next) => {
  try {
    const matchStage =
      req.user.role !== 'admin'
        ? {
            $match: {
              $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
            },
          }
        : null;

    const pipeline = [
      ...(matchStage ? [matchStage] : []),
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ];

    const stats = await Task.aggregate(pipeline);
    const statsMap = { pending: 0, 'in-progress': 0, completed: 0, cancelled: 0 };
    stats.forEach((s) => (statsMap[s._id] = s.count));

    const totalTasks = await Task.countDocuments(
      req.user.role !== 'admin'
        ? { $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }] }
        : {}
    );

    // Priority breakdown
    const priorityStats = await Task.aggregate([
      ...(matchStage ? [matchStage] : []),
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);
    const priorityMap = { low: 0, medium: 0, high: 0, urgent: 0 };
    priorityStats.forEach((p) => (priorityMap[p._id] = p.count));

    res.status(200).json({
      success: true,
      stats: {
        total: totalTasks,
        pending: statsMap['pending'],
        inProgress: statsMap['in-progress'],
        completed: statsMap['completed'],
        cancelled: statsMap['cancelled'],
        priority: priorityMap,
      },
    });
  } catch (error) {
    next(error);
  }
};
