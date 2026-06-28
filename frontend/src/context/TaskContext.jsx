import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const TaskContext = createContext();

// Detect backend API URL based on environment or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Toast notifications state
  const [toast, setToast] = useState({ show: false, message: '' });

  // Filter and sort options state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Display a feedback toast temporarily
  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  // Fetch tasks from API (memoized with useCallback)
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build search params
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.category) params.category = filters.category;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;

      const response = await axios.get(API_BASE_URL, { params });
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.message || 'Failed to fetch tasks from server');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Add a task
  const addTask = async (taskData) => {
    try {
      const response = await axios.post(API_BASE_URL, taskData);
      // Immutably append newly created task to state
      setTasks((prev) => [response.data, ...prev]);
      triggerToast('Task created successfully');
      return { success: true };
    } catch (err) {
      console.error('Error adding task:', err);
      const errMsg = err.response?.data?.message || 'Failed to add task';
      triggerToast(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Update a task
  const editTask = async (id, taskData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, taskData);
      // Update the specific task in state in-place
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response.data : task))
      );
      triggerToast('Task updated successfully');
      return { success: true };
    } catch (err) {
      console.error('Error updating task:', err);
      const errMsg = err.response?.data?.message || 'Failed to update task';
      triggerToast(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Toggle completed status shortcut
  const toggleTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? response.data : task))
      );
      triggerToast(newStatus === 'completed' ? 'Task marked completed' : 'Task marked pending');
    } catch (err) {
      console.error('Error toggling task status:', err);
      triggerToast(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      // Remove from list dynamically
      setTasks((prev) => prev.filter((task) => task._id !== id));
      triggerToast('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
      triggerToast(err.response?.data?.message || 'Failed to delete task');
    }
  };

  // Fetch whenever filters modify
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        toast,
        filters,
        setFilters,
        fetchTasks,
        addTask,
        editTask,
        toggleTaskStatus,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
