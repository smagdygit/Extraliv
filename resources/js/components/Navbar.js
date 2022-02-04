import React, { useState, useContext, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Link, useParams, useHistory } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Divider, Modal, Icon, Menu } from 'semantic-ui-react';
import { check } from './LogoutCheck';

function Navbar() {
	const history = useHistory();
	const [activeItem, setActiveItem] = useState('Kunder');
	const [userObject, setUserObject] = useState(JSON.parse(localStorage.getItem('user')));

	document.body.style = 'background: #EEFBFF;';

	useEffect(() => {
		//console.log("user update", userObject);
		setUserObject(JSON.parse(localStorage.getItem('user')));
	}, [localStorage.getItem('user')]);

	function handleItemClick(e, { name }) {
		if (name === 'Kunder') {
			history.push(`/kunder/`);
			setActiveItem(name);
		}

		if (name === 'Admin') {
			history.push(`/admin/meddelanden`);
			setActiveItem(name);
		}

		if (name === 'Anvandare') {
			history.push(`/admin/anvandare`);
			setActiveItem(name);
		}

		if (name === 'Loggar') {
			history.push(`/admin/loggar`);
			setActiveItem(name);
		}
	}

	function logout() {
		fetch(`/api/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': userObject.token,
			},
		})
		.then(response => {return response.ok ? response.json() : check})
			.then(data => {
				localStorage.removeItem('user');
				setUserObject(null);
				history.push(`/login`);
			})
	}

	return (
		<center>
			<Segment className="m-3">
				<Grid className="m-0">
					<Grid.Row className="m-0">
						<Grid.Column width={2} textAlign="center">
							<Icon name="bell" size="large" />
						</Grid.Column>
						<Grid.Column width={12}>
							<h3>{(userObject) ? userObject.name : 'Ej Inloggad'}</h3>
						</Grid.Column>
						<Grid.Column width={2} textAlign="center" onClick={logout}>
							<Icon name="log out" size="large" color="red" />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
			{userObject && !!userObject.admin &&
				<div className="m-3 p-0">
					<Menu className="m-0 p-0" fluid widths={4}>
						<Menu.Item
							name='Kunder'
							active={activeItem === 'Kunder'}
							onClick={handleItemClick}
						>
							Kunder
						</Menu.Item>
						<Menu.Item
							name='Admin'
							active={activeItem === 'Admin'}
							onClick={handleItemClick}
						>
							Admin
						</Menu.Item>
						<Menu.Item
							name='Anvandare'
							active={activeItem === 'Anvandare'}
							onClick={handleItemClick}
						>
							Användare
						</Menu.Item>
						<Menu.Item
							name='Loggar'
							active={activeItem === 'Loggar'}
							onClick={handleItemClick}
						>
							Loggar
						</Menu.Item>
					</Menu>
				</div>
			}
		</center>
	);
}

export default Navbar;