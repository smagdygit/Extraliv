import React, { useState, useContext, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Link, useParams } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Divider, Modal, Icon } from 'semantic-ui-react';
import PrivateRoute from './PrivateRoute';
import { createBrowserHistory } from 'history';
import Login from './Login';
import Clients from './Clients';
import Client from './Client';
import 'bootstrap/dist/css/bootstrap.css';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {
    const userObject = JSON.parse(localStorage.getItem('user'));

    document.body.style = 'background: #EEFBFF;';

    return (
        <Router history={createBrowserHistory()}>
            <>
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
                </center>
                <div id="app">
                    <Switch>
                        <Route path="/login" component={Login} exact />
                        <Route path="/" component={Login} exact />
                        <Route path="/undefined" component={Login} exact />
                        <Route path="/kunder" component={Clients} exact />
                        <Route path="/kund" component={Client} exact />
                    </Switch>
                </div>
            </>
        </Router>
    );
}

export default App;

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}
