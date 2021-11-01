import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Divider, Modal, Icon, Loader, Checkbox, Dimmer } from 'semantic-ui-react';

const optionsCity = [
	{ key: 'east', value: 'east', text: 'Östra' },
	{ key: 'lundby', value: 'lundby', text: 'Lundby' },
	{ key: 'angered', value: 'angered', text: 'Angered' },
	{ key: 'vh', value: 'vh', text: 'Västra Hisingen' },
	{ key: 'backa', value: 'backa', text: 'Backa' },
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
	const [newUserName, setNewUserName] = useState('');
	const [newUserNameError, setNewUserNameError] = useState(false);
	const [newUserMail, setNewUserMail] = useState('');
	const [newUserMailError, setNewUserMailError] = useState(false);
	const [newUserPass, setNewUserPass] = useState('');
	const [newUserPassError, setNewUserPassError] = useState(false);
	const [newUserAdmin, setNewUserAdmin] = useState(false);
	/*const [newUserCity, setNewUserCity] = useState("null");
	const [newUserCityError, setNewUserCityError] = useState(false);*/
	const [newUserSending, setNewUserSending] = useState(false);
	const userObject = JSON.parse(localStorage.getItem('user'));


	useEffect(() => {
		setFetchedClients([]);
		setFilteredClients([]);
		fetchUsers();
	}, []);

	function fetchUsers() {
		fetch('/api/users/all', {
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

	function sendNewUser() {
		/* CLEAR LAST VALIDATION */
		setNewUserNameError(false);
		setNewUserMailError(false);
		setNewUserPassError(false);
		//setNewUserCityError(false);

		/* VALIDATE */
		let errors = false;

		if (newUserName.length < 4) {
			errors = true;
			setNewUserNameError(true);
		}

		if (newUserMail.length < 4) {
			errors = true;
			setNewUserMailError(true);
		}

		if (newUserPass.length < 4) {
			errors = true;
			setNewUserPassError(true);
		}

		/*if (newUserCity === 'null' || newUserCity === null) {
			errors = true;
			setNewUserCityError(true);
		}

		/* PROCEED IF NO ERRORS */
		if (!errors) {

			/* POST */
			setNewUserSending(true);
			fetch('/api/users/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': userObject.token,
				},
				body: JSON.stringify({
					name: newUserName,
					email: newUserMail,
					password: newUserPass,
					admin: newUserAdmin ? 1 : 0,
					/*east: newUserCity === 'east' ? 1 : 0,
					lundby: newUserCity === 'lundby' ? 1 : 0,
					angered: newUserCity === 'angered' ? 1 : 0,
					vh: newUserCity === 'vh' ? 1 : 0,
					backa: newUserCity === 'backa' ? 1 : 0,*/
					comment: '',
				}),
			})
				.then(response => response.json())
				.then(data => {
					setNewUserSending(false);
					setFetchedClients([]);
					setFilteredClients([]);
					fetchUsers();
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
		setFilterCity('');
		setFilterText(e.target.value);
		setExpanded(0);
		setNewHandover(false);

		const filtered = fetchedClients.filter((item) => {
			return (item.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
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

	function handleUserClick(id) {
		history.push(`/admin/anvandare/${id}`);
	}

	const resultHTML = filteredClients.map((item, index) => {
		return (
			<Segment className="m-3 text-left" key={`userResults${index}`} onClick={() => { handleUserClick(item.id) }} >
				<h3>{item.name}</h3>
				<p>{item.east ? 'Östra - ' : item.lundby ? 'Lundby - ' : item.angered ? 'Angered - ' : item.vh ? 'Västra Hisingen - ' : item.backa ? 'Backa - ' : ''}{item.admin ? 'Admin' : 'Personal'} </p>
			</Segment >
		);
	});


	return (
		<center>
			<Segment className="m-3">
				<Dimmer active={newUserSending}>
					<Loader content="Lägger till kund..." />
				</Dimmer>
				<h4>Skapa ny användare</h4>
				<Input
					className="mb-3"
					fluid
					icon='address book'
					iconPosition='left'
					placeholder='Fullt Namn'
					error={newUserNameError}
					value={newUserName}
					onChange={(e) => setNewUserName(e.target.value)}
				/>
				<Input
					className="mb-3"
					fluid
					icon='mail'
					iconPosition='left'
					placeholder='Mejl'
					error={newUserMailError}
					value={newUserMail}
					onChange={(e) => setNewUserMail(e.target.value)}
				/>
				<Input
					type='password'
					className="mb-3"
					fluid
					icon='hide'
					iconPosition='left'
					placeholder='Lösenord'
					error={newUserPassError}
					value={newUserPass}
					onChange={(e) => setNewUserPass(e.target.value)}
				/>
				{/*<Select
					className="mb-3"
					fluid
					placeholder='Välj stadsdel'
					error={newUserCityError}
					options={optionsCity}
					defaultValue={"null"}
					onChange={(e, val) => setNewUserCity(val.value)}
				/>*/}
				<Checkbox
					className="mb-3"
					toggle
					label="Admin"
					name="Admin"
					checked={newUserAdmin}
					onChange={(e) => setNewUserAdmin(!newUserAdmin)}
				/>
				<Button fluid color="green" onClick={sendNewUser}>Lägg till användare</Button>
			</Segment>
			<Segment className="m-3">
				<Input
					fluid
					icon='users'
					iconPosition='left'
					placeholder='Sök På Namn'
					value={filterText}
					onChange={(e) => handleText(e)}
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