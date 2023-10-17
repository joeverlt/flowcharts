import mongoose from 'mongoose'
import { Node } from './models/Node'
import { Workflow } from './models/Workflow'
import { Edge } from './models/Edge'

const DBuser = process.env.DATABASE_USER
const DBpassword = process.env.DATABASE_PASSWORD
const DBdatabase = process.env.DATABASE_NAME
const DBhost = process.env.DATABASE_HOST

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id
  }
})

// const url = `mongodb://${DBuser}:${DBpassword}@${DBhost}:${DBport}/${DBdatabase}?authSource=admin&directConnection=true&ssl=false`
const url = `mongodb+srv://${DBuser}:${DBpassword}@${DBhost}/${DBdatabase}?retryWrites=true&w=majority`

export const connection = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise()
    }
    console.info(' · Database connected')
    const connection = await mongoose.connect(url)
    await Workflow.find()
    await Node.find()
    await Edge.find()
    return connection
  } catch (error) {
    console.error('Error: ', error)
  }
}
