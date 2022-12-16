import { TableService } from '../index.js'
import application from './application.js'

const tableService = TableService.getInstance()

const { PORT = 3000 } = process.env

const app = application({ tableService })

app
  .listen(PORT, () => console.info(`Server is listening on http://localhost:${PORT}`))
  .on('error', ({ message }) => console.error('Error starting server', message))
