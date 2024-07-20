import { SET_CURRENT_CHAT_ROOM, SET_PRIVATE_CHAT_ROOM, SET_USER_POSTS } from './types';

export function setCurrentChatRoom(currentChatRoom) {
	return {
		type: SET_CURRENT_CHAT_ROOM,
		payload: currentChatRoom
	}
}

export function setPrivateChatRoom(isPrivate) {
	return {
		type: SET_PRIVATE_CHAT_ROOM,
		payload: isPrivate
	}
}

export function setUserPosts(userPost) {
	return {
		type: SET_USER_POSTS,
		payload: userPost
	}	
}