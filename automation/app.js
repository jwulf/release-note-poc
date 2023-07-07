const Firestore = require('@google-cloud/firestore');
const zb = require('zeebe-node')
const dotenv = require('dotenv')

dotenv.config()

const db = new Firestore({
  projectId: 'camunda-researchanddevelopment',
});

const zbc = new zb.ZBClient()

const databaseWorker = zbc.createWorker({
    taskType: 'upsert-record',
    taskHandler: async job => {
        console.log(job.variables)
        const id = job.variables.githubIssueUrl.replace('/', '_')
        await db.doc(id).set(job.variables)
        return job.complete()
    }
})