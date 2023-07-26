import {Tasklist} from "camunda-8-sdk"
import dotenv from "dotenv"
import express from "express"
import fs from 'fs'
import { startDatabaseWorker } from "./worker"
import paginate from 'express-paginate'

var list = {}
dotenv.config()

const TASKLIST_URL = process.env.CAMUNDA_TASKLIST_BASE_URL
const t = new Tasklist.TasklistApiClient()

const app = express()
app.set('view engine', 'pug')
app.use(paginate.middleware(10, 50));


const port = 3000

app.listen(port, () => console.log(`Serving on http://127.0.0.1:3000...`))

const releases = JSON.parse(fs.readFileSync('rel-8.3-report.raw.json', 'utf-8'))

app.get('/', (_, res) => {
    res.render('index', {list})
})
app.get('/releases', (req, res) => {
    const limit = parseInt(req.query.limit as any ?? 50)
    const pageCount = Math.ceil(releases.length / limit)
    console.log({pageCount})
    const itemCount = releases.length
    const skip = req.skip ?? 0
    const results = releases.slice(skip, +limit)
    console.log({skip, limit})
    console.log(results)
    res.render('release-matrix', {
        releases,
        pageCount,
        itemCount,
        pages: paginate.getArrayPages(req)(1, pageCount, req.query.page! as any)
    })
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
        tasklistUrl: `${TASKLIST_URL}/${task.id}`,
        releaseNoteType: task.variables.releaseNoteType
    }))
}).catch(console.error)

update()
setInterval(update, 10000)
startDatabaseWorker()