import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter, Link, useParams } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Icon, Loader, Dimmer, Divider, Modal, Checkbox } from 'semantic-ui-react';
import HandoverPopup from './handoverPopup';

const optionsCity = [
	{ key: 'east', value: 'east', text: 'Östra' },
	{ key: 'lundby', value: 'lundby', text: 'Lundby' },
	{ key: 'angered', value: 'angered', text: 'Angered' },
	{ key: 'vh', value: 'vh', text: 'Västra Hisingen' },
	{ key: 'backa', value: 'backa', text: 'Backa' },
]

const optionsCare = [
	{ key: 'old', value: 'old', text: 'Äldreomsorg' },
	{ key: 'young', value: 'young', text: 'Funktionshinder' },
]

function Clients() {
	const history = useHistory();
	const [fetchedMessages, setfetchedMessages] = useState([]);
	const [clientId, setClientId] = useState(parseInt(useParams().id));
	const [client, setClient] = useState(null);
	const [newHandover, setNewHandover] = useState(false);
	const [animateRemoval, setAnimateRemoval] = useState({ id: -1, ms: 0, timer: null });
	const [newClientName, setNewClientName] = useState('');
	const [newClientNameError, setNewClientNameError] = useState(false);
	const [newClientCity, setNewClientCity] = useState('eas');
	const [newClientCityError, setNewClientCityError] = useState(false);
	const [newClientCare, setNewClientCare] = useState('null');
	const [newClientCareError, setNewClientCareError] = useState(false);
	const [newClientComment, setNewClientComment] = useState('');
	const userObject = JSON.parse(localStorage.getItem('user'));


	function fetchClients(returnFunc) {
		fetch(`/api/client/${clientId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
		})
			.then(response => response.json())
			.then(data => {
				setClient(data.client);

				setfetchedMessages(data);

				setNewClientName(data.client.name);
				setNewClientCity(data.client.east ? 'east' : data.client.lundby ? 'lundby' : data.client.angered ? 'angered' : data.client.vh ? 'vh' : data.client.backa ? 'backa' : 'null');
				setNewClientCare(data.client.care_type);
				setNewClientComment(data.client.comment);

				returnFunc();
			});
	}

	function sendNewClient() {

		/* CLEAR LAST VALIDATION */
		setNewClientNameError(false);
		setNewClientCareError(false);
		setNewClientCityError(false);

		/* VALIDATE */
		let errors = false;

		if (newClientName.length < 4) {
			errors = true;
			setNewClientNameError(true);
		}

		if (newClientCare === 'null' || newClientCare === null) {
			errors = true;
			setNewClientCareError(true);
		}

		if (newClientCity === 'null' || newClientCity === null) {
			errors = true;
			setNewClientCityError(true);
		}

		/* PROCEED IF NO ERRORS */
		if (!errors) {

			setNewClientSending(true);

			/* POST */
			fetch('/api/clients/update', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': userObject.token,
				},
				body: JSON.stringify({
					id: client.id,
					name: newClientName,
					care_type: newClientCare,
					east: newClientCity === 'east' ? 1 : 0,
					lundby: newClientCity === 'lundby' ? 1 : 0,
					angered: newClientCity === 'angered' ? 1 : 0,
					vh: newClientCity === 'vh' ? 1 : 0,
					backa: newClientCity === 'backa' ? 1 : 0,
					comment: newClientComment,
				}),
			})
				.then(response => response.json())
				.then(data => {
					setNewClientSending(false);
					setFetchedClients([]);
					setFilteredClients([]);
					fetchClients();
				});
		}
	}

	function deleteClient() {
		fetch('/api/clients/delete', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
			body: JSON.stringify({
				id: client.id,
			}),
		})
			.then(response => response.json())
			.then(data => {
				history.push(`/kunder/`);
			});
	}

	useEffect(() => {
		fetchClients(() => { });
	}, []);

	function handleMarkAsRead(id) {

		setAnimateRemoval({ id: id, ms: 500, timer: null });

		fetch('/api/messages/read', {
			method: 'PUT',
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

	function handleProcessed(id) {
		setAnimateRemoval({ id: id, ms: 500, timer: null });

		fetch('/api/messages/handled', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
			body: JSON.stringify({
				id: id,
			}),
		})
			.then(response => response.json())
			.then(data => {

			});
	}

	function handleRemove(id) {
		setAnimateRemoval({ id: id, ms: 500, timer: null });

		fetch('/api/messages/delete', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
			body: JSON.stringify({
				id: id,
			}),
		})
			.then(response => response.json())
			.then(data => {

			});
	}

	function goBack() {
		history.push('../kunder');
	}

	useEffect(() => {
		setTimeout(() => {
			if (animateRemoval.id !== -1) {
				if (animateRemoval.ms < 0) {
					//const personIndex = fetchedMessages.findIndex((x) => (x.id === clientId));
					//const newMessages = [...fetchedMessages];
					const newMessages = {...client};
					if (userObject.admin == true) newMessages.messages[client.messages.findIndex((x) => x.id === animateRemoval.id)].handled = true;
					else newMessages.messages[client.messages.findIndex((x) => x.id === animateRemoval.id)].read = true;
					//setfetchedMessages([...newMessages]);

					//const newClient = {...client};
					//newClient.messages = [...newMessages];
					
					setClient({...newMessages});

					setAnimateRemoval({ ...animateRemoval.id = -1 });
				}
				else {
					const newRemoval = { ...animateRemoval };
					newRemoval.ms = animateRemoval.ms - 10;
					setAnimateRemoval({ id: newRemoval.id, timer: newRemoval.timer, ms: newRemoval.ms });
				}
			}
		});
	}, [animateRemoval.ms]);

	const unReadMessages = client ? client.messages.filter((item) => (item.read == false)).map((item, index) => (
		messageHTML(item, index, false, animateRemoval.id === item.id)
	)) : [];
	const readMessages = client ? client.messages.filter((item) => (item.read == true)).map((item, index) => (
		messageHTML(item, index, true, false)
	)) : [];
	const unhandledMessages = client ? client.messages.filter((item) => (item.handled == false)).map((item, index) => (
		messageHTML(item, index, false, animateRemoval.id === item.id)
	)) : [];
	const handledMessages = client ? client.messages.filter((item) => (item.handled == true)).map((item, index) => (
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
						<Grid.Column width={9} textAlign="left">
							<h4>{item.user.name}</h4>
						</Grid.Column>
						<Grid.Column width={7} textAlign="right">
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
							<p>Läst av: {item.read_by.map((item) => { return (item.name) }).join(', ')}</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				{!read && !userObject.admin &&
					<Grid.Row className="m-3 mb-3">
						<Button fluid color="green" onClick={() => handleMarkAsRead(item.id)}>{'Markera som Läst'}</Button>
					</Grid.Row>
				}
				{!!userObject.admin &&
					<>
						{!item.handled &&
							<Grid.Row className="m-3 mb-3">
								<Button fluid color="green" onClick={() => handleProcessed(item.id)}>{'Markera Som Hanterad (Admin)'}</Button>
							</Grid.Row>
						}
						<Grid.Row className="m-3 mb-3">
							<Button fluid color="red" onClick={() => handleRemove(item.id)}>{'Ta Bort Permanent (Admin)'}</Button>
						</Grid.Row>
					</>
				}
			</Segment>
		)
	}

	function popupCanceled() {
		setNewHandover(false);
	}

	function popupSent() {
		setNewHandover(false);
		fetchClients(() => { });
	}

	return (
		<center>
			{!!newHandover && <HandoverPopup canceled={popupCanceled} sent={popupSent} clients={fetchedMessages} defaultClient={clientId} />}
			<Segment className="m-3 p-0">
				<Button.Group widths="2">
					<Button color="red" onClick={goBack}><Icon name="long arrow alternate left" size="big" /></Button>
					<Button color="green" onClick={() => setNewHandover(true)}>Ny Överlämning</Button>
				</Button.Group>
			</Segment>
			<Segment className="m-3">
				<h4>Uppdatera kund</h4>
				<Input
					className="mb-3"
					fluid
					icon='address book'
					iconPosition='left'
					placeholder='Fullt Namn'
					error={newClientNameError}
					value={newClientName}
					onChange={(e) => setNewClientName(e.target.value)}
				/>
				<Select
					className="mb-3"
					fluid
					placeholder='Välj stadsdel'
					error={newClientCityError}
					options={optionsCity}
					value={newClientCity}
					onChange={(e, val) => setNewClientCity(val.value)}
				/>
				<Select
					className="mb-3"
					fluid
					placeholder='Äldreomsorg / Funktionshinder'
					error={newClientCareError}
					options={optionsCare}
					value={newClientCare}
					onChange={(e, val) => setNewClientCare(val.value)}
				/>
				<Form>
					<Form.TextArea
						className="mb-3"
						placeholder="Admin-only information relaterat till kund"
						value={newClientComment}
						onChange={(e) => setNewClientComment(e.target.value)}
					/>
				</Form>
				<Button disabled={!client} fluid color="green" onClick={sendNewClient}>Uppdatera kund</Button>
				<Button className="mt-3" disabled={!client} fluid color="red" onClick={deleteClient}>Radera kund</Button>
			</Segment>

			<h1 className="">{client ? client.name : ''}</h1>

			{client &&
				<>
					<h3 className="mt-5">{userObject.admin ? 'Ohanterade Meddelanden' : 'Olästa Meddelanden'} ({userObject.admin ? unhandledMessages.length : unReadMessages.length})</h3>
					<Divider className="m-3" />
					{userObject.admin ? unhandledMessages : unReadMessages}
					<h3 className="mt-5">{userObject.admin ? 'Hanterade Meddelanden' : 'Lästa Meddelanden'} ({userObject.admin ? handledMessages.length : readMessages.length})</h3>
					<Divider className="m-3" />
					{userObject.admin ? handledMessages : readMessages}
				</>
			}
			{!client &&
				<Segment style={{ marginTop: '15%' }} basic>
					<Loader active size='big'>Laddar</Loader>
				</Segment>
			}

		</center>
	);
}

export default Clients;