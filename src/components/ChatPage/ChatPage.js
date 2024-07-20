import MainPanel from './MainPanel/MainPanel';
import SidePanel from './SidePanel/SidePanel';

import { useSelector } from 'react-redux';

function ChatPage() {
	
	const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
	
	return(
	<div style={{ display: 'flex' }}>
		<div style={{ width: '300px' }}>
			<SidePanel />
		</div>
		<div style={{ width: '100%' }}>
			<MainPanel key={chatRoom && chatRoom.id} />
		</div>	
	</div>
	);
}

export default ChatPage;