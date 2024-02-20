import React from "react";

const UserListItem = ({user, handleFunction }) => {

  return (
    <div
      onClick={handleFunction}
      className="mt-4 cursor-pointer bg-gray-300 hover:bg-teal-500 hover:text-white w-full flex items-center text-black px-3 py-2 mb-2 rounded-lg"
    >
      <div className="mr-2">
        <img
          className="w-8 h-8 rounded-full cursor-pointer"
          src={user.pic}
          alt={user.name}
        />
      </div>
      <div>
        <p className="font-bold">{user.name}</p>
        <p className="text-xs">
          <b>Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;