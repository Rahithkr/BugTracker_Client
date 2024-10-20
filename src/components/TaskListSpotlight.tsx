import React, { useState } from "react";
import { cn } from "../lib/utils";
import { Spotlight } from "./ui/spotlight";
import { SidebarDash } from "./SidebarD";
import { TaskListTable } from "./TaskListTable";
import { TaskModal } from "./TaskModal";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


export function TaskListSpotlight() {
  const { projectId } = useParams();


  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (

    <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <SidebarDash />

      <Link to="/assignedlist"><button
        type="button"
        className="absolute top-0 right-0 text-gray-900 bg-gradient-to-r from-orange-400 to-red-400 hover:bg-gradient-to-l hover:from-red-400 hover:to-orange-300 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-teal-700 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-52 mt-10"
      >Assigned List</button>
      </Link>
      <button
        type="button"
        onClick={handleOpenModal}
        className="absolute top-0 right-0 text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-10 mt-10"
      >Create New Task</button>


      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 w-full relative z-10 flex flex-col items-center justify-center">

        <div className="w-full mb-36  max-w-7xl">
          {/* <TableDemo />  */}
          <TaskListTable />
        </div>
      </div>
      <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}