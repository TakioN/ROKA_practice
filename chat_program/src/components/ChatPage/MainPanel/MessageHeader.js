import { FaLock } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function MessageHeader({handleSearchChange}) {
	
	return(
		<div style={{
			width: "100%",
			height: "170px",
			border: ".2rem solid #ececec",
			borderRadius: "4px",
			padding: "1rem",
			marginBottom: "1rem"
		}}>
			<Container>
				<Row>
					<Col><h2><FaLock /> ChatRoomName <MdFavorite /></h2></Col>
					<Col>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text id="basic-addon1"><AiOutlineSearch /></InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control
								placeholder="Search Messages"
								aria-label="Search"
								aria-describedby="basic-addon1"
								onChange={handleSearchChange}
							/>
						</InputGroup>
					</Col>
				</Row>
				{/*<div style={{display: "flex", justifyContent: "flex-end"}}>
					<p>
						<Image /> {" "}user name
					</p>
				</div>*/}
				
				<Row>
					<Col>
						<Accordion>
							<Card>
								<Card.Header style={{padding: '0 1rem'}}>
									<Accordion.Toggle as={Button} variant="link" eventKey="0" style={{color: 'black'}}>
										Description
									</Accordion.Toggle>
								</Card.Header>
								<Accordion.Collapse eventKey="0">
									<Card.Body>Hello! I'm the body</Card.Body>
								</Accordion.Collapse>
							</Card>
						</Accordion>
					</Col>
					<Col>
						<Accordion>
							<Card>
								<Card.Header style={{padding: '0 1rem'}}>
									<Accordion.Toggle as={Button} variant="link" eventKey="0" style={{color: 'black'}}>
										Posts Count
									</Accordion.Toggle>
								</Card.Header>
								<Accordion.Collapse eventKey="0">
									<Card.Body>Hello! I'm the body</Card.Body>
								</Accordion.Collapse>
							</Card>
						</Accordion>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default MessageHeader;