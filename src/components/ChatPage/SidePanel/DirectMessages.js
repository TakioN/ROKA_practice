import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../../../firebase';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';

import { FaRegSmile } from 'react-icons/fa';

class DirectMessages extends Component {
	
	state = {
		usersRef: firebase.ref(firebase.getDatabase(), 'users'),
		users: [],
		activeChatRoom: ''
	}
	
	componentDidMount() {
		if(this.props.user){
			this.addUsersListeners(this.props.user.uid);
		}
	} 
	
	componentDidUpdate(prevProps) {
		//초기값 null -> user 패치되는 순간 리스너 실행
		if(!(prevProps.user === this.props.user)) {
			if(this.props.user) {
				this.addUsersListeners(this.props.user.uid);
			}
		}
		//Dm -> 공개방 전환시 Dm채팅방 음영 삭제
		if(prevProps.currentChatRoom) {
			if(prevProps.isPrivate === true && this.props.isPrivate === false) {
				this.setState({activeChatRoom: ''});
			}
		}
	}

	
	//친구 목록 담기
	addUsersListeners = (currentUserId) => {
		let usersArray = [];
		firebase.onChildAdded(this.state.usersRef, (data) => {
			if(currentUserId !== data.key) {
				let user = data.val();
				user['uid'] = data.key;
				user['state'] = 'offline';
				usersArray.push(user);
				this.setState({users: usersArray});
			}
		})
	}

	//DM채팅방으로 변경
	changeChatRoom = (user) => {
		const chatRoomId = this.getChatRoomId(user);
		const chatRoomData = {
			id: chatRoomId,
			name: user.name
		};

		this.props.setStoreRoom(chatRoomData);
		this.props.setPrivateRoom(true);
		this.setActiveChatRoom(user.uid);
	}

	//현재 입장 중인 DM채팅방일 경우 음영처리
	setActiveChatRoom = (userId) => {
		this.setState({activeChatRoom: userId});
	}
	
	//DM목록 렌더링
	renderDirectMessages = users => (
		users.length > 0 && users.map(user => (
			<li 
				key={user.uid} 
				onClick={() => {this.changeChatRoom(user)}}
				style={{backgroundColor: this.state.activeChatRoom === user.uid ? '#FFFFFF45' : 'transparent'}}
			>
				# {user.name}
			</li>
		))
	)

	//DM 채팅방 ID 생성
	getChatRoomId = (user) => {
		const currentUser = this.props.user;
		return user.uid < currentUser.uid ?
		`${user.uid}/${currentUser.uid}` :
		`${currentUser.uid}/${user.uid}`;
	}

	
	
	render() {
		
		const { users } = this.state;
		
		return(
			<div>
				<span style={{display: 'flex', alignItems: 'center'}}>
					<FaRegSmile style={{marginRight: 3}} />DIRECT MESSAGES(1)
				</span>
				
				<ul style={{listStyle: 'none', padding: 0}}>
					{this.renderDirectMessages(users)}
				</ul>
			</div>
		);
	}
}
	
const mapStateToProps = (state) => ({
	user: state.user.currentUser,
	currentChatRoom: state.chatRoom.currentChatRoom,
	isPrivate: state.chatRoom.isPrivateChatRoom
});

const mapDispatchToProps = (dispatch) => ({
	setStoreRoom: (chatRoomData) => dispatch(setCurrentChatRoom(chatRoomData)),
	setPrivateRoom: (isPrivate) => dispatch(setPrivateChatRoom(isPrivate))
})

export default connect(mapStateToProps, mapDispatchToProps)(DirectMessages);