// api/route.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connection } from '@/lib/mongoose'
import { Node } from '@/lib/mongoose/models/Node'
import { Workflow } from '@/lib/mongoose/models/Workflow'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connection()

  /* POST ------------------------------------------------------ */
  if (req.method === 'POST') {
    const session = await Node.startSession()
    session.startTransaction()
    try {
      const { type, position, data, workflow } = req.body
      const node = new Node({ type, position, data })
      await node.save({ session })

      await Workflow.findOneAndUpdate(
        { _id: workflow },
        { $push: { nodes: node._id } },
        { new: true }
      ).session(session)

      await session.commitTransaction()
      session.endSession()
      return res.status(201).json(node)
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      console.error(error)
      return res.status(500).json({ message: 'Error al crear el workflow.' })
    }
  }
}

export default handler
