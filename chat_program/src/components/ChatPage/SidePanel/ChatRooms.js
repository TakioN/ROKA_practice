import React, { Component } from 'react';
import firebase from '../../../firebase';
import { connect } from 'react-redux';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';

import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';

class ChatRooms extends Component {
	state = {
		show: false,
		name: "",
		description: "",
		chatRoomsRef: firebase.ref(firebase.getDatabase(), 'chatRooms'),
		messagesRef: firebase.ref(firebase.getDatabase(), 'messages'),
		chatRooms: [],
		firstLoad: true,
		activeChatRoomId: "",
		notifications: []
	};
	
	handleClose = () => {
		this.setState({show: false});
	}
	handleShow = () => {
		this.setState({show: true});
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const { name, description } = this.state;
		if(this.isFormValid(name, description))
			this.addChatRoom();
		
	}
	addChatRoom = () => {
		const { name, description } = this.state;
		const { currentUser } = this.props;
		const key = firebase.push(this.state.chatRoomsRef).key;
		const newChatRoom = {
			id: key,
			name: name,
			description: description,
			createdBy: {
				name: currentUser.displayName,
				image: currentUser.photoURL
			}
		}
		firebase.update(firebase.child(this.state.chatRoomsRef, key), newChatRoom).then(() => {
			this.setState({
				name: "",
				description: "",
				show: false
			});
		});
		
	}
	
	isFormValid = (name, description) => name && description;
	
	//컴포넌트 mount되면서 자동 실행
	componentDidMount() {
		this.addChatRoomsListener();
	}	

	componentDidUpdate(prevProps) {
		if(prevProps.currentChatRoom) {
			if(prevProps.currentChatRoom.id !== this.props.currentChatRoom.id) {
				this.setState({activeChatRoomId: this.props.currentChatRoom.id});
			}
		}
	}
	
	addChatRoomsListener = () => {
		let chatRoomsArray = [];
		firebase.onChildAdded(this.state.chatRoomsRef, snapshot => {
			chatRoomsArray.push(snapshot.val());
			this.setState({chatRooms: chatRoomsArray}, () => {
				// this.setFirstChatRoom();
				this.setFirstChatRoom(snapshot.key);
			});
			// this.addNotificationListener(snapshot.key);
		});
	}

	//미확인 메세지 관리 리스너
	addNotificationListener = (chatRoomId) => {
		if(this.props.currentChatRoom) {
			firebase.onValue(firebase.child(this.state.messagesRef, chatRoomId), snapshot => {
				this.handleNotification(
					chatRoomId,
					this.props.currentChatRoom.id,
					this.state.notifications,
					snapshot
				);
			});
		}
	}
	handleNotification = (chatRoomId, currentChatRoomId, notifications, snapshot) => {

		let lastTotal = 0;

		let index = notifications.findIndex(notification => notification.id === chatRoomId);

		//notification에 해당 방 ID 없음(신규로 생성된 방, notification 생성 이후 만들어진 방)
		if(index === -1) {
			notifications.push({
				id: chatRoomId,
				total: snapshot.size,
				lastKnownTotal: snapshot.size,
				count: 0
			})
		}
		//notification에 방 정보 존재
		else {
			if(currentChatRoomId !== chatRoomId) {
				lastTotal = notifications[index].lastKnownTotal;
				if(snapshot.size > lastTotal) {
					notifications[index].count = snapshot.size - lastTotal;
					notifications[index].total = snapshot.size;
				}
			}
		}

		this.setState({notifications});
	}
	getNotificationCount = (chatRoom) => {
		let count = 0;

		this.state.notifications.forEach(notification => {
			if(notification.id === chatRoom.id) {
				count = notification.count;
			}
		})
		if(count > 0) return count;
	}

	setFirstChatRoom = (chatRoomId) => {
		const firstChatRoom = this.state.chatRooms[0];
		const { setStoreRoom } = this.props;	
		if(this.state.chatRooms.length 	> 0 && this.state.firstLoad) {
			setStoreRoom(firstChatRoom);
			this.setState({firstLoad: false, activeChatRoomId: firstChatRoom.id}, () => {
				this.addNotificationListener(chatRoomId);
			});
		}
	}
	renderChatRooms = (chatRooms) => 
		chatRooms.length > 0 && chatRooms.map((chatRoom) => (
			<li 
				key={ chatRoom.id }
				onClick={() => {this.changeChatRoom(chatRoom)}}
				style={{backgroundColor: chatRoom.id === this.state.activeChatRoomId && "#FFFFFF45"}}
			>
				# { chatRoom.name }
				<Badge variant="danger" style={{ float: 'right' , marginTop: '4px'}}>{this.getNotificationCount(chatRoom)}</Badge>
			</li>
		))
	changeChatRoom = (chatRoom) => {
		const { setStoreRoom, setPrivateRoom } = this.props;
		setStoreRoom(chatRoom);
		setPrivateRoom(false);
		this.setState({ activeChatRoomId: chatRoom.id });
		this.clearNotification(chatRoom.id);
	}
	clearNotification = (chatRoomId) => {
		let index = this.state.notifications.findIndex(notification => 
			notification.id === chatRoomId
		)
		if(index !== -1) {
			let updatedNotifications = [...this.state.notifications];
			updatedNotifications[index].lastKnownTotal = this.state.notifications[index].total;
			updatedNotifications[index].count = 0;
			this.setState({notifications: updatedNotifications});
		}
	}

	render() {
		return(
			<div>
				<div style={{
					position: 'relative',
					width: '100%',
					display: 'flex',
					alignItems: 'center'
				}}>
					<FaRegSmileWink style={{ marginRight: 3 }}/>
					CHAT ROOMS (1)
					<FaPlus
						style={{
							position: 'absolute',
							right: 0, cursor: 'pointer'
						}}	
						onClick={this.handleShow}
					/>
					
				</div>
				
				<ul
					style={{
						listStyleType: 'none',
						padding: 0
					}}	
				>
					{this.renderChatRooms(this.state.chatRooms)}
				</ul>

				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Create a chat room</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label>방 이름</Form.Label>
								<Form.Control
									type="text"
									onChange={(e) => {this.setState({name: e.target.value})}}
									placeholder="Enter chat room name" 
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Label>방 설명</Form.Label>
								<Form.Control 
									type="text" 
									onChange={(e) => {this.setState({description: e.target.value})}} 
									placeholder="Enter chat room name" 
								/>
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button variant="primary" onClick={this.handleSubmit}>
							Create
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}	
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.user.currentUser,
		currentChatRoom: state.chatRoom.currentChatRoom,
		isPrivate: state.chatRoom.isPrivateChatRoom
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setStoreRoom: (chatRoom) => dispatch(setCurrentChatRoom(chatRoom)),
		setPrivateRoom: (isPrivate) => dispatch(setPrivateChatRoom(isPrivate))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRooms);