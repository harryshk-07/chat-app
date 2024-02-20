import React from 'react';

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <span
      className="inline-block px-2 py-1 rounded-lg m-1 mb-2 bg-gray-600 text-white cursor-pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span className="pl-1">(Admin)</span>}
      <span className="pl-1">&times;</span>
    </span>
  );
};

export default UserBadgeItem;
