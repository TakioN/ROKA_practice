import { SET_CURRENT_CHAT_ROOM } from '../actions/types';

const initialUserState = {
	currentChatRoom: null
}

export default function(state = initialUserState, action) {
	switch(action.type) {
		case SET_CURRENT_CHAT_ROOM:
			return {
				...state,
				currentChatRoom: action.payload
			};
		default:
			return state;
	}
}