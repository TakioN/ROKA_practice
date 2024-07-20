import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import md5 from 'md5';
import firebase from '../../firebase';

function RegisterPage() {
	
	const {register, watch, formState: { errors }, handleSubmit} = useForm();
	const password = useRef();
	password.current = watch('password');
	const [errorFromSubmit, setErrorFromSubmit] = useState("");
	const [loading, setLoading] = useState(false);
	
	const onSubmit = (data) => {
		const auth = firebase.getAuth();
		setLoading(true);
		firebase.createUserWithEmailAndPassword(auth, data.email, data.password)
			.then((userCredential) => {
				console.log(userCredential.user);
				setLoading(false);
			
				//프로필 업데이트
				firebase.updateProfile(auth.currentUser, {
					displayName: data.name,
					photoURL: `https://www.gravatar.com/avatar/${md5(data.email)}?d=identicon`
				})
					.then(() => {
						//데이터베이스에 유저 등록
						const db = firebase.getDatabase();
						firebase.set(firebase.ref(db, 'users/' + userCredential.user.uid), {
							image: userCredential.user.photoURL,
							name: userCredential.user.displayName
						})
					})
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
				<h3>Register</h3>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				
				<label>Email</label>
				<input 
					{...register("email", {required: true, pattern: /^\S+@\S+$/i})}
				/>
				{errors.email && <p>This email field is required</p>}

				<label>Name</label>
				<input
					{...register("name", {required: true, maxLength: 10})}
				/>
				{errors.name && errors.name.type==='required' && <p>This name field is required</p>}
				{errors.name && errors.name.type==='maxLength' && <p>Your Input exceed Maximum characters</p>}

				<label>Password</label>
				<input 
					type="password"
					{...register("password", {required: true, minLength: 6})}
				/>
				{errors.password && errors.password.type==='required' && <p>This password field is required</p>}
				{errors.password && errors.password.type==='minLength' && <p>Password must have at least 6 characters</p>}

				<label>Password Confirm</label>
				<input 
					type="password"
					name="password_confirm"
					{...register("password_confirm", {required: true, validate: value => value === password.current})}
				/>
				{errors.password_confirm && errors.password_confirm.type==='required' && <p>This password confirm field is required</p>}
				{errors.password_confirm && errors.password_confirm.type==='validate' && <p>The password do not match</p>}

				{errorFromSubmit !== "" && <p>{errorFromSubmit}</p>}
				
				<input type="submit" value="SUBMIT" disabled={loading}/>
				<Link style={{color: 'grey', textDecoration: 'none'}} to='/login'>이미 아이디가 있다면...</Link>
			</form>
		</div>
	);
}

export default RegisterPage;