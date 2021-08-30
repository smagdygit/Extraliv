import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Icon } from 'semantic-ui-react';

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
	const [clientId, setClientId] = useState(1);
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

	if (fetchedClients.length > 0) {
		const clientObj = fetchedClients.find((x) => (x.id === clientId))
		const messages = clientObj.messages.map((item, index) => (
			<Segment className="m-3 p-0" key={'message' + index}>
				<Grid className="m-0" divided="vertically">
					<Grid.Row className="m-0 pb-0">
						<Grid.Column width={12} textAlign="left">
							<h4>Åbert Fensson</h4>
						</Grid.Column>
						<Grid.Column width={4} textAlign="right">
							<h4>27 Juli</h4>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="m-0 pt-5 pb-5">
						<Grid.Column>
							<p style={{ fontSize: '1.2rem' }}>{item.content}</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				<Grid.Row className="m-3 mb-3">
					<Button fluid color="green">Markera som läst</Button>
				</Grid.Row>
				<Grid.Row className="m-3 mb-3" onClick={() => setNewHandover(true)}>
					<Button fluid color="blue">Skapa ny överläming</Button>
				</Grid.Row>
				<Grid.Row className="m-3">
					<Button fluid>Överlämningshistorik</Button>
				</Grid.Row>
			</Segment>
		));

		return (
			<center>
				<Segment className="m-3 p-0">
					<Button fluid><Icon name="long arrow alternate left" size="big" /></Button>
				</Segment>
				<Segment className="m-3">
					<h3>Moniska Smiska</h3>
				</Segment>
				<Segment className="m-3 p-0">
					<h3>Olästa</h3>
				</Segment>
				<Segment className="m-3 p-0">
					<h3>Historik</h3>
				</Segment>
				{messages}
			</center>
		);
	} else {
		return (
			<>
				laddar...
			</>
		)
	}
}

export default Clients;