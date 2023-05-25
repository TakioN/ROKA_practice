import ThemeContext from './ThemeContext';
import { useContext } from 'react';

function MainContent(props) {
	const {theme, toggleTheme} = useContext(ThemeContext);
	
	return(
		<div
			style={{
				width: '100vw',
				height: '100vh',
				padding: '1.5em',
				backgroundColor: theme === 'light' ? 'white' : 'black',
				color: theme === 'light' ? 'black' : 'white'
			}}	
		>
			<p>Hello. You can select Theme in this website!</p>
			<button onClick={toggleTheme}>테마변경</button>
		</div>
	);
}

export default MainContent;