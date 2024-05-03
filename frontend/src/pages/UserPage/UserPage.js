import React, { useState, useEffect } from 'react';
import './UserPage.css';
import { USER_ENDPOINT } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import UserTable from '../../components/UserTable/UserTable';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if (!currentUser || currentUser.is_admin !== true) {
            // Redirect to home or login page if not admin
            navigate('/');
            return;
        }

        const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
        const fetchUsers = async () => {
            const response = await fetch(`${USER_ENDPOINT}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                // Handle errors
                console.error('Failed to fetch users');
            }
        };
        fetchUsers();
    }, [currentUser, navigate]);

    const deleteUser = async (emailId) => {
        const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
        const response = await fetch(`${USER_ENDPOINT}${emailId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        if (response.ok) {
            // Update the users state to remove the deleted user
            setUsers(users.filter(user => user.email_id !== emailId));
        } else {
            // Handle errors
            console.error('Failed to delete user');
        }
    };

    return (
        <div className="container my-4"> {/* This adds a top margin */}
            <h2 className="text-center py-0 mb-0">User List</h2> {/* This is your heading */}
            <div className="text-center py-2 mb-3">View and manage users below</div>
            <UserTable users={users} currentUser={currentUser} deleteUser={deleteUser} />
        </div>
    );
};

export default UserPage;
