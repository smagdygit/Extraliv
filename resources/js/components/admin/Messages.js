import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter, Link, useParams } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Icon, Loader, Dimmer, Divider, Modal, Checkbox } from 'semantic-ui-react';


function Messages() {
	const history = useHistory();
	const [fetchedMessages, setFetchedMessages] = useState([]);
	const [animateRemoval, setAnimateRemoval] = useState({ id: -1, ms: 0, timer: null });
	const userObject = JSON.parse(localStorage.getItem('user'));



	useEffect(() => {
		fetchMessages();
	}, []);

	function fetchMessages() {
		fetch('/api/messages/all', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
		})
			.then(response => response.json())
			.then(data => {
				setFetchedMessages(data);
			});
	}

	function handleProcessed(id) {
		setAnimateRemoval({ id: id, ms: 500, timer: null });

		fetch('/api/messages/handled', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
			body: JSON.stringify({
				id: id,
			}),
		})
			.then(response => response.json())
			.then(data => {

			});
	}

	function handleRemove(id) {
		setAnimateRemoval({ id: id, ms: 500, timer: null });

		fetch('/api/messages/delete', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
			body: JSON.stringify({
				id: id,
			}),
		})
			.then(response => response.json())
			.then(data => {

			});
	}

	useEffect(() => {
		setTimeout(() => {
			if (animateRemoval.id !== -1) {
				if (animateRemoval.ms < 0) {
					const newMessages = [...fetchedMessages];
					fetchedMessages[fetchedMessages.findIndex((x) => x.id === animateRemoval.id)].handled = true;
					setFetchedMessages([...newMessages]);
					setAnimateRemoval({ ...animateRemoval.id = -1 });
				}
				else {
					const newRemoval = { ...animateRemoval };
					newRemoval.ms = animateRemoval.ms - 10;
					setAnimateRemoval({ id: newRemoval.id, timer: newRemoval.timer, ms: newRemoval.ms });
				}
			}
		});
	}, [animateRemoval.ms]);

	function messageHTML(item, index, read, removal) {
		return (
			<Segment className="m-3 p-0" key={'message' + index}>
				<Dimmer active={removal}>
					<Loader active size="huge" inverted />
				</Dimmer>
				<Grid className="m-0" divided="vertically">
					<Grid.Row className="m-0 pb-0">
						<Grid.Column width={10} textAlign="left">
							<h4>{`${item.client.name} (${item.user.name})`}</h4>
						</Grid.Column>
						<Grid.Column width={6} textAlign="right">
							<h4>{new Date(item.updated_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="m-0 pt-5 pb-5">
						<Grid.Column>
							<p style={{ fontSize: '1.2rem' }}>{item.content}</p>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row className="m-0 p-0">
						<Grid.Column textAlign="left">
							<p>Läst av: {item.read_by.map((item) => { return (item.name) }).join(', ')}</p>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				{!read && !userObject.admin &&
					<Grid.Row className="m-3 mb-3">
						<Button fluid color="green" onClick={() => handleMarkAsRead(item.id)}>{'Markera som Läst'}</Button>
					</Grid.Row>
				}
				{!!userObject.admin &&
					<>
						{!item.handled &&
							<Grid.Row className="m-3 mb-3">
								<Button fluid color="green" onClick={() => handleProcessed(item.id)}>{'Markera Som Hanterad (Admin)'}</Button>
							</Grid.Row>
						}
						<Grid.Row className="m-3 mb-3">
							<Button fluid color="red" onClick={() => handleRemove(item.id)}>{'Ta Bort Permanent (Admin)'}</Button>
						</Grid.Row>
					</>
				}
			</Segment>
		)
	}

	const unhandledMessages = fetchedMessages ? fetchedMessages.filter((item) => (item.handled == false)).map((item, index) => (
		messageHTML(item, index, false, animateRemoval.id === item.id)
	)) : [];
	const handledMessages = fetchedMessages ? fetchedMessages.filter((item) => (item.handled == true)).map((item, index) => (
		messageHTML(item, index, true, false)
	)) : [];

	return (
		<center>
			{fetchedMessages.length > 0 &&
				<>
					<h3 className="mt-5">Ohanterade Meddelanden ({unhandledMessages.length})</h3>
					<Divider className="m-3" />
					{unhandledMessages}
					<h3 className="mt-5">Hanterade Meddelanden ({handledMessages.length})</h3>
					<Divider className="m-3" />
					{handledMessages}
				</>
			}
		</center>
	);
}

export default Messages;