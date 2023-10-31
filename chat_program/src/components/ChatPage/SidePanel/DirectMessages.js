import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../../../firebase';

import { FaRegSmile } from 'react-icons/fa';

class DirectMessages extends Component {
	
	/*constructor(props) {
		super(props);
		this.state = {
			usersRef: firebase.ref(firebase.getDatabase(), 'users'),
			currentUser: props.user
		}
	}*/
	
	state = {
		usersRef: firebase.ref(firebase.getDatabase(), 'users'),
		users: []
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
	}
	
	//친구 목록 담기
	addUsersListeners = (currentUserId) => {
		let usersArray = [];
		firebase.onChildAdded(this.state.usersRef, (data) => {
			if(currentUserId != data.key) {
				let user = data.val();
				user['uid'] = data.key;
				user['state'] = 'offline';
				usersArray.push(user);
				this.setState({users: usersArray});
			}
		})
	}
	
	/*renderDirectMessages = users => {
		users.length > 0 && users.map(user => (
			<li key={user.uid}>
				# {user.name}
			</li>
		))
	}*/
	
	renderDirectMessages = users => {
		console.log(users);
		users.map((user) => {
			console.log(user.name);
			return(
				<li>3</li>
			)
		})
		
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
	user: state.user.currentUser
});

export default connect(mapStateToProps)(DirectMessages);