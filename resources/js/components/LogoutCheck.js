import React, { useState, useContext, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Link, useParams, useHistory } from 'react-router-dom';

export const check = () => {
	const history = useHistory();

	/*const userObject = JSON.parse(localStorage.getItem('user'));
	if (data.status !== 'success' && data.id === 'not-logged-in') console.log("ahahah"); else console.log("a");*/
	
	localStorage.removeItem('user');
	window.location.pathname = '/login';

	return(<></>);
}