import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import firebase from '../../../firebase';
import mime from 'mime';

function MessageForm() {
	
	const [content, setContent] = useState("");
	const [error, setError] = useState([]);
	const [loading, setLoading] = useState(false);
	const [percentage, setPercentage] = useState(0);

	const messagesRef = firebase.ref(firebase.getDatabase(), 'messages');
	const typingRef = firebase.ref(firebase.getDatabase(), 'typing');
	
	const user = useSelector(state => state.user.currentUser);
	const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
	const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom);
	
	const inputOpenImageRef = useRef();
	
	const handleChange = (e) => {
		setContent(e.target.value);
	}
	const handleSubmit = () => {
		//입력 내용이 없는 경우
		if(!content) {
			setError([]);
			setError(pre => pre.concat('Type contents first!'));
			return;
		}
		
		//입력내용이 있는 경우
		setLoading(true);
		let newChat = firebase.push(firebase.child(messagesRef, chatRoom.id));
		firebase.set(newChat, createMessage()).then(() => {
			setContent("");
			setError([]);
			setLoading(false);
		})
		.catch((error) => {
			setError(pre => pre.concat(error.message));
			setLoading(false);
			setTimeout(() => {
				setError([]);	
			}, 5000)
		});
	}
	const handleImageOpenRef = () => {
		inputOpenImageRef.current.click();
	} 
	//채팅방 공개여부에 의해 storage 경로 결정
	const getPath = () => {
		if(isPrivateChatRoom) return `message/private/${chatRoom.id}`;
		else return `message/public`;
		
	}
	const handleUploadImage = (e) => {
		const file = e.target.files[0];
		const metadata = {contentType: mime.getType(file.name)};
		const filePath = `${getPath()}/${file.name}`;
		
		//storage에 사진 업로드
		const storageRef = firebase.strRef(firebase.getStorage(), filePath);
		const uploadTask = firebase.uploadBytesResumable(storageRef, file, metadata);
		
		setLoading(true);
		uploadTask.on('state_changed', (snapshot) => {
				const percentage = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
				setPercentage(percentage);
			},
			err => {
				console.error(err);
				setLoading(false);
			},
			//업로드한 사진 url만들고 데이터베이스에 메세지 저장
			() => {
				firebase.getDownloadURL(storageRef).then(url => {
					let newChat = firebase.push(firebase.child(messagesRef, chatRoom.id));
					firebase.set(newChat, createMessage(url)).then(() => {
						setLoading(false);
					});
				});
			
			}	
		);
	}
	const createMessage = (fileURL = null) => {
		const message = {
			timestamp: firebase.serverTimestamp(),
			user: {
				id: user.uid,
				name: user.displayName,
				image: user.photoURL
			}
		};
		
		if(fileURL !== null) message['image'] = fileURL;
		else message['content'] = content;
		
		return message;
	}

	//데이터베이스에 타이핑 중인 유저 기록
	const handleKeyDown = e => {
		if(e.ctrlKey && e.key === 'Enter')
			handleSubmit();
		if(content) {
			firebase.set(firebase.child(typingRef, `${chatRoom.id}/${user.uid}`),
				user.displayName
			);
		}
		else {
			firebase.remove(firebase.child(typingRef, `${chatRoom.id}/${user.uid}`));
		}
	}
	
	return(
		<div>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
					<Form.Control 
						as="textarea" 
						rows={3} 
						value={content} 
						onChange={handleChange} 
						onKeyDown={handleKeyDown}
					/>
				</Form.Group>
			</Form>
			
			{
				!(percentage === 0 || percentage === 100) && 
				<ProgressBar variant="warning" now={percentage} label={`${percentage}%`} />
			}
			
			
			<div>
				{error.map(errMsg => (<p style={{color: 'red'}} key={errMsg}>{errMsg}</p>))}
			</div>
			
			<Row>
				<Col>
					<button 
						style={{width: '100%'}} 
						className="message-form-button" 
						onClick={handleSubmit}
						disabled={loading ? true : false}
					>
						SEND
					</button>
				</Col>
				<Col>
					<button 
						style={{width: '100%'}} 
						className="message-form-button" 
						onClick={handleImageOpenRef}
						disabled={loading ? true : false}
					>
						UPLOAD
					</button>
				</Col>
			</Row>
			
			<input 
				type="file" 
				style={{display: 'none'}} 
				ref={inputOpenImageRef} 
				onChange={handleUploadImage} 
				accept="image/jpeg, image/png, image/jpg"
			/>
		</div>
	);
}

export default MessageForm;