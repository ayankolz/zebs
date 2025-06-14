import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { MdOutlineCheckCircleOutline } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { MdAccountCircle } from "react-icons/md";

export const Sidebardata = [
    {
        title: 'Dashboard',
        path: 'advance', // Relative to /dashboard
        icon: <RxDashboard />,
        className: 'nav-text'
    },
    {
        title: 'Account',
        path: 'account',
        icon: <MdAccountCircle />,
        className: 'nav-text'
    }
];

// Function to fetch user group from JWT and modify Sidebardata if needed
export function useUserGroup() {
    const [sidebardata, setSidebardata] = useState(Sidebardata); // State to manage sidebar items

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                // Decode the JWT token to access user information
                const decodedToken = jwtDecode(accessToken);
                const group = decodedToken.usergrp;
                
                // Check if the user is a Manager or CEO
                const isAccountant = group === 'Accountant';
    
                // Update sidebar data based on user's group
                if (isAccountant) {
                    // Define the 'Approval' item for Manager
                    const approvalItem = {
                        title: 'Approval',
                        path: 'approvalAccountant', // Relative to /dashboard
                        icon: <MdOutlineCheckCircleOutline />,
                        className: 'nav-text'
                    };
    
                    // Find the index of 'Account' in the current sidebar data
                    const accountIndex = sidebardata.findIndex(item => item.title === 'Account');
    
                    // Create a new sidebar data array with 'Approval' item inserted before 'Account'
                    const updatedSidebardata = [
                        ...sidebardata.slice(0, accountIndex),
                        approvalItem,
                        ...sidebardata.slice(accountIndex)
                    ];
    
                    // Update state with the new sidebar data
                    setSidebardata(updatedSidebardata);
                }
            } catch (error) {
                console.error('Error decoding JWT token:', error);
            }
        }
    }, []);
    

    return sidebardata; // Return the modified sidebar data
}
