import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

// Define the task type based on your data structure
interface Task {
  id: string;
  projectName: string;
  taskName: string;
  description: string;
  starting?: string;
  deadline?: string;
  status: string;
  isCompleted?: boolean;
}

export const WorksTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const tasksPerPage = 4;
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const fetchTasks = async () => {
      try {

        if (user) {

          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/userDashboard/listApprovedTasks/${user?.id}`
          ,{withCredentials: true});
          setTasks(response.data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const isCompleted = newStatus === 'completed'; // Determine if the task is completed
    try {
      // Update the status and isCompleted in the database
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/userDashboard/changeTasksStatus/${taskId}`,  { 
        status: newStatus,
        isCompleted: isCompleted,
        
      },{withCredentials: true});
      
      // Update local state to reflect the changes
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus, isCompleted } : task
        )
      );

      alert('Task status updated successfully!');
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status.');
    }
  };

  // Calculate the displayed tasks based on the current page
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Create page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(tasks.length / tasksPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="overflow-x-auto">
      <h3 className='text-center text-4xl mb-10 text-white'>Task To Complete</h3>
      <table className="mb-10 min-w-full table-auto bg-gray-900 text-gray-100 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-800 text-left uppercase text-xs text-gray-400">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Project Name</th>
            <th className="px-6 py-3">Task Name</th>
            <th className="px-6 py-3">Task Description</th>
            <th className="px-6 py-3">Start Date</th>
            <th className="px-6 py-3">Deadline</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task) => (
            <tr key={task.id} className='bg-gray-700 hover:bg-gray-600 transition-all duration-200'>
              <td className="px-6 py-4">{task.id}</td>
              <td className="px-6 py-4">{task.projectName}</td>
              <td className="px-6 py-4">{task.taskName}</td>
              <td className="px-6 py-4">{task.description}</td>
              <td className="px-6 py-4">{task.starting ? new Date(task.starting).toLocaleDateString('en-US') : 'N/A'}</td>
              <td className="px-6 py-4">{task.deadline ? new Date(task.deadline).toLocaleDateString('en-US') : 'N/A'}</td>

              <td className="px-6 py-4">
                <select
                  className="p-2 border border-gray-300 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="started">Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center">
        <nav className="inline-flex space-x-1">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-4 py-2 border border-gray-300 bg-gray-800 text-white rounded-md ${
                currentPage === number ? 'bg-blue-500' : ''
              }`}
            >
              {number}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// export const WorksTable = () => {
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem('user'));

//         if (user && user.id) {
//           const userId = user.id;

//           const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/userDashboard/listApprovedTasks/${userId}`);
//           setTasks(response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching tasks:', error);
//       }
//     };

//     fetchTasks();
//   }, []);

//   const handleStatusChange = async (taskId, newStatus) => {
//     const isCompleted = newStatus === 'completed'; // Determine if the task is completed
//     try {
//       // Update the status and isCompleted in the database
//       await axios.put(`${import.meta.env.VITE_BASE_URL}/api/userDashboard/changeTasksStatus/${taskId}`, { 
//         status: newStatus,
//         isCompleted: isCompleted, // Send isCompleted status
//       });
      
//       // Update local state to reflect the changes
//       setTasks((prevTasks) =>
//         prevTasks.map((task) =>
//           task.id === taskId ? { ...task, status: newStatus, isCompleted } : task
//         )
//       );

//       alert('Task status updated successfully!');
//     } catch (error) {
//       console.error('Error updating task status:', error);
//       alert('Failed to update task status.');
//     }
//   };

//   return (
//     <div className="overflow-x-auto">
//       <h3 className='text-center text-4xl mb-10 text-white'>New Assignments</h3>
//       <table className="mb-10 min-w-full table-auto bg-gray-900 text-gray-100 rounded-lg shadow-md">
//         <thead>
//           <tr className="bg-gray-800 text-left uppercase text-xs text-gray-400">
//             <th className="px-6 py-3">ID</th>
//             <th className="px-6 py-3">Project Name</th>
//             <th className="px-6 py-3">Task Name</th>
//             <th className="px-6 py-3">Task Description</th>
//             <th className="px-6 py-3">Start Date</th>
//             <th className="px-6 py-3">Deadline</th>
//             <th className="px-6 py-3">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.map((task) => (
//             <tr key={task.id} className='bg-gray-700 hover:bg-gray-600 transition-all duration-200'>
//               <td className="px-6 py-4">{task.id}</td>
//               <td className="px-6 py-4">{task.projectName}</td>
//               <td className="px-6 py-4">{task.taskName}</td>
//               <td className="px-6 py-4">{task.description}</td>
//               <td className="px-6 py-4">{task.starting ? new Date(task.starting).toLocaleDateString('en-US') : 'N/A'}</td>
//               <td className="px-6 py-4">{task.deadline ? new Date(task.deadline).toLocaleDateString('en-US') : 'N/A'}</td>

//               <td className="px-6 py-4">
//                 <select
//                   className="p-2 border border-gray-300 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   defaultValue={task.status}
//                   onChange={(e) => handleStatusChange(task.id, e.target.value)}
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="started">Started</option>
//                   <option value="in-progress">In Progress</option>
//                   <option value="completed">Completed</option>
//                 </select>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };