import React, { Component } from 'react';
import { connect } from 'react-redux';

import Message from './Message';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import firebase from '../../../firebase';

class MainPanel extends Component {
	
	state = {
		messagesRef: firebase.ref(firebase.getDatabase(), 'messages'),
		messages: [],
		messagesLoading: true,
		searchTerm: "",
		searchResult: [],
		searchLoading: false
	}
	
	addMessagesListeners = (chatRoom) => {
		let messagesArray = [];
		
		firebase.onChildAdded(firebase.child(this.state.messagesRef, chatRoom.id), (data) => {
			messagesArray.push(data.val());
			this.setState({
				messages: messagesArray,
				messagesLoading: false
			});
		});
		
	}
	
	renderMessages = messages => 
		messages.length > 0 && 
		messages.map((message) => (
			<Message 
				key={message.timestamp}
				message={message}
				user={this.props.user}
			/>
		))
	
	
	
	componentDidMount() {
		const { chatRoom } = this.props;
		if(chatRoom) {
			this.addMessagesListeners(chatRoom);
			/*this.setState({isFirst: false});*/
		}
	}
	
	handleSearchMessages = () => {
		const chatRoomMessages = [...this.state.messages];
		const regex = new RegExp(this.state.searchTerm, "gi");
		
		const searchResult = chatRoomMessages.reduce((acc, message) => {
			if((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
				acc.push(message);
			}
			return acc;
		}, []);
		
		this.setState({searchResult: searchResult});
		setTimeout(() => {this.setState({searchLoading: false})}, 1000);
	}
	
	handleSearchChange = e => {
		this.setState({
			searchTerm: e.target.value,
			searchLoading: true
		},
			this.handleSearchMessages
		);
	}
	
	render() {
		
		const { messages, searchTerm, searchResult } = this.state;
		
		return(
			<div style={{ padding: "2rem 2rem 0 2rem"}}>
				<MessageHeader handleSearchChange={this.handleSearchChange} />
				<div
					style = {{
						width: "100%",
						height: "450px",
						border: ".2rem solid #ececec",
						borderRadius: "4px",
						padding: "1rem",
						marginBottom: "1rem",
						overflowY: "auto"
					}}
				>
					{searchTerm ? this.renderMessages(searchResult) : this.renderMessages(messages)}
					
				</div>
				<MessageForm />
			</div>
		);
	};
}

const mapStateToProps = (state) => {
	return {
		user: state.user.currentUser,
		chatRoom: state.chatRoom.currentChatRoom
	};
};

export default connect(mapStateToProps)(MainPanel);