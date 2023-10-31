import { useRef } from 'react';
import { IoIosChatboxes } from 'react-icons/io';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import firebase from '../../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setPhotoURL } from '../../../redux/actions/user_action';
import mime from 'mime';

function UserPanel() {
	const currentUser = useSelector(state => state.user.currentUser);
	const inputOpenImageRef = useRef();
	const dispatch = useDispatch();
	
	const handleLogout = () => {
		const auth = firebase.getAuth();
		firebase.signOut(auth).catch((error) => {
			console.log(error);
		})
	};
	
	const handleInputOpenImageRef = () => {
		inputOpenImageRef.current.click();
	};
	
	const handleUploadImage = (e) => {
		const storage = firebase.getStorage();
		const userImageRef = firebase.strRef(storage, `user_image/${currentUser.uid}`);
		const file = e.target.files[0];
		
		//storage에 이미지 user_image 업로드
		const metadata = {
			contentType: mime.getType(file.name)
		};
		firebase.uploadBytes(userImageRef, file, metadata).then(() => {
			const auth = firebase.getAuth();
			firebase.getDownloadURL(firebase.strRef(storage, `user_image/${currentUser.uid}`)).then((url) => {
				//Auth 사용자 이미지 변경
				firebase.updateProfile(auth.currentUser, {
					photoURL: url
				});
				
				//Redux 사용자 이미지 변경
				dispatch(setPhotoURL(url));
				
				//Database 사용자 이미지 변경
				const db = firebase.getDatabase();
				firebase.update(firebase.child(firebase.ref(db), 'users/' + currentUser.uid), {image: url})
			});
		});
	};
	
	return(
		<div>
			<h3>
				<IoIosChatboxes />{" "}Chat App
			</h3>
			<div style={{display: "flex", marginBottom: "1rem"}}>
				<Image
					src={currentUser && currentUser.photoURL} 
					style={{
						width: "30px", height: "30px", marginTop: "3px"
					}}
					roundedCircle 
				/>
				<Dropdown>
					<Dropdown.Toggle 
						style={{ backgroundColor: "transparent", border: "0px" }}
						variant="success" 
						id="dropdown-basic"
					>
						{currentUser && currentUser.displayName}
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item href="#/action-1" onClick={handleInputOpenImageRef}>프로필 사진 변경</Dropdown.Item>
						<Dropdown.Item href="#/action-2" onClick={handleLogout}>로그아웃</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
			<input 
				type="file" 
				style={{ display: 'none' }} 
				ref={inputOpenImageRef} 
				accept="image/jpeg, image/png"
				onChange={handleUploadImage}
			/>
			
		</div>
	);
}

export default UserPanel;