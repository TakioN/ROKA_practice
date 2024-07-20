import Media from 'react-bootstrap/Media';
import moment from 'moment';

function Message({message, user}) {
	
	const timeFromNow = (timestamp) => moment(timestamp).fromNow()
	const isImage = msg => msg.hasOwnProperty('image') && !msg.hasOwnProperty('content')
	const isMessageOwn = (msg, user) => 
		{	
			if(user)
				return msg.user.id === user.uid
		}
	
	return(
		<Media style={{marginBottom: '3px'}}>
			<img
				style={{borderRadius: '10px'}}
				width={48}
				height={48}
				className="mr-3"
				src={message.user.image}
				alt={message.user.name}
			/>
			<Media.Body style={{backgroundColor: isMessageOwn(message, user) && '#ECECEC'}}>
				<h6>
					{message.user.name}
					{" "}
					<span style={{fontSize: '10px', color: 'gray'}}>
						{timeFromNow(message.timestamp)}
					</span>
				</h6>
				{isImage(message) ? 
					<img src={message.image} alt="이미지" style={{maxWidth: '300px'}}/>
					:
					<p>
						{message.content}
					</p>
				}
				
			</Media.Body>
		</Media>
	);
}

export default Message;