// @flow
import moment from 'moment'
import type { FirebaseDB } from '../lib/firebase'


export default class InquiryRepository {
  db: FirebaseDB
  constructor(db: FirebaseDB) {
    this.db = db
  }

  async addInquiry(uid: string, body: string, time: moment = moment()) {
    const now = time.utc().format('YYYY-MM-DDTHH:mm:ss-SSS\\Z')
    const key = `inquiries/${now}`
    const updates = {
      [`${key}/uid`]: uid,
      [`${key}/body`]: body,
    }
    await this.db.ref().update(updates)
  }
}
