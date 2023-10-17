// api/route.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connection } from '@/lib/mongoose'
import { Workflow } from '@/lib/mongoose/models/Workflow'
import { Edge } from '@/lib/mongoose/models/Edge'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connection()

  /* DELETE ------------------------------------------------------ */
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      const session = await Edge.startSession()
      session.startTransaction()

      const edge = await Edge.findById(id).session(session)

      if (!edge) {
        await session.endSession()
        throw new Error('Edge not found.')
      }

      await Edge.findByIdAndDelete(id).session(session)

      const workflow = await Workflow.findOne({ edges: id }).session(session)

      if (workflow) {
        workflow.edges.pull(id)
        await workflow.save({ session })
      }

      await session.commitTransaction()
      session.endSession()

      return res.status(200).json({ message: 'Edge deleted successfully.' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error deleting the node.' })
    }
  }

  /* PUT ------------------------------------------------------ */
  if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const { source, target } = req.body
      const node = await Edge.findByIdAndUpdate(
        id,
        { source, target },
        { new: true }
      )
      if (!node) throw new Error('Edge not found.')
      res.status(200).json(node)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error updating the workflow.' })
    }
  }
}

export default handler
