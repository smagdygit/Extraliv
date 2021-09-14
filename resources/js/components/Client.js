import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter, Link, useParams } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Icon, Loader, Dimmer, Divider, Modal, Checkbox } from 'semantic-ui-react';

const optionsCity = [
	{ key: 'east', value: 'east', text: 'Östra' },
	{ key: 'lundby', value: 'lundby', text: 'Lundby' },
	{ key: 'angered', value: 'angered', text: 'Angered' },
	{ key: 'vh', value: 'vh', text: 'Västra Hisingen' },
	{ key: 'backa', value: 'backa', text: 'Backa' },
]

function Clients() {
	const history = useHistory();
	const [fetchedMessages, setfetchedMessages] = useState([]);
	const [filteredMessages, setfilteredMessages] = useState([]);
	const [filterText, setFilterText] = useState('');
	const [filterCity, setFilterCity] = useState('');
	const [expanded, setExpanded] = useState(0);
	const [clientId, setClientId] = useState(parseInt(useParams().id));
	const [newHandover, setNewHandover] = useState(false);
	const [handoverText, setHandoverText] = useState('');
	const [handoverClean, setHandoverClean] = useState(false);
	const [handoverLoading, setHandoverLoading] = useState(false);
	const [animateRemoval, setAnimateRemoval] = useState({ id: -1, ms: 0, timer: null });
	const userObject = JSON.parse(localStorage.getItem('user'));


	function fetchClients(returnFunc) {
		fetch('/api/clients/all', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
		})
			.then(response => response.json())
			.then(data => {
				setfetchedMessages(data);

				const unread = data.filter((item) => (item.read === false));
				const read = data.filter((item) => (item.read === true));

				setfilteredMessages({ unread: unread, read: read });

				returnFunc();
			});
	}

	useEffect(() => {
		fetchClients(() => { });
	}, []);

	function handleMarkAsRead(id) {

		setAnimateRemoval({ id: id, ms: 500, timer: null });

		fetch('/api/messages/read', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
			body: JSON.stringify({
				id: id,
				read: true,
			}),
		})
			.then(response => response.json())
			.then(data => {

			});
	}

	function goBack() {
		history.push('../kunder');
	}

	function sendNewHandover() {
		setHandoverLoading(true);
		fetch('/api/messages/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
			body: JSON.stringify({
				client_id: clientId,
				content: handoverClean ? 'OK!' : handoverText,
			}),
		})
			.then(response => response.json())
			.then(data => {
				fetchClients(() => {
					setHandoverLoading(false);
					setNewHandover(false);
				});
			});
	}

	function modal(item) {
		return (
			<Modal
				onClose={() => setNewHandover(false)}
				open={newHandover}
			>
				<Dimmer active={handoverLoading}>
					<Loader size="huge" content="Skickar överlämning..." />
				</Dimmer>
				<Modal.Header>Ny Överlämning</Modal.Header>
				<Modal.Content image>
					<Modal.Description>
						{!handoverClean &&
							<>
								<Header>Meddelande</Header>
								<Form>
									<Form.TextArea
										placeholder="Skriv vad nästa person behöver veta..."
										value={handoverText}
										onChange={(e) => setHandoverText(e.target.value)}
									/>
								</Form>
							</>
						}
					</Modal.Description>
					<Checkbox
						className="mb-3"
						toggle
						label="Inget att Rapportera - Allt OK"
						name="inget"
						checked={handoverClean}
						onChange={(e) => setHandoverClean(!handoverClean)}
					/>
				</Modal.Content>
				<Modal.Actions>
					<Button color='red' onClick={() => setNewHandover(false)}>
						Avbryt
					</Button>
					<Button
						content="Skicka in"
						labelPosition='right'
						icon='checkmark'
						onClick={sendNewHandover}
						positive
					/>
				</Modal.Actions>
			</Modal>
		);
	}

	useEffect(() => {
		setTimeout(() => {
			if (animateRemoval.id !== -1) {
				if (animateRemoval.ms < 0) {
					const personIndex = fetchedMessages.findIndex((x) => (x.id === clientId));
					const newMessages = [...fetchedMessages];
					newMessages[personIndex].messages[fetchedMessages[personIndex].messages.findIndex((x) => x.id === animateRemoval.id)].read = true
					setfetchedMessages([...newMessages]);
					setAnimateRemoval({ ...animateRemoval.id = -1 });
				}
				else {
					const newRemoval = { ...animateRemoval };
					newRemoval.ms = animateRemoval.ms - 10;
					setAnimateRemoval({ id: newRemoval.id, timer: newRemoval.timer, ms: newRemoval.ms });
				}
			}
		});
	}, [animateRemoval.ms])

	const clientObj = fetchedMessages.find((x) => (x.id === clientId));
	const unReadMessages = clientObj ? clientObj.messages.filter((item) => (item.read === false)).map((item, index) => (
		messageHTML(item, index, false, animateRemoval.id === item.id)
	)) : [];
	const readMessages = clientObj ? clientObj.messages.filter((item) => (item.read === true)).map((item, index) => (
		messageHTML(item, index, true, false)
	)) : [];

	function messageHTML(item, index, read, removal) {
		return (
			<Segment className="m-3 p-0" key={'message' + index}>
				<Dimmer active={removal}>
					<Loader active size="huge" inverted />
				</Dimmer>
				<Grid className="m-0" divided="vertically">
					<Grid.Row className="m-0 pb-0">
						<Grid.Column width={10} textAlign="left">
							<h4>{item.user.name}</h4>
						</Grid.Column>
						<Grid.Column width={6} textAlign="right">
							<h4>{new Date(item.updated_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="m-0 pt-5 pb-5">
						<Grid.Column>
							<p style={{ fontSize: '1.2rem' }}>{item.content}</p>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="m-0 p-0">
						<Grid.Column textAlign="left">
							<p>Read by: {item.read_by.map((item) => {return(item.name)}).join(', ')}</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				{!read &&
					<Grid.Row className="m-3 mb-3">
						<Button fluid color="green" onClick={() => handleMarkAsRead(item.id)}>{'Markera som Läst'}</Button>
					</Grid.Row>
				}
			</Segment>
		)
	}

	return (
		<center>
			{modal()}
			<Segment className="m-3 p-0">
				<Button.Group widths="2">
					<Button color="red" onClick={goBack}><Icon name="long arrow alternate left" size="big" /></Button>
					<Button color="green" onClick={() => setNewHandover(true)}>Ny Överlämning</Button>
				</Button.Group>
			</Segment>

			<h1 className="">Nadhima Ayal Safee Almayahi</h1>

			{fetchedMessages.length > 0 &&
				<>
					<h3 className="mt-5">Olästa Meddelanden ({unReadMessages.length})</h3>
					<Divider className="m-3" />
					{unReadMessages}
					<h3 className="mt-5">Lästa Meddelanden ({readMessages.length})</h3>
					<Divider className="m-3" />
					{readMessages}
				</>
			}
			{fetchedMessages.length === 0 &&
				<Segment style={{ marginTop: '15%' }} basic>
					<Loader active size='big'>Laddar</Loader>
				</Segment>
			}

		</center>
	);
}

export default Clients;