if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const port = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
router.use(errorHandler);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
