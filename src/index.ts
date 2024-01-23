import { routesDms } from '@dms/routesDms'
import { app, onStart } from '@/config/server'

app.use('/dms', routesDms)

app.listen(Number(app.get('port')), String(app.get('host')), onStart)
