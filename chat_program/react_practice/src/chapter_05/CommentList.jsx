import React from 'react';
import Comment from './Comment'

const Comments = [
	{
		name: "JB",
		comment: "React is very interesting!"
	},
	{
		name: "Yoon",
		comment: "But it is very hard!"
	},
	{
		name: "Yoojin",
		comment: "I'm about to talk that."
	}
];

function CommentList(props) {
	return(
		<div>
			{
				Comments.map((comment) => {
					return <Comment name={comment.name} comment={comment.comment} />
				})
			}
		</div>
	);
}

export default CommentList;