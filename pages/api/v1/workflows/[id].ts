// api/route.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connection } from '@/lib/mongoose'
import { Workflow } from '@/lib/mongoose/models/Workflow'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connection()

  /* GET by ID ------------------------------------------------- */
  if (req.method === 'GET') {
    try {
      const { id } = req.query
      const workflow = await Workflow.findById(id)
        .populate('nodes')
        .populate('edges')
      if (!workflow) throw new Error('Workflow not found.')
      res.status(200).json(workflow)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error retrieving the workflow.' })
    }
  }

  /* DELETE ------------------------------------------------------ */
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      const workflow = await Workflow.findByIdAndUpdate(id, { deleted: true })
      if (!workflow) throw new Error('Workflow not found.')
      res.status(200).json({ message: 'Workflow deleted successfully.' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error deleting the workflow.' })
    }
  }

  /* PUT ------------------------------------------------------ */
  if (req.method === 'PUT') {
    try {
      const { id } = req.query
      const { name, description } = req.body
      const workflow = await Workflow.findByIdAndUpdate(
        id,
        { name, description },
        { new: true }
      )
      if (!workflow) throw new Error('Workflow not found.')
      res.status(200).json(workflow)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error updating the workflow.' })
    }
  }
}

export default handler
