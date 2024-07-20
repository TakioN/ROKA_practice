import React, { Component } from 'react';
import { connect } from 'react-redux';

import Message from './Message';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import firebase from '../../../firebase';
import Skeleton from '../../../commons/components/Skeleton';
import { setUserPosts } from '../../../redux/actions/chatRoom_action';

class MainPanel extends Component {

	mainDisplay = React.createRef();

	state = {
		messagesRef: firebase.ref(firebase.getDatabase(), 'messages'),
		messages: [],
		messagesLoading: true,
		searchTerm: "",
		searchResult: [],
		searchLoading: false,
		typingUsers: [],
		typingRef: firebase.ref(firebase.getDatabase(), 'typing'),
		scrollLength: 0
	}

	addMessagesListeners = (chatRoom) => {
		let messagesArray = [];

		firebase.onChildAdded(firebase.child(this.state.messagesRef, chatRoom.id), data => {
			messagesArray.push(data.val());
			this.setState({
				messages: messagesArray,
				messagesLoading: false
			});
			this.userPostCounts(messagesArray);
		});

	}

	addTypingListeners = () => {
		let typingUsers = [];

		//타이핑 시 배열에 추가
		firebase.onChildAdded(firebase.child(this.state.typingRef, this.props.chatRoom.id), snapshot => {
			if (this.props.user.uid !== snapshot.key) {
				typingUsers = typingUsers.concat({
					id: snapshot.key,
					name: snapshot.val()
				})
			}
			this.setState({ typingUsers });
		})

		//타이핑 안 할 시 배열에서 삭제
		firebase.onChildRemoved(firebase.child(this.state.typingRef, this.props.chatRoom.id), snapshot => {
			let index = typingUsers.findIndex(typingUser => snapshot.key === typingUser.id);
			if (index !== -1) {
				typingUsers = typingUsers.filter(typingUser => snapshot.key !== typingUser.id);
				console.log(typingUsers);
			}
			this.setState({ typingUsers });
		})
	}

	userPostCounts = (messages) => {
		const userPosts = messages.reduce((acc, current) => {
			if (current.user.name in acc) {
				acc[current.user.name].count += 1;
			}
			else {
				acc[current.user.name] = {
					image: current.user.image,
					count: 1
				}
			}

			return acc;
		}, {})

		this.props.setUserPosts(userPosts);
	}

	renderMessages = messages =>

		messages.length > 0 && messages.map(message => (
			<Message
				key={message.timestamp}
				message={message}
				user={this.props.user}
			/>
		));



	componentDidMount() {
		const { chatRoom } = this.props;
		if (chatRoom) {
			this.addMessagesListeners(chatRoom);
			this.addTypingListeners();
		}
	}

	componentDidUpdate() {
		if (this.mainDisplay.current) {
			this.mainDisplay.current.scrollTop = this.mainDisplay.current.scrollHeight;
			console.log(this.mainDisplay.current.scrollHeight, this.mainDisplay.current.scrollTop);
		}
	}

	componentWillUnmount() {
		const { chatRoom, user } = this.props;

		//새로고침 시 데이터베이스에서 typing정보 삭제
		if (user !== null && chatRoom !== null) {
			firebase.remove(firebase.child(this.state.typingRef, `${chatRoom.id}/${user.uid}`));
		}
	}

	handleSearchMessages = () => {
		const chatRoomMessages = [...this.state.messages];
		const regex = new RegExp(this.state.searchTerm, "gi");

		const searchResult = chatRoomMessages.reduce((acc, message) => {
			if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
				acc.push(message);
			}
			return acc;
		}, []);

		this.setState({ searchResult: searchResult });
		setTimeout(() => { this.setState({ searchLoading: false }) }, 1000);
	}

	handleSearchChange = e => {
		this.setState({
			searchTerm: e.target.value,
			searchLoading: true
		},
			this.handleSearchMessages
		);
	}

	renderTypingUsers = (typingUsers) => {
		return typingUsers.length > 0 && typingUsers.map(typingUser => (
			<span>{typingUser.name}님이 채팅을 입력하고 있습니다...</span>
		))
	}

	renderMessageSkeleton = (loading) =>
		loading && (
			<>
				{[...Array(10)].map((_, i) => 
					<Skeleton key={i} />
				)}
			</>
		)





	render() {

		const { messages, searchTerm, searchResult, typingUsers, messagesLoading } = this.state;

		return (
			<div style={{ padding: "2rem 2rem 0 2rem" }}>
				<MessageHeader handleSearchChange={this.handleSearchChange} />
				<div
					style={{
						width: "100%",
						height: "450px",
						border: ".2rem solid #ececec",
						borderRadius: "4px",
						padding: "1rem",
						marginBottom: "1rem",
						overflowY: "auto"
					}}
					ref={this.mainDisplay}
				>
					{this.renderMessageSkeleton(messagesLoading)}

					{searchTerm ? this.renderMessages(searchResult) : this.renderMessages(messages)}
					{this.renderTypingUsers(typingUsers)}
				</div>
				<MessageForm />
			</div>
		);
	};
}

const mapStateToProps = state => {
	return {
		user: state.user.currentUser,
		chatRoom: state.chatRoom.currentChatRoom
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setUserPosts: userPost => dispatch(setUserPosts(userPost))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPanel);

//같은 사진 못 올림