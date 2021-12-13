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
	const [handoverLoading, setHandoverLoading] = useState(false);
	const [fetchedClients, setFetchedClients] = useState([]);
	const [animateRemoval, setAnimateRemoval] = useState({ id: -1, ms: 0, timer: null });

	const [clientNames, setClientNames] = useState([]);
	const [dataMap, setDataMap] = useState(props.defaultClient !== undefined ? [{ user: props.defaultClient, content: '', empty: false, clean: false, error: '' }, { user: null, content: '', empty: true, clean: false, error: '' }] : [{ user: null, content: '', empty: true, clean: false, error: '' }]);

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
				setClientNames([{ key: -1, text: '*** Ta Bort ***', value: -1 }].concat(data.map((item) => { return ({ key: item.id, text: item.name, value: item.id }) })));
			});
	}, []);

	// ADD EMPTY ROWS WHEN A USER HAS BEEN ADDED, AND REMOVE ROWS THAT HAS BEEN SET TO NO USER
	useEffect(() => {
		const isModified = (dataMap[dataMap.length - 1].user != null);
		let moddedArray = isModified ? [...dataMap, ...[{ user: null, content: '', empty: true, clean: false, error: '' }]] : undefined;

		if (moddedArray === undefined) moddedArray = [...dataMap];

		const foundIndex = dataMap.findIndex(x => x.user === -1);

		if (foundIndex !== -1) {console.log("bean");
			moddedArray.splice(foundIndex, 1);
			setDataMap([...moddedArray]);
		} else {
			if (isModified) {console.log("machine");
				setDataMap([...moddedArray]);
			}
		}
	}, [dataMap]);

	function validateHandover() {

		let isErrors = false;
		const dataMapClone = [...dataMap];
		dataMapClone.forEach((item) => {

			//Reset
			item.error = '';

			//If there is content/ok but no user
			if (item.user !== null && item.clean === false && item.content.length < 1) {
				item.error = 'content';
				isErrors = true;
			}

			//If there is user but no content/ok
			if (item.user === null && (item.clean === true || item.content.length > 0)) {
				item.error = 'user';
				isErrors = true;
			}

		});
		setDataMap([...dataMapClone]);

		return (!isErrors);
	}

	function sendNewHandover() {
		if (validateHandover()) {
			setHandoverLoading(true);
			fetch('/api/messages/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': userObject.token,
				},
				body: JSON.stringify({
					data_map: dataMap,
				}),
			})
				.then(response => response.json())
				.then(data => {
					props.sent();
				});
		}
	}

	function handleNewUser(item, index, data, id) {
		setDataMap(dataMap.map((child, childIndex) => { return (childIndex === index ? { ...child, user: data.value } : child) }));
		setClientNames(clientNames.filter((child) => {
			return (child.key !== id);
		}))
	}

	return (
		<Modal
			onClose={props.canceled}
			open={true}
		>
			<Dimmer active={handoverLoading || fetchedClients.length === 0}>
				<Loader size="huge" content="Skickar överlämning..." />
			</Dimmer>
			<Modal.Header>Ny Överlämning</Modal.Header>
			<Modal.Content image>
				<Modal.Description>
					{fetchedClients.length > 0 && dataMap.map((item, index) => {
						return (
							<div key={'popperup' + index}>
								<Header>Kund {index + 1} {index === dataMap.length - 1 ? '(valfri)' : ''}</Header>
								<Form className="mb-5">
									<Form.Dropdown
										error={item.error === 'user'}
										name='user'
										label='Användare'
										placeholder='Välj Kund'
										disabled={clientNames.length === 0}
										fluid
										selection
										search
										options={clientNames}
										value={item.user}
										onChange={(e, data) => { handleNewUser({ ...item }, index, data, item.id) }}
									/>
									{!item.clean &&
										<Form.TextArea
											error={item.error === 'content'}
											placeholder="Skriv vad nästa person behöver veta..."
											value={item.content}
											onChange={(e, data) => { setDataMap(dataMap.map((child, childIndex) => { return (childIndex === index ? { ...child, content: e.target.value } : child) })) }}
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