import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Divider, Modal, Icon, Loader, Checkbox, Textarea, Dimmer } from 'semantic-ui-react';
import { GrMail } from 'react-icons/gr';
import { BiPlusMedical } from 'react-icons/bi';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
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
	const [newHandover, setNewHandover] = useState(false);
	const [fetchedClients, setFetchedClients] = useState([]);
	const [filteredClients, setFilteredClients] = useState([]);
	const [filterText, setFilterText] = useState('');
	const [filterCity, setFilterCity] = useState(null);
	const [newClientName, setNewClientName] = useState('');
	const [newClientNameError, setNewClientNameError] = useState(false);
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

	function handleText(e) {
		setFilterCity(null);
		setFilterText(e.target.value);
		//setExpanded(0);
		//setNewHandover(false);

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

	function handleClientClick(id) {
		history.push(`/kund/${id}`);
	}

	function readOrHandled(message) {
		if (!!userObject.admin) {
			return !message.handled;
		} else {
			return !message.read;
		}
	}

	const resultHTML = filteredClients.map((item, index) => {

		return (
			<Segment className="m-3 text-left" key={`clientResults${index}`} onClick={() => { handleClientClick(item.id) }/*setExpanded(item.id)*/}>
				<Grid columns={2} className="ml-0 mr-0">
					<Grid.Row>
						<Grid.Column width={12}>
							<h3>{item.name}</h3>
							<p>{item.east ? 'Östra' : item.lundby ? 'Lundby' : item.angered ? 'Angered' : item.vh ? 'Västra Hisingen' : item.backa ? 'Backa' : 'Vet Ej'} - {item.messages.filter(message => message.empty === 0 && readOrHandled(message)).length} {item.messages.filter(message => message.empty === 0 && readOrHandled(message)).length === 1 ? 'ny överlämning' : 'nya överlämningar'} </p>
						</Grid.Column>
						<Grid.Column width={4} textAlign="right">
							{item.messages.filter(message => message.empty === 0 && readOrHandled(message)).length > 0 &&
								<GrMail size="3em" color="orange" />
							}
						</Grid.Column>
					</Grid.Row>
				</Grid>

			</Segment>
		);
	});

	function popupCanceled() {
		setNewHandover(false);
	}

	function popupSent() {
		setNewHandover(false);
		fetchClients(() => { });
	}

	return (
		<center>
			{!!newHandover &&
				<HandoverPopup canceled={popupCanceled} sent={popupSent} clients={fetchedClients} />
			}
			{!newHandover &&
				<Fab
					mainButtonStyles={{ backgroundColor: 'green' }}
					icon={<BiPlusMedical />}
					alwaysShowTitle={true}
					onClick={() => { setNewHandover(true) }}
				/>
			}
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
				<Select
					fluid
					placeholder='Välj stadsdel'
					options={optionsCity}
					onChange={(e, val) => handleCity(val.value)}
				/>
				<h4 className="m-3">Eller Stadsdel</h4>
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
				<div>
					{resultHTML}
					<p className="mb-5 pb-5 mt-5 pt-5">{resultHTML.length} Resultat</p>
				</div>
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