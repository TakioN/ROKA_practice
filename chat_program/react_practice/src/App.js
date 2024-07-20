// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import MainPage from './mini-blog/component/page/MainPage';
import PostWritePage from './mini-blog/component/page/PostWritePage';
import PostViewPage from './mini-blog/component/page/PostViewPage';


const MainTitleText = styled.div`
	font-size: 24px;
	font-weight: bold;
	text-align: center;
`;

function App(props) {
	return (
		<BrowserRouter>
			<MainTitleText>Jungbeen's BLOG</MainTitleText>
			<Routes>
				<Route index element={<MainPage />} />
				<Route path="post-write" element={<PostWritePage />}></Route>
				<Route path="post/:postId" element={<PostViewPage />}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
