import styled from 'styled-components';

const StyledTextarea = styled.textarea`
	padding: 16px;
	${(props) =>
		props.height && `height: ${props.height}px;`
	}
	width: calc(100% - 32px);
	font-size: 16px;
	line-height: 20px;
`;

function TextInput(props) {
	
	const {height, value, onChange} = props;
	
	return(
		<StyledTextarea height={height} value={value} onChange={onChange} />
	);
}

export default TextInput;