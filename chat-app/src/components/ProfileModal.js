import React from 'react'

const ProfileModal = ({ user, children }) => {
  return (
    <div><label className='bg-gray-500 text-white rounded-xl p-1' for="modal-3">Info</label>
     <input class="modal-state" id="modal-3" type="checkbox" />
            <div class="modal">
	<label class="modal-overlay" for="modal-3"></label>
	<div class="modal-content flex flex-col gap-5">
		<label for="modal-3" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
    <div className='flex justify-center'>
    <img src={user.pic} className='avatar avatar-ring avatar-md' alt="profile" />
    </div>
		<h2 class="text-xl font-bold">{user.name}</h2>
		<h3>{user.email}</h3>
	</div>
</div>
    </div>
  )
}

export default ProfileModal