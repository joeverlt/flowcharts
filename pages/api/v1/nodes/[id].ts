// api/route.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connection } from '@/lib/mongoose'
import { Workflow } from '@/lib/mongoose/models/Workflow'
import { Node } from '@/lib/mongoose/models/Node'
import { Edge } from '@/lib/mongoose/models/Edge'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connection()

  /* DELETE ------------------------------------------------------ */
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      const session = await Node.startSession()
      session.startTransaction()

      const node = await Node.findById(id).session(session)

      if (!node) {
        await session.endSession()
        throw new Error('Node not found.')
      }

      await Edge.deleteMany({ $or: [{ source: id }, { target: id }] }).session(
        session
      )

      await Node.findByIdAndDelete(id).session(session)

      const workflow = await Workflow.findOne({ nodes: id }).session(session)

      if (workflow) {
        workflow.nodes.pull(id)
        await workflow.save({ session })
      }

      await session.commitTransaction()
      session.endSession()

      return res.status(200).json({ message: 'Node deleted successfully.' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error deleting the node.' })
    }
  }

  /* PUT ------------------------------------------------------ */
  if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const { position, data } = req.body
      const node = await Node.findByIdAndUpdate(
        id,
        { position, data },
        { new: true }
      )
      if (!node) throw new Error('Node not found.')
      res.status(200).json(node)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error updating the workflow.' })
    }
  }
}

export default handler
