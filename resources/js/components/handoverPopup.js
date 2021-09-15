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

function HandoverPopup(props) {
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

	const [clientNames, setClientNames] = useState(props.clients.map((item) => { return ({ key: item.id, text: item.name, value: item.id }) }));
	const [dataMap, setDataMap] = useState([{ user: props.defaultClient, content: '', empty: false }, { user: null, content: '', empty: true }])


	const userObject = JSON.parse(localStorage.getItem('user'));

	useEffect(() => {
		if (dataMap[dataMap.length - 1].user != null) setDataMap([...dataMap, ...[{ user: null, content: '', empty: true }]]);
	}, [dataMap]);

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



	return (
		<Modal
			onClose={props.canceled}
			open={true}
		>
			<Dimmer active={handoverLoading}>
				<Loader size="huge" content="Skickar överlämning..." />
			</Dimmer>
			<Modal.Header>Ny Överlämning</Modal.Header>
			<Modal.Content image>
				<Modal.Description>
					{dataMap.map((item, index) => {
						return (
							<div key={'popperup' + index}>
								<Header>Kund {index + 1}</Header>
								<Form className="mb-5">
									<Form.Dropdown
										name='user'
										label='Användare'
										placeholder='Klas Bertilsson'
										disabled={clientNames.length === 0}
										fluid
										selection
										options={clientNames}
										value={item.user}
										onChange={(e, data) => { setDataMap(dataMap.map((child, childIndex) => { return (childIndex === index ? { ...child, user: data.value } : child) }))}}
									/>
									{!item.clean &&
										<Form.TextArea
											placeholder="Skriv vad nästa person behöver veta..."
											value={item.content}
											onChange={(e, data) => { setDataMap(dataMap.map((child, childIndex) => { return (childIndex === index ? { ...child, content: e.target.value } : child) }))}}
										/>
									}
									<Checkbox
										className="mb-3"
										toggle
										label="Inget att Rapportera - Allt OK"
										name="inget"
										checked={item.clean}
										onChange={(e) => setDataMap(dataMap.map((child, childIndex) => { return (childIndex === index ? { ...child, clean: !dataMap[index].clean } : child) }))}
									/>
								</Form>
							</div>
						)
					})
					}
				</Modal.Description>
			</Modal.Content>
			<Modal.Actions>
				<Button color='red' onClick={props.canceled}>
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

export default HandoverPopup;