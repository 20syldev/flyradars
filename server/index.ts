import express from 'express';
import cors from 'cors';
import queriesRouter from './routes/queries.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', queriesRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
