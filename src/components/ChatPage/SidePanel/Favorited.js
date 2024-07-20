import { Component } from 'react';
import { connect } from 'react-redux';

import firebase from '../../../firebase';

import { FaRegSmileBeam } from 'react-icons/fa';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';

class Favorited extends Component {

	state ={
		userRef: firebase.ref(firebase.getDatabase(), 'users'),
		favoritedChatRoom: [],
		activeChatRoomId: ''
	}

	componentDidMount() {
		if(this.props.currentUser) {
			this.addListeners();
		}
	}

	componentDidUpdate(prevProps) {
		if(prevProps.currentUser === null && this.props.currentUser !== null) {
			this.addListeners();
		}
		if(prevProps.currentChatRoom) {
			if(prevProps.currentChatRoom.id !== this.props.currentChatRoom.id) {
				this.setState({activeChatRoomId: this.props.currentChatRoom.id});
			}
		}
		// 최초 렌더링 시 activeChatRoomId 설정
		if(prevProps.currentChatRoom === null && this.props.currentChatRoom !== null) {
			this.setState({activeChatRoomId: this.props.currentChatRoom.id});
		}
	}

	addListeners = () => {
		//데이터베이스에 추가되면 Favorite 배열에 추가
		firebase.onChildAdded(firebase.child(this.state.userRef, `${this.props.currentUser.uid}/favorited`), snapshot => {
			const favoritedChatRoom = {id: snapshot.key, ...snapshot.val()};
			this.setState({favoritedChatRoom: [...this.state.favoritedChatRoom, favoritedChatRoom]});
		});
		//데이터베이스에서 삭제되면 Favorite 배열에서 삭제
		firebase.onChildRemoved(firebase.child(this.state.userRef, `${this.props.currentUser.uid}/favorited`), snapshot => {
			const filteredChatRoom = this.state.favoritedChatRoom.filter(chatRoom => chatRoom.id !== snapshot.key)
			this.setState({favoritedChatRoom: filteredChatRoom});
		});
	}

	renderFavoritedChatRooms = (favoritedChatRooms) => 
		favoritedChatRooms.length > 0 && favoritedChatRooms.map(chatRoom => (
			<li 
				key={chatRoom.id}
				onClick={() => {this.changeChatRoom(chatRoom)}}
				style={{backgroundColor: chatRoom.id === this.state.activeChatRoomId && "#FFFFFF45"}}
			>
				# {chatRoom.name}
			</li>
		))

	changeChatRoom = (chatRoom) => {
		const { setStoreRoom, setPrivateRoom } = this.props;
		setStoreRoom(chatRoom);
		setPrivateRoom(false);
		this.setState({ activeChatRoomId: chatRoom.id });
	}
	

	render() {

		const {favoritedChatRoom} = this.state;

		return(
			<div>
				<span style={{ display: 'flex', alignItems: 'center'}}>
					<FaRegSmileBeam style={{marginRight: '3px'}} />
					FAVORITED (1)
				</span>
				<ul style={{listStyleType: 'none', padding: 0}}>
					{this.renderFavoritedChatRooms(favoritedChatRoom)}
				</ul>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.user.currentUser,
		currentChatRoom: state.chatRoom.currentChatRoom
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setStoreRoom: chatRoom => dispatch(setCurrentChatRoom(chatRoom)),
		setPrivateRoom: isPrivate => dispatch(setPrivateChatRoom(isPrivate))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorited);