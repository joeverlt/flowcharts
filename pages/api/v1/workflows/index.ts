// api/route.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { connection } from '@/lib/mongoose'
import { Workflow } from '@/lib/mongoose/models/Workflow'
import { Node, NodeType } from '@/lib/mongoose/models/Node'
import { Edge } from '@/lib/mongoose/models/Edge'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connection()

  /* POST ------------------------------------------------------ */
  if (req.method === 'POST') {
    const session = await Workflow.startSession()
    session.startTransaction()
    try {
      const { name, description } = req.body

      const nodes: any[] = []

      const startNode = new Node({
        type: NodeType.START,
        position: { x: 0, y: 0 },
        data: { label: 'Start', description: 'This is the start node.' }
      })
      const conditionNode = new Node({
        type: NodeType.CONDITION,
        position: { x: 0, y: 100 },
        data: {
          label: 'Condition',
          description: 'This is a condition node.'
        }
      })
      const actionNode = new Node({
        type: NodeType.ACTION,
        position: { x: 0, y: 200 },
        data: { label: 'Action', description: 'This is an action node.' }
      })
      const endNode = new Node({
        type: NodeType.END,
        position: { x: 0, y: 300 },
        data: { label: 'End', description: 'This is the end node.' }
      })

      nodes.push(startNode, conditionNode, actionNode, endNode)

      await Node.insertMany(nodes, { session })

      const edges = await Edge.insertMany(
        [
          { source: startNode._id, target: conditionNode._id },
          { source: conditionNode._id, target: actionNode._id },
          { source: actionNode._id, target: endNode._id }
        ],
        { session }
      )

      const workflow = new Workflow({
        name,
        description,
        nodes: nodes.map((node) => node._id),
        edges: edges.map((edge) => edge._id)
      })

      await workflow.save({ session })

      await session.commitTransaction()
      session.endSession()

      return res.status(201).json(workflow)
    } catch (error) {
      await session.abortTransaction()
      session.endSession()
      console.error(error)
      return res.status(500).json({ message: 'Error al crear el workflow.' })
    }
  }

  /* GET ------------------------------------------------------ */
  if (req.method === 'GET') {
    try {
      const workflows = await Workflow.find({ deleted: false })
      res.status(200).json(workflows)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error retrieving the workflows.' })
    }
  }
}

export default handler
