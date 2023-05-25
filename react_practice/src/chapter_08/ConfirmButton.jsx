import React, { useState } from 'react';

// 바인드 해서 사용하기
/*
class ConfirmButton extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isConfirmed: false
		}
		
		this.handleConfirm = this.handleConfirm.bind(this);
	}
	
	handleConfirm() {
		this.setState((prevState) => ({
			isConfirmed: !(prevState.isConfirmed)
		}));
	}
	
	render() {
		return(
			<button 
				onClick={this.handleConfirm}
				disabled={this.state.isConfirmed}
			>
				{this.state.isConfirmed? "확인됨" : "확인하기"}
			</button>
		);
	}
}
*/

//화살표 함수로 표현
/*
class ConfirmButton extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isConfirmed: false
		}
		
	}
	
	handleConfirm = () => { 
		this.setState((prevState) => ({
			isConfirmed: !(prevState.isConfirmed)
		}));
	}
	
	render() {
		return(
			<button 
				onClick={this.handleConfirm}
				disabled={this.state.isConfirmed}
			>
				{this.state.isConfirmed? "확인됨" : "확인하기"}
			</button>
		);
	}
}
*/


//함수형으로 표현
function ConfirmButton(props) {
	
	const [isConfirmed, setIsConfirmed] = useState(false);
	
	const handleConfirm = () => {
		setIsConfirmed((prevState) => !prevState);
	};
	
	return(
		<button 
			onClick={handleConfirm}
			disabled={isConfirmed}
		>
			{isConfirmed? "확인됨" : "확인하기"}
		</button>
	);
}

export default ConfirmButton;