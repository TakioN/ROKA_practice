import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import firebase from '../../../firebase';

import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Media from 'react-bootstrap/Media';

function MessageHeader({ handleSearchChange }) {

	const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
	const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom);
	const user = useSelector(state => state.user.currentUser);
	const userPosts = useSelector(state => state.chatRoom.userPosts);
	const [isFavorited, setIsFavorited] = useState(false);
	const userRef = firebase.ref(firebase.getDatabase(), 'users');

	useEffect(() => {
		if(user && chatRoom) addFavoriteListener();
	}, []);


	const addFavoriteListener = () => {
		firebase.get(firebase.child(userRef, `${user.uid}/favorited`)).then((snapshot) => {
			if(snapshot.val() !== null) {
				const chatRoomIds = Object.keys(snapshot.val());
				const isAlreadyFavorited = chatRoomIds.includes(chatRoom.id);
				setIsFavorited(isAlreadyFavorited);
			}
		});
	}

	const handleFavorite = () => {
		if(isFavorited) {
			firebase.remove(firebase.child(userRef, `${user.uid}/favorited/${chatRoom.id}`))
				.catch(err => {console.error(err);});
			setIsFavorited(prev => !prev);
		}
		else {
			firebase.update(firebase.child(userRef, `${user.uid}/favorited/`), 
				{
					[chatRoom.id]: {
						name: chatRoom.name,
						description: chatRoom.description,
						createdBy: {
							name: chatRoom.createdBy.name,
							image: chatRoom.createdBy.image
						}
					}
				}
			)
			setIsFavorited(prev => !prev);
		}
	}

	const renderUserPosts = (userPosts) => (
		Object.entries(userPosts)
			.sort((a, b) => {
				return b[1].count - a[1].count;
			})
			.map(([key, value], idx) => (
				<Media key={idx}>
					<img 
						style={{ borderRadius: 25 }}
						width={48}
						height={48}
						className="mr-3"
						src={value.image}
						alt={key}
					/>
					<Media.Body>
						<h6>{key}</h6>
						<p>{value.count} 개</p>
					</Media.Body>
				</Media>
			))		
	)

	return (
		<div style={{
			width: "100%",
			height: "170px",
			border: ".2rem solid #ececec",
			borderRadius: "4px",
			padding: "1rem",
			marginBottom: "1rem"
		}}>
			<Container>
				<Row>
					<Col>
						<h2>
							{isPrivateChatRoom ? 
								<FaLock style={{marginBottom: '10px'}} /> : 
								<FaLockOpen style={{marginBottom: '10px'}} />
							}
							{chatRoom && chatRoom.name} 
							{!isPrivateChatRoom &&
								<span style={{cursor: 'pointer'}} onClick={handleFavorite}>
									{isFavorited ? 
										<MdFavorite /> :
										<MdFavoriteBorder />
									}
								</span> 
							}
						</h2>
					</Col>
					<Col>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="basic-addon1"><AiOutlineSearch /></InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control
								placeholder="Search Messages"
								aria-label="Search"
								aria-describedby="basic-addon1"
								onChange={handleSearchChange}
							/>
						</InputGroup>
					</Col>
				</Row>
				
				{
					!isPrivateChatRoom &&
					<div style={{display:'flex', justifyContent: 'flex-end'}}>
						<p>
							<Image src={chatRoom && chatRoom.createdBy.image} roundedCircle 
								style={{width: '30px', height: '30px'}}
							/>
							{" "}{chatRoom && chatRoom.createdBy.name}
						</p>
					</div>
				}

				<Row>
					<Col>
						<Accordion>
							<Card>
								<Card.Header style={{ padding: '0 1rem' }}>
									<Accordion.Toggle as={Button} variant="link" eventKey="0" style={{ color: 'black' }}>
										Description
									</Accordion.Toggle>
								</Card.Header>
								<Accordion.Collapse eventKey="0">
									<Card.Body>{chatRoom && chatRoom.description}</Card.Body>
								</Accordion.Collapse>
							</Card>
						</Accordion>
					</Col>
					<Col>
						<Accordion>
							<Card>
								<Card.Header style={{ padding: '0 1rem' }}>
									<Accordion.Toggle as={Button} variant="link" eventKey="0" style={{ color: 'black' }}>
										Posts Count
									</Accordion.Toggle>
								</Card.Header>
								<Accordion.Collapse eventKey="0">
									<Card.Body>{userPosts && renderUserPosts(userPosts)}</Card.Body>
								</Accordion.Collapse>
							</Card>
						</Accordion>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default MessageHeader;