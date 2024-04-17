// UsersTable.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import './UserTable.css'

const UserTable = ({ users, deleteUser }) => {
    const { currentUser } = useAuth();
    return (
        <div className="d-flex justify-content-center">
            <div className="w-75">
                <table className="table table-hover">
                <thead className="thead-dark">
                    <tr>
                    <th>Username</th>
                    <th>Email ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>DOB</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                    <tr key={user.email_id}>
                        <td>{user.username}</td>
                        <td>{user.email_id}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.dob}</td>
                        <td>
                        {user.email_id !== currentUser.email_id && (
                            <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user.email_id)}>
                            <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
