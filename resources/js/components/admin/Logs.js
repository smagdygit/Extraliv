import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter, Link, useParams } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Icon, Loader, Dimmer, Divider, Modal, Checkbox } from 'semantic-ui-react';
import HandoverPopup from '../handoverPopup';

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
	const [fetchedLogs, setfetchedLogs] = useState([]);
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
		fetch(`/api/logs`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
		})
			.then(response => response.json())
			.then(data => {

				setfetchedLogs(data.logs);

				console.log(data);

				returnFunc();
			});
	}




	useEffect(() => {
		fetchClients(() => { });
	}, []);


	function goBack() {
		history.push('../kunder');
	}



	function messageHTML(item, index) {
		return (
			<Segment className="m-3 p-0" key={'message' + index}>
				<Grid className="m-0" divided="vertically">
					<Grid.Row className="m-0 pb-0">
						<Grid.Column width={9} textAlign="left">
							<h4>{item.user_id !== -1 ? item.user.name : ''}</h4>
						</Grid.Column>
						<Grid.Column width={7} textAlign="right">
							<h4>{new Date(item.updated_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</h4>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="m-0 pt-5 pb-5">
						<Grid.Column>
							<h2>{item.mini}</h2>
							<p style={{ fontSize: '1.2rem' }}>{item.long}</p>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="m-0 p-0">
						<Grid.Column textAlign="left">
							<p>Läst av: </p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		)
	}

	const logsHtml = fetchedLogs.map((item, index) => messageHTML(item, index))


	return (
		<center>
			<Segment className="m-3 p-0">
				<Button.Group widths="2">
					<Button color="red" onClick={goBack}><Icon name="long arrow alternate left" size="big" /></Button>
				</Button.Group>
			</Segment>

			{fetchedLogs &&
				<>
					{logsHtml}
				</>
			}
			{!fetchedLogs &&
				<Segment style={{ marginTop: '15%' }} basic>
					<Loader active size='big'>Laddar</Loader>
				</Segment>
			}

		</center>
	);
}

export default Clients;