import React, { useState, useContext, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Link, useParams, useHistory } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment, Input, Select, Divider, Modal, Icon, Menu } from 'semantic-ui-react';
import PrivateRoute from './PrivateRoute';
import { createBrowserHistory } from 'history';
import Login from './Login';
import Clients from './Clients';
import Client from './Client';
import Users from './Users';
import User from './User';
import Messages from './admin/Messages';
import Logs from './admin/Logs';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import ChangePassword from './ChangePassword';

function App() {
    const userObject = JSON.parse(localStorage.getItem('user'));


    return (
        <Router history={createBrowserHistory()}>
            <>
                <Navbar />
                <div id="app">
                    <Switch>
                        <Route path="/login" component={Login} exact />
                        <Route path="/" component={Login} exact />
                        <Route path="/undefined" component={Login} exact />
                        <PrivateRoute path="/kunder" component={Clients} exact />
                        <PrivateRoute path="/kund/:id" component={Client} exact />
                        <PrivateRoute path="/admin/anvandare" component={Users} exact />
                        <PrivateRoute path="/admin/anvandare/:id" component={User} exact />
                        <PrivateRoute path="/admin/meddelanden" component={Messages} exact />
                        <PrivateRoute path="/admin/loggar" component={Logs} exact />
                        <Route path="/byt-losenord" component={ChangePassword} exact />
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
