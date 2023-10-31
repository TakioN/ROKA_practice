import React, { useEffect } from 'react';
import {
	Routes,
	Route,
	useNavigate
} from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import ChatPage from './components/ChatPage/ChatPage';
import firebase from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './redux/actions/user_action';

function App() {
	
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isLoading = useSelector(state => state.user.isLoading);
	const currentUser = useSelector(state => state.user.currentUser);
	
	useEffect(() => {
		const auth = firebase.getAuth();
		firebase.onAuthStateChanged(auth, (user) => {
			if(user) {
				navigate('/');
				dispatch(setUser(user));
				console.log(user);
			}
			else {
				navigate('/login');
				dispatch(clearUser());
				console.log(user);
			}
		});
	}, []);
	
	if(isLoading && currentUser !== null) {
		return(
			<div>...loading</div>
		);
	}
	else {
		return(
			<Routes>
				<Route path="/" element={<ChatPage />}></Route>
				<Route path="/login" element={<LoginPage />}></Route>
				<Route path="/register" element={<RegisterPage />}></Route>
			</Routes>
		);
	}
	
}

export default App;
