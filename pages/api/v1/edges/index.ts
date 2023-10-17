// api/route.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connection } from '@/lib/mongoose'
import { Workflow } from '@/lib/mongoose/models/Workflow'
import { Edge } from '@/lib/mongoose/models/Edge'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connection()

  /* POST ------------------------------------------------------ */
  if (req.method === 'POST') {
    const session = await Edge.startSession()
    session.startTransaction()
    try {
      const { source, target, workflow } = req.body
      const edge = new Edge({ source, target })
      await edge.save({ session })

      await Workflow.findOneAndUpdate(
        { _id: workflow },
        { $push: { edges: edge._id } },
        { new: true }
      ).session(session)

      await session.commitTransaction()
      session.endSession()
      return res.status(201).json(edge)
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      console.error(error)
      return res.status(500).json({ message: 'Error al crear el workflow.' })
    }
  }
}

export default handler
