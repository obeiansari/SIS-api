const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>Default Page</h1>');
});

app.use(auth);

app.use('/api/account', require('./api/account'));


app.listen(PORT, () => {
    console.log(`server listen on ${PORT}`);
})