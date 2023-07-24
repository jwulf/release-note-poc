import {Tasklist} from "camunda-8-sdk"
import dotenv from "dotenv"
import express from "express"
import { startDatabaseWorker } from "./worker"

var list = {}
dotenv.config()

const TASKLIST_URL = process.env.CAMUNDA_TASKLIST_BASE_URL
const t = new Tasklist.TasklistApiClient()

const app = express()
app.set('view engine', 'pug')

const port = 3000

app.listen(port, () => console.log(`Serving on port 3000...`))

app.get('/', (_, res) => {
    res.render('index', {list})
})

    
const update = () => t.getTasks({
    state: Tasklist.TaskState.CREATED
}).then(ts => {
    list = ts.tasks.map(task => ({
        id: task.processInstanceId,
        state: task.name,
        component: task.variables.component,
        title:  task.variables.githubIssueTitle,
        issueNo: (() => {
            const a = (task.variables.githubIssueUrl ?? '').split('/')
            return a.length > 1 ? a[a.length -1] : ''
        })(),
        githubIssueUrl: task.variables.githubIssueUrl,
        tasklistUrl: `${TASKLIST_URL}/${task.processInstanceId}`
    }))
})

update()
setInterval(update, 10000)
startDatabaseWorker()