import React, { useState, useContext, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Link, useParams, useHistory } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Divider, Modal, Icon, Menu } from 'semantic-ui-react';

function Navbar() {
	const history = useHistory();
	const [activeItem, setActiveItem] = useState('Kunder');
	const userObject = JSON.parse(localStorage.getItem('user'));

	document.body.style = 'background: #EEFBFF;';

	function handleItemClick(e, { name }) {
		if (name === 'Kunder') {
			history.push(`/kunder/`);
			setActiveItem(name);
		}

		if (name === 'Admin') {
			history.push(`/admin/meddelanden`);
			setActiveItem(name);
		}
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
							<h3>Extraliv - {(userObject) ? userObject.name : 'Ej Inloggad'}</h3>
						</Grid.Column>
						<Grid.Column width={2} textAlign="center">
							<Icon name="log out" size="large" />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
			{!!userObject.admin &&
				<div className="m-3 p-0">
					<Menu className="m-0 p-0" fluid widths={3}>
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
					</Menu>
				</div>
			}
		</center>
	);
}

export default Navbar;