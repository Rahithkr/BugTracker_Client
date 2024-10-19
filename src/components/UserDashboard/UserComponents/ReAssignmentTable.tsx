import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface Task {
  reassignId: number;
  task?: {
    projectName: string;
    taskName: string;
    status: string;
  };
  tester?: {
    name: string;
  };
  severity: string;
  bugReport?: {
    steps: string;
    result: string;
    fileLink: string[];
  };
  previousDeveloper?: {
    name: string;
  };
  deadline: string;
}

export const ReAssignmentTable: React.FC = () => {
  const [reassignedTasks, setReassignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Store selected task for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchReassignedTasks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/userDashboard/reassignedList`,
          {
            params: { userid: user?.id },
          }
        );
        setReassignedTasks(response.data);
      } catch (error) {
        setError('Failed to fetch reassigned tasks');
      }
    };

    fetchReassignedTasks();
  }, [user?.id]);

  // Open the modal and set the selected task
  const handleViewMore = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null); // Clear the selected task when closing
  };

  return (
    <div className="overflow-x-auto">
      <h3 className="text-center text-4xl mb-10 text-white">Re-Assignment</h3>
      <table className="mb-10 min-w-full table-auto bg-gray-900 text-gray-100 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-800 text-left uppercase text-xs text-gray-400">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Project Name</th>
            <th className="px-6 py-3">Task Name</th>
            <th className="px-6 py-3">Tester</th>
            <th className="px-6 py-3">Severity</th>
            <th className="px-6 py-3">Steps</th>
            <th className="px-6 py-3">Previous Developer</th>
            <th className="px-6 py-3">Bug Report Result</th>
            <th className="px-6 py-3">Deadline</th>
            <th className="px-6 py-3">Bug Report</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {reassignedTasks.length > 0 ? (
            reassignedTasks.map((task) => (
              <tr key={task.reassignId} className="bg-gray-800 hover:bg-gray-600 transition-all duration-200">
                <td className="px-6 py-4">{task.reassignId}</td>
                <td className="px-6 py-4">{task.task?.projectName || 'N/A'}</td>
                <td className="px-6 py-4">{task.task?.taskName || 'N/A'}</td>
                <td className="px-6 py-4">{task.tester?.name || 'N/A'}</td>
                <td className="px-6 py-4">{task.severity || 'N/A'}</td>
                <td className="px-6 py-4">{task.bugReport?.steps || 'N/A'}</td>
                <td className="px-6 py-4">{task.previousDeveloper?.name || 'N/A'}</td>
                <td className="px-6 py-4">{task.bugReport?.result || 'N/A'}</td>
                <td className="px-6 py-4">{new Date(task.deadline).toLocaleDateString() || 'N/A'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewMore(task)}
                    className="bg-blue-500 text-white rounded-md px-2 py-1"
                  >
                    View More
                  </button>
                </td>
                <td className="px-6 py-4">
                  <select
                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    defaultValue={task.task?.status || 'pending'}
                  >
                    <option value="pending">Pending</option>
                    <option value="started">Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="text-center py-4">
                No reassigned tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for showing task details */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl mb-4">Task Details for ID: {selectedTask.reassignId}</h2>
            <p><strong>Task Name:</strong> {selectedTask.task?.taskName || 'N/A'}</p>
            <p><strong>Steps:</strong> {selectedTask.bugReport?.steps || 'N/A'}</p>

            {/* Display image previews if available */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {Array.isArray(selectedTask.bugReport?.fileLink) && selectedTask.bugReport.fileLink.length > 0 ? (
                selectedTask.bugReport.fileLink.map((file, index) => {
                  const imageUrl = `${import.meta.env.VITE_BASE_URL}${file}`;
                  return (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Uploaded file ${index + 1}`}
                      className="mb-4 w-full h-auto"
                    />
                  );
                })
              ) : (
                <p>No images uploaded</p>
              )}
            </div>

            <button
              className="mt-4 bg-blue-500 text-white rounded-md px-4 py-2"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
