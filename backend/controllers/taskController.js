import Task from '../models/Task.js';

// @desc    Get all tasks with optional search, filtering, and sorting
// @route   GET /api/tasks
// @access  Public
export const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, category, sortBy, sortOrder } = req.query;

    const query = {};

    // Searching title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtering by status
    if (status) {
      query.status = status;
    }

    // Filtering by priority
    if (priority) {
      query.priority = priority;
    }

    // Filtering by category
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Default sorting options
    let sortOptions = { createdAt: -1 };

    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      
      if (sortBy === 'dueDate') {
        // Sort null dates to the end
        sortOptions = {
          dueDate: order,
          createdAt: -1
        };
      } else if (sortBy === 'priority') {
        // High = 3, Medium = 2, Low = 1
        // We can sort priority by doing custom mappings, but in Mongo standard collation or sorting can be tricky.
        // For simplicity, we sort alphabetically (high/low/medium) or by field.
        // Let's sort alphabetically for simple query, or we can sort by priority field.
        // Let's implement alphabetical or simple sorting, and handle priority order client-side if needed,
        // or sort by priority string representation. Let's sort by priority field.
        sortOptions = { priority: order, createdAt: -1 };
      } else {
        sortOptions = { [sortBy]: order };
      }
    }

    const tasks = await Task.find(query).sort(sortOptions);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Public
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, category } = req.body;

    if (!title || title.trim() === '') {
      res.status(400);
      throw new Error('Task title is required');
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate || null,
      priority: priority || 'medium',
      category: category ? category.trim() : 'general',
      status: 'pending'
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (supports editing fields or toggling status)
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, category, status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category.trim();
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task removed successfully' });
  } catch (error) {
    next(error);
  }
};
