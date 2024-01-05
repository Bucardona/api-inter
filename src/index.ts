import { routesDms } from './dms/routesDms'
import { app, onStart } from './config/server'

app.use('/dms', routesDms)

app.listen(app.get('port'), onStart)