import { Document, Schema, model, models } from 'mongoose'
import { WorkflowDocument } from './Workflow'

export enum NodeType {
  START = 'start',
  END = 'end',
  ACTION = 'action',
  CONDITION = 'condition'
}

export interface NodeDocument extends Document {
  type: NodeType
  position: { x: number; y: number }
  data: { label: string; description: string }
}

const schema = new Schema<NodeDocument>(
  {
    type: String,
    position: { x: Number, y: Number },
    data: { label: String, description: String }
  },
  { timestamps: true }
)

export const Node = models.Node || model<NodeDocument>('Node', schema)
