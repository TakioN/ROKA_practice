import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';

function LoginPage() {
	const {register, formState: { errors }, handleSubmit} = useForm();
	const [errorFromSubmit, setErrorFromSubmit] = useState("");
	const [loading, setLoading] = useState(false);
	
	const onSubmit = (data) => {
		const auth = firebase.getAuth();
		firebase.signInWithEmailAndPassword(auth, data.email, data.password)
			.then((userCredential) => {
				console.log(userCredential);
			})
			.catch((error) => {
				console.log(error.code);
				setErrorFromSubmit(error.code);
				setTimeout(() => {
					setErrorFromSubmit("");
				}, 5000);
				setLoading(false);
			});
	};
	
	return (
		<div className="auth-wrapper">
			<div style={{textAlign: 'center'}}>
				<h3>Login</h3>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				
				<label>Email</label>
				<input 
					{...register("email", {required: true, pattern: /^\S+@\S+$/i})}
				/>
				{errors.email && <p>This email field is required</p>}

				<label>Password</label>
				<input 
					type="password"
					{...register("password", {required: true, minLength: 6})}
				/>
				{errors.password && errors.password.type==='required' && <p>This password field is required</p>}
				{errors.password && errors.password.type==='minLength' && <p>Password must have at least 6 characters</p>}
				
				{errorFromSubmit !== "" && <p>{errorFromSubmit}</p>}
				
				<input type="submit" value="SUBMIT" disabled={loading}/>
				<Link style={{color: 'grey', textDecoration: 'none'}} to='/register'>아직 아이디가 없다면...</Link>
			</form>
		</div>
	);
}

export default LoginPage;