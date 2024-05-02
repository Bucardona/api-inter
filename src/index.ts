import { routesDms } from '@dms/routesDms'
import { app, onStart } from '@/config/server'
import { jsonResponseFormat } from './dms/v1/utils/jsonResponseFormat'

app.use('/dms', routesDms)

app.use('*', (_, res) => res.json(jsonResponseFormat(404, 'Not Found')))

app.listen(Number(app.get('port')), onStart)
