import { indexOf } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Divider, Modal, Icon, Loader, Checkbox, Dimmer } from 'semantic-ui-react';

function Clients() {
	const userObject = JSON.parse(localStorage.getItem('user'));
	const history = useHistory();
	const [newUserPass, setNewUserPass] = useState('');
	const [sending, setSending] = useState(false);
	const [error, setError] = useState('');

	function sendNewPassword() {
		setError('');
		if (newUserPass.length >= 16) {
			setSending(true);
			fetch('/api/user/change-password', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': userObject.token,
				},
				body: JSON.stringify({
					password: newUserPass
				}),
			})
				.then(response => response.json())
				.then(data => {
					setSending(false);
					if (data.success) {
						const changedUser = {...userObject};
						changedUser.force_change = false;
						localStorage.setItem('user', JSON.stringify(changedUser));
						history.push(`/kunder`);
					} else {
						setError(' - Okänt fel, kontakta systemadministatör');
					}
				});
		} else {
			setError(' - Lösenordet är ej tillräckligt långt');
		}
	}

	return (
		<center>
			<Segment className="m-3">
				<Dimmer active={sending}>
					<Loader content="Kollar lösenord..." />
				</Dimmer>
				<h3>Skapa ett nytt lösenord</h3>
				<div className="text-left">
					<h4>Krav:</h4>
					<p>Minst 16 karaktärer långt<br />Du får inte välja ett lösenord du har på någon annan webbplats<br />Välj något säkert, våra kunders integritet står på spel<br /><br /></p>
					<h4 className="text-danger">Inte Bra:</h4>
					<p>aaaabbbbcccc<br />1234...</p>
					<h4 className="text-success">Bra:</h4>
					<p>AllaBananerHeterPetrus<br />JagÄlskarAttStädaHosPeterPan<br /><br />(Dessa är endast exempel, välj inte dessa exakta lösenord)</p>
					<h4 className={newUserPass.length < 16 ? "text-danger" : "text-success"}>{newUserPass.length} / 16{error}</h4>
					<Input
						type='password'
						className="mb-3"
						fluid
						icon='hide'
						iconPosition='left'
						placeholder='Lösenord'
						error={error !== ''}
						value={newUserPass}
						onChange={(e) => { setNewUserPass(e.target.value) || setError('') }}
					/>
					<Button fluid color="green" onClick={sendNewPassword}>Uppdatera lösenord</Button>
				</div>
			</Segment>
		</center>
	);
}

export default Clients;