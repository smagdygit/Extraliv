import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter, Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Divider, Modal, Icon, Loader } from 'semantic-ui-react';

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
	const userObject = JSON.parse(localStorage.getItem('user'));


	useEffect(() => {
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
				console.log(data);
			});
	}, []);

	function updateFilter() {
		const filtered = fetchedClients.filter((item) => {
			return (item.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1);
		});
		console.log(filtered);
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
		console.log(filtered);

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

	const resultHTML = filteredClients.map((item, index) => {
		return (
			<Link to={`./kund/${item.id}`} key={`clientResults${index}`}>
				<Segment className="m-3 text-left" onClick={() => { }/*setExpanded(item.id)*/}>
					<h3>{item.name}</h3>
					<p>{item.east ? 'Östra' : item.lundby ? 'Lundby' : item.angered ? 'Angered' : item.vh ? 'Västra Hisingen' : item.backa ? 'Backa' : 'Vet Ej'} - {item.messages.length} {item.messages.length === 1 ? 'ny överlämning' : 'nya överlämningar'} </p>
				</Segment>
			</Link>
		);
	});


	return (
		<center>
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