import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Divider, Modal, Icon, Loader, Checkbox, Textarea, Dimmer } from 'semantic-ui-react';
import { GrMail } from 'react-icons/gr';

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
	const [fetchedClients, setFetchedClients] = useState([]);
	const [filteredClients, setFilteredClients] = useState([]);
	const [filterText, setFilterText] = useState('');
	const [filterCity, setFilterCity] = useState('');
	const [expanded, setExpanded] = useState(0);
	const [newHandover, setNewHandover] = useState(false);
	const [handoverText, setHandoverText] = useState('');
	const [newClientName, setNewClientName] = useState('');
	const [newClientNameError, setNewClientNameError] = useState(false);
	const [newClientMail, setNewClientMail] = useState('');
	const [newClientMailError, setNewClientMailError] = useState(false);
	const [newClientPass, setNewClientPass] = useState('');
	const [newClientPassError, setNewClientPassError] = useState(false);
	const [newClientAdmin, setNewClientAdmin] = useState(false);
	const [newClientCity, setNewClientCity] = useState('null');
	const [newClientCityError, setNewClientCityError] = useState(false);
	const [newClientCare, setNewClientCare] = useState('null');
	const [newClientCareError, setNewClientCareError] = useState(false);
	const [newClientComment, setNewClientComment] = useState('');
	const [newClientSending, setNewClientSending] = useState(false);
	const userObject = JSON.parse(localStorage.getItem('user'));


	useEffect(() => {
		setFetchedClients([]);
		setFilteredClients([]);
		fetchClients();
	}, []);

	function fetchClients() {
		fetch('/api/clients/all', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
		})
			.then(response => response.json())
			.then(data => {
				setFetchedClients(data);
				setFilteredClients(data);
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
			fetch('/api/clients/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': userObject.token,
				},
				body: JSON.stringify({
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

	function updateFilter() {
		const filtered = fetchedClients.filter((item) => {
			return (item.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1);
		});
		setFilteredClients(filtered);
	}

	function handleText(e) {
		setFilterCity(null);
		setFilterText(e.target.value);
		setExpanded(0);
		setNewHandover(false);

		const filtered = fetchedClients.filter((item) => {
			return (item.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
		});

		setFilteredClients(filtered);
	}

	function handleCity(value) {
		setFilterText('');
		setFilterCity(value);

		const filtered = fetchedClients.filter((item) => {
			return (item.east && value === 'east' ? true : item.lundby && value === 'lundby' ? true : item.angered && value === 'angered' ? true : item.vh && value === 'vh' ? true : item.backa && value === 'backa' ? true : false);
		});

		setFilteredClients(filtered);
	}

	function expandedHTML(item) {
		return (
			<Segment>
				<Grid className="m-0" divided="vertically">
					<Grid.Row className="m-0 pb-0">
						<Grid.Column width={12} className="pl-3">
							<h4>Åbert Fensson</h4>
						</Grid.Column>
						<Grid.Column width={4} className="text-right">
							<h4>27 Juli</h4>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="m-0 pt-5 pb-5">
						<Grid.Column>
							<p style={{ fontSize: '1.2rem' }}>Testsson got lost in the forrest, im not sure where he is. The next employee working should probably go find him. I'd do it myself but my dog wants my attention so I need to go home and cuddle him ASAP.</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				<Grid.Row className="m-0 mb-3">
					<Button fluid color="green">Markera som läst</Button>
				</Grid.Row>
				<Grid.Row className="m-0 mb-3" onClick={() => setNewHandover(true)}>
					<Button fluid color="blue">Skapa ny överläming</Button>
				</Grid.Row>
				<Grid.Row className="m-0">
					<Button fluid>Överlämningshistorik</Button>
				</Grid.Row>
			</Segment>
		);
	}

	function newHandoverHTML(item) {
		return (
			<Segment>
				<Grid className="m-0" divided="vertically">
					<Grid.Row className="m-0 pb-0">
						<Grid.Column>
							<h4>Ny Överlämning</h4>
							<Form>
								<Form.TextArea
									label="Meddelande"
									placeholder="Skriv vad nästa person behöver veta..."
									value={handoverText}
									onChange={(e) => setHandoverText(e.target.value)}
								/>
								<Button fluid color="green">Skicka överlämning</Button>
							</Form>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		);
	}

	function handleClientClick(id) {
		history.push(`/kund/${id}`);
	}

	const resultHTML = filteredClients.map((item, index) => {

		return (
			<Segment className="m-3 text-left" key={`clientResults${index}`} onClick={() => { handleClientClick(item.id) }/*setExpanded(item.id)*/}>
				<Grid columns={2} className="ml-0 mr-0">
					<Grid.Row>
						<Grid.Column>
							<h3>{item.name}</h3>
							<p>{item.east ? 'Östra' : item.lundby ? 'Lundby' : item.angered ? 'Angered' : item.vh ? 'Västra Hisingen' : item.backa ? 'Backa' : 'Vet Ej'} - {item.messages.length} {item.messages.length === 1 ? 'ny överlämning' : 'nya överlämningar'} </p>
						</Grid.Column>
						<Grid.Column textAlign="right">
							{item.messages.length > 0 &&
								<GrMail size="3em" color="orange" />
							}
						</Grid.Column>
					</Grid.Row>
				</Grid>

			</Segment>
		);
	});


	return (
		<center>
			{!!userObject.admin &&
				<Segment className="m-3">
					<Dimmer active={newClientSending}>
						<Loader content="Lägger till kund..." />
					</Dimmer>
					<h4>Skapa ny kund</h4>
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
						defaultValue={"null"}
						onChange={(e, val) => setNewClientCity(val.value)}
					/>
					<Select
						className="mb-3"
						fluid
						placeholder='Äldreomsorg / Funktionshinder'
						error={newClientCareError}
						options={optionsCare}
						defaultValue={"null"}
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
					<Button fluid color="green" onClick={sendNewClient}>Lägg till kund</Button>
				</Segment>
			}
			<Segment className="m-3">
				<Input
					fluid
					icon='users'
					iconPosition='left'
					placeholder='Sök På Namn'
					value={filterText}
					onChange={(e) => handleText(e)}
				/>
				<h4 className="m-3">Eller Stadsdel</h4>
				<Select
					fluid
					placeholder='Välj stadsdel'
					options={optionsCity}
					onChange={(e, val) => handleCity(val.value)}
				/>
			</Segment>
			{resultHTML.length > 0 &&
				<>
					{resultHTML}
					<p>{resultHTML.length} Resultat</p>
				</>
			}
			{resultHTML.length === 0 &&
				<Segment style={{ marginTop: '15%' }} basic>
					<Loader active size='big'>Laddar</Loader>
				</Segment>
			}
		</center>
	);
}

export default Clients;