import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter, Link, useParams } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Icon, Loader, Dimmer, Divider, Modal, Checkbox, Dropdown } from 'semantic-ui-react';
import { check } from '../LogoutCheck';

const displayTypeOptions = [
	{ key: 'card', value: 'card', text: 'Kort' },
	{ key: 'basic_small', value: 'basic_small', text: 'Små Textrader' },
]

const logTypeOptions = [
	{ key: 'all', value: 'all', text: 'Allt' },
	{ key: 'loginout', value: 'loginout', text: 'Login / Logout' },
	{ key: 'messages', value: 'messages', text: 'Meddelanden' },
]

const loginChildren = [
	'login_success',
	'login_fail',
];

function Logs() {
	const history = useHistory();
	const userObject = JSON.parse(localStorage.getItem('user'));
	const [fetchedLogs, setfetchedLogs] = useState([]);
	const [filteredLogs, setFilteredLogs] = useState([]);
	const [logType, setLogType] = useState('all');
	const [displayType, setDisplayType] = useState('basic_small');
	const [userOptions, setUserOptions] = useState([]);
	const [selectedUser, setSelectedUser] = useState(-1);



	function fetchClients(returnFunc) {
		fetch(`/api/logs`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
		})
			.then(response => { return response.ok ? response.json() : check })
			.then(data => {

				//Set logs and run filter
				setfetchedLogs(data.logs);
				runFilter(data.logs);

				//Set users based on logs
				const newUsersPure = data.logs.flatMap(x => { if (x.user !== null) return { name: x.user.name, email: x.user.email, id: x.user.id }; else return [] });
				const newUsersFiltered = newUsersPure.filter(({ id }, index) => !newUsersPure.map(y => y.id).includes(id, index + 1));
				setUserOptions([{ key: -1, value: -1, text: 'Alla', email: '' }].concat(newUsersFiltered.map(x => { return ({ key: x.id, value: x.id, text: x.name, email: x.email }) })));

				returnFunc();
			});
	}

	function runFilter(logs) {
		let moddedLogs = [...logs];

		if (logType === 'loginout') moddedLogs = moddedLogs.filter(item => loginChildren.indexOf(item.action) !== -1);
		if (logType === 'messages') moddedLogs = moddedLogs.filter(item => item.action === 'create');
		if (selectedUser !== -1) moddedLogs = moddedLogs.filter(item => item.user !== null && item.user.id === selectedUser);

		setFilteredLogs([...moddedLogs]);
	}

	useEffect(() => {
		fetchClients(() => { });
	}, []);

	useEffect(() => {
		runFilter(fetchedLogs);
	}, [logType, selectedUser])


	function goBack() {
		history.push('../kunder');
	}

	function messageHTML(item, index) {
		if (displayType === 'card')
			return (
				<Segment className="m-3 p-0" key={'message' + index}>
					<Grid className="m-0" divided="vertically">
						<Grid.Row className="m-0 pb-0">
							<Grid.Column width={9} textAlign="left">
								<h4>{item.user_id !== -1 ? item.user.name : ''}</h4>
							</Grid.Column>
							<Grid.Column width={7} textAlign="right">
								<h4>{new Date(item.updated_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</h4>
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
			);

		if (displayType === 'basic_small') {
			let text = new Date(item.updated_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
			text += ' --- ';
			text += item.long;

			return (
				<div className="ml-4 mb-2 text-left" key={'message' + index}>
					{text}
				</div>
			)
		}
	}

	const logsHtml = filteredLogs.map((item, index) => messageHTML(item, index))

	return (
		<center>
			<Segment className="m-3 p-0">
				<Button.Group widths="2">
					<Button color="red" onClick={goBack}><Icon name="long arrow alternate left" size="big" /></Button>
				</Button.Group>
			</Segment>
			<Segment className="m-3 p-3">
				<Form className="mb-5">
					<Form.Group widths="equal">
						<Form.Dropdown
							name='Loggtyp'
							label='Loggtyp'
							placeholder='Loggtyp'
							fluid
							selection
							options={logTypeOptions}
							value={logType}
							onChange={(e, val) => { setLogType(val.value) }}
						/>
						<Form.Dropdown
							name='View'
							label='Vy'
							placeholder='Vy'
							fluid
							selection
							options={displayTypeOptions}
							value={displayType}
							onChange={(e, val) => { setDisplayType(val.value) }}
						/>
						<Form.Dropdown
							name='User'
							label='Användare'
							placeholder='Användare'
							fluid
							selection
							options={userOptions}
							value={selectedUser}
							onChange={(e, val) => { setSelectedUser(val.value) }}
						/>
					</Form.Group>
				</Form>
			</Segment>
			{filteredLogs &&
				<>
					{logsHtml}
				</>
			}
			{!filteredLogs &&
				<Segment style={{ marginTop: '15%' }} basic>
					<Loader active size='big'>Laddar</Loader>
				</Segment>
			}

		</center>
	);
}

export default Logs;