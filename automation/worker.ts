import {Firestore} from '@google-cloud/firestore';
import {ZBClient} from 'zeebe-node';
import dotenv from 'dotenv';

dotenv.config()

const db = new Firestore({
  projectId: 'camunda-researchanddevelopment',
});

const zbc = new ZBClient()

export function startDatabaseWorker() {
  zbc.createWorker({
      taskType: 'upsert-record',
      taskHandler: async job => {
          console.log(job.variables)
          const id = job.variables.githubIssueUrl.replace('/', '_')
          await db.doc(id).set(job.variables)
          return job.complete()
      }
  })
}