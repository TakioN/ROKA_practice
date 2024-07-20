import { useState } from 'react';
import Temperatureinput from './Temperatureinput';

function BoilingVerdict(props) {
	if(props.celsius >= 100)
		return(<p>The water is Boiling!</p>);
	else
		return(<p>The water isn't Boiling!</p>);
}

function tryConvert(temperature, convert) {
	const input = parseFloat(temperature);
	if(Number.isNaN(input)) return "";
	const output = convert(temperature);
	const rounded = Math.round(output * 1000) / 1000;
	return rounded.toString();
}

function tofahrenheit(celsius) {
	return celsius * 9 / 5 + 32;
}

function toCelcius(fahrenheit) {
	return (fahrenheit - 32) * 5 / 9;
}

function Calculator(props) {
	
	const [temperature, setTemperature] = useState('');
	const [scale, setScale] = useState('c');
	
	const handleCelsiusChange = (temperature) => {
		setTemperature(temperature);
		setScale('c');
	}
	
	const handleFahrenheitChange = (temperature) => {
		setTemperature(temperature);
		setScale('f');
	}
	
	const celsius = scale === 'f' ? tryConvert(temperature, toCelcius) : temperature;
	const fahrenheit = scale === 'c' ? tryConvert(temperature, tofahrenheit) : temperature;
	
	return(
		<div>
			<Temperatureinput  
				scale="c"
				temperature={celsius}
				onTemperatureChange={handleCelsiusChange}
			/>
			<Temperatureinput 
				scale="f"
				temperature={fahrenheit}
				onTemperatureChange={handleFahrenheitChange}
			/>
			<BoilingVerdict celsius={parseFloat(celsius)} />
		</div>
	);
}

export default Calculator;