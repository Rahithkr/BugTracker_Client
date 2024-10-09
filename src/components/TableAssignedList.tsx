import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const TableAssignedList = () => {
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch task data from API when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/project/tasks/assignedlist');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setErrorMessage('Failed to fetch tasks. Please try again later.');
      }
    };

    fetchTasks();
  }, []);


  const handleVerificationChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/project/tasks/assignedlist/${taskId}`, {
        isVerified: newStatus === 'Verified', // Set isVerified based on the selection
      });
      // Update local state to reflect the change
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, isVerified: newStatus === 'Verified' } : task
        )
      );
    } catch (error) {
      console.error('Error updating task verification:', error);
      setErrorMessage('Failed to update verification status. Please try again.');
    }
  };

  return (
    <div className="overflow-x-auto">
      <h3 className='text-center text-4xl mb-10 text-white'>Assigned List</h3>
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      <table className="mb-10 min-w-full table-auto bg-gray-900 text-gray-100 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-800 text-left uppercase text-xs text-gray-400">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Project Name</th>
            <th className="px-6 py-3">Task Name</th>
            <th className="px-6 py-3">Task Description</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Employee Name</th>
            <th className="px-6 py-3">Employee Email</th>
            <th className="px-6 py-3">Start Date</th>
            <th className="px-6 py-3">Deadline</th>
            <th className="px-6 py-3">Approval</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Verification</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="bg-gray-800 hover:bg-gray-600 transition-all duration-200">
              <td className="px-6 py-4">{task.id}</td>
              <td className="px-6 py-4">{task.Project.name}</td>
              <td className="px-6 py-4">{task.taskName}</td>
              <td className="px-6 py-4">{task.description}</td>
              <td className="px-6 py-4">{task.assignedUser ? task.assignedUser.role : 'N/A'}</td>
              <td className="px-6 py-4">{task.assignedUser ? task.assignedUser.name : 'Unassigned'}</td>
              <td className="px-6 py-4">{task.assignedUser ? task.assignedUser.email : 'N/A'}</td>
              <td className="px-6 py-4">{new Date(task.starting).toLocaleDateString()}</td>
              <td className="px-6 py-4">{new Date(task.deadline).toLocaleDateString()}</td>
              <td className="px-6 py-4">Pending</td>
              <td className="px-6 py-4">In Progress</td>
              <td className="px-6 py-4">
              <select
                  className="p-2 border border-gray-300 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-4 focus:ring-green-500"
                  defaultValue={task.isVerified ? 'Verified' : 'Pending'}
                  onChange={(e) => handleVerificationChange(task.id, e.target.value)}
                >
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};