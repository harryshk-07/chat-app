import React from 'react'

const ChatLoading = () => {
  return (
    <table class="table w-full max-w-4xl">
        <tbody>
		<tr>
			<th><div class="skeleton h-5 rounded-md"></div></th>
		</tr>
		<tr>
			<th><div class="skeleton h-5 rounded-md"></div></th>
		</tr>
		<tr>
			<th><div class="skeleton h-5 rounded-md"></div></th>
		</tr>
		<tr>
			<th><div class="skeleton h-5 rounded-md"></div></th>
		</tr>
	</tbody>
        </table>

  )
}

export default ChatLoading