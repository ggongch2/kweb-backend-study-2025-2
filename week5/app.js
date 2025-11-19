const {runQuery} = require('./database');

const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
	secret: 'asdf',
	resave: false,
	saveUninitialized: true,
}));

app.get('/me', (req, res) => {
	const {requester} = req.session ;
	if(!requester) return res.send('너 로그인 안함') ;
	const {id, name, status} = requester ;
	return res.send(`id : ${id}, name : ${name}, status : ${status}`) ; 
});

app.get('/login', (req, res) => {
	const userName = req.query.userName ;
	const password = req.query.password ;

	if(password !== '1q2w3e4r') {
		res.send('wrong password') ;
		return ; 
	}

	req.session.requester = {
		id : 1, 
		name : userName, 
		status : '정상'
	};

	return res.send('Login succesed') ; 
	
});

app.get('/logout', (req, res) => {
	req.session.destroy(err => {
		if(err) return res.send('something wong') ;
		return res.send('성공!') ;
	})
});

app.get('/student', async (req, res) => {
	const query = req.query.id ;
	const result = await runQuery('select * FROM students where student_id = '+ query) ;
	return res.send(JSON.stringify(result)) ;
}) ;

app.get('/xss', (req, res) => {
	const content = req.query.content ;
	return res.send(content) ; 

});




app.listen(8000, ()=>console.log('server started!'));
