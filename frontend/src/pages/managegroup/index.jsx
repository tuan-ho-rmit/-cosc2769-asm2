// import React, { useState, useEffect } from 'react';

// const ManageGroup = () => {
//   const [groups, setGroups] = useState([]);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/groups');
//         const result = await response.json();
//         setGroups(result);
//       } catch (error) {
//         console.error('Error fetching groups:', error);
//       }
//     };

//     fetchGroups();
//   }, []);

//   const handleEdit = (groupId) => {
//     // Edit logic (e.g., redirect to an edit page or open an edit modal)
//     console.log('Edit group with ID:', groupId);
//   };

//   const handleDelete = async (groupId) => {
//     if (window.confirm('Are you sure you want to delete this group?')) {
//       try {
//         const response = await fetch(`http://localhost:3000/api/groups/${groupId}`, {
//           method: 'DELETE',
//         });
//         if (response.ok) {
//           setGroups(groups.filter(group => group._id !== groupId));
//         } else {
//           throw new Error('Failed to delete group');
//         }
//       } catch (error) {
//         console.error('Error deleting group:', error);
//       }
//     }
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2 style={{ color: '#EEEEEE', marginBottom: '1rem' }}>Manage Groups</h2>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
//         {groups.map(group => (
//           <div key={group._id} style={{ backgroundColor: '#393E46', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
//               <img
//                 src={group.avatar}
//                 alt={group.groupName}
//                 style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '1rem' }}
//               />
//               <h3 style={{ color: '#FFD369', margin: 0 }}>{group.groupName}</h3>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <button
//                 onClick={() => handleEdit(group._id)}
//                 style={{ padding: '0.5rem 1rem', backgroundColor: '#FFD369', color: '#222831', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(group._id)}
//                 style={{ padding: '0.5rem 1rem', backgroundColor: '#222831', color: '#EEEEEE', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ManageGroup;
