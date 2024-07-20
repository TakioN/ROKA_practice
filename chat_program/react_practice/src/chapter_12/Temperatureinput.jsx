const scaleNames = {
	c: '섭씨',
	f: '화씨'
}

function Temperatureinput(props) {
	
	const handleChange = (e) => {
		props.onTemperatureChange(e.target.value);
	}
	
	return(
		<fieldset>
			<legend>Input the Temperature(단위: {scaleNames[props.scale]})</legend>
			<input value={props.temperature} onChange={handleChange} />
		</fieldset>
	);
}

export default Temperatureinput;