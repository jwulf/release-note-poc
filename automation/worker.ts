import {ZBClient} from 'zeebe-node';
import dotenv from 'dotenv';
import * as db from './database'
import { FirestoreRecord } from './dataschema';
dotenv.config()

const zbc = new ZBClient()

export function startDatabaseWorker() {
  zbc.createWorker<FirestoreRecord>({
      taskType: 'upsert-record',
      taskHandler: async job => {
          console.log(job.variables)
          const id = job.variables.id ?? db.createDocId(job.variables.githubIssueUrl)
          await db.saveDoc({...job.variables, id})
          return job.complete()
      }
  })
}