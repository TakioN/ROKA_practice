import React from 'react';

const students = [
	{
		id: 1,
		name: 'Hong'
	},
	{
		id: 2,
		name: 'Inje'
	},
	{
		id: 3,
		name: 'Yanggu'
	},
	{
		id: 4,
		name: 'Jungbeen'
	}
]

function AttendanceBook(props) {
	return(
		<ul>
			{students.map((student) => <li key={student.id}>{student.name}</li>)}
		</ul>
	);
}

export default AttendanceBook;