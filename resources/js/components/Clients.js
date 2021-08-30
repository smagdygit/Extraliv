import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Divider, Modal, Icon } from 'semantic-ui-react';

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
	const [expanded, setExpanded] = useState(1);
	const [newHandover, setNewHandover] = useState(false);
	const [handoverText, setHandoverText] = useState('');


	useEffect(() => {
		fetch('/api/clients/all', {
			method: 'GET',
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

	function modal(item) {
		return (
			<Modal
				onClose={() => setNewHandover(false)}
				open={newHandover}
				trigger={<Button>Show Modal</Button>}
			>
				<Modal.Header>Ny Överlämning</Modal.Header>
				<Modal.Content image>
					<Modal.Description>
						<Header>Meddelande</Header>
						<Form>
							<Form.TextArea
								placeholder="Skriv vad nästa person behöver veta..."
								value={handoverText}
								onChange={(e) => setHandoverText(e.target.value)}
							/>
						</Form>
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions>
					<Button color='red' onClick={() => setNewHandover(false)}>
						Avbryt
					</Button>
					<Button
						content="Skicka in"
						labelPosition='right'
						icon='checkmark'
						onClick={() => setNewHandover(false)}
						positive
					/>
				</Modal.Actions>
			</Modal>
		);
	}

	const resultHTML = filteredClients.map((item, index) => {
		if (expanded === item.id) return (
			<Segment className="m-3 text-left" key={`clientResults${index}`}>
				<h3>{item.name}</h3>
				{newHandover ? modal(item) : expandedHTML(item)}
				<p>{item.east ? 'Östra' : item.lundby ? 'Lundby' : item.angered ? 'Angered' : item.vh ? 'Västra Hisingen' : item.backa ? 'Backa' : 'Vet Ej'} - {item.messages.length} {item.messages.length === 1 ? 'ny överlämning' : 'nya överlämningar'} </p>
			</Segment>
		); else return (
			<Segment className="m-3 text-left" key={`clientResults${index}`} onClick={() => setExpanded(item.id)}>
				<h3>{item.name}</h3>
				<p>{item.east ? 'Östra' : item.lundby ? 'Lundby' : item.angered ? 'Angered' : item.vh ? 'Västra Hisingen' : item.backa ? 'Backa' : 'Vet Ej'} - {item.messages.length} {item.messages.length === 1 ? 'ny överlämning' : 'nya överlämningar'} </p>
			</Segment>
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
			{resultHTML}
			<p>1 Resultat</p>
		</center>
	);
}

export default Clients;