import React, { useEffect, useState } from 'react'
import TesterProfileCard from './TesterComponent/TesterProfileSidebar'
import axios from 'axios';
import TesterNavbar from '../TesterNavbar';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';


function TesterProfile() {

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: ''
  });
  const { user } = useSelector((state: RootState) => state.auth)
  const Id = user?.id


  useEffect(() => {

    if (Id) {
      // Make a backend request to fetch user data
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/tester/testerprofile/${Id}`,{withCredentials:true});
          const { name, email, phoneNumber, role } = response.data;
          setUserData({ name, email, phoneNumber, role });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    } else {
      console.error('No userId found in localStorage');
    }
  }, []);

  return (
    <>
      <TesterNavbar />
      <div className="flex flex-col md:flex-row h-screen bg-gray-600">

        <TesterProfileCard />

        <main className="flex-1 p-6 md:p-8">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  readOnly
                  value={userData.name}
                  className="block md:w-full  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Email</label>
              <div className="mt-1">
                <input
                  type="email"
                  readOnly
                  value={userData.email}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Phone</label>
              <div className="mt-1">
                <input
                  type="tel"
                  readOnly
                  value={userData.phoneNumber}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Designation</label>
              <div className="mt-1">
                <input
                  type="tel"
                  readOnly
                  value={userData.role}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                />
              </div>
            </div>
            <div>

            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default TesterProfile