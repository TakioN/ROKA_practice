import React, { Component } from 'react';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import firebase from '../../../firebase';
import { connect } from 'react-redux';
import { setCurrentChatRoom } from '../../../redux/actions/chatRoom_action';

class ChatRooms extends Component {
	state = {
		show: false,
		name: "",
		description: "",
		chatRoomsRef: firebase.ref(firebase.getDatabase(), 'chatRooms'),
		chatRooms: [],
		firstLoad: true,
		activeChatRoomId: ""
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
	//컴포넌트 unmount되면서 자동 실행
	componentWillUnmount() {
		
	}
	
	
	addChatRoomsListener = () => {
		let chatRoomsArray = [];
		firebase.onChildAdded(this.state.chatRoomsRef, (snapshot) => {
			chatRoomsArray.push(snapshot.val());
			this.setState({chatRooms: chatRoomsArray}, () => {
				this.setFirstChatRoom();
			});
		});
	}
	setFirstChatRoom = () => {
		const firstChatRoom = this.state.chatRooms[0];
		const { setStoreRoom } = this.props;
		if(this.state.chatRooms.length 	> 0 && this.state.firstLoad) {
			setStoreRoom(firstChatRoom);
			this.setState({firstLoad: false, activeChatRoomId: firstChatRoom.id});
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
			</li>
		))
	changeChatRoom = (chatRoom) => {
		const { setStoreRoom } = this.props;
		setStoreRoom(chatRoom);
		this.setState({ activeChatRoomId: chatRoom.id });
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
		currentUser: state.user.currentUser
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setStoreRoom: (chatRoom) => dispatch(setCurrentChatRoom(chatRoom))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRooms);