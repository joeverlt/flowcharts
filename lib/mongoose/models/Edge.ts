import { Document, Schema, model, models } from 'mongoose'
import { WorkflowDocument } from './Workflow'
import { NodeDocument } from './Node'

export interface EdgeDocument extends Document {
  source: NodeDocument['_id']
  target: NodeDocument['_id']
}

const schema = new Schema<EdgeDocument>(
  {
    source: { type: Schema.Types.ObjectId, ref: 'Node' },
    target: { type: Schema.Types.ObjectId, ref: 'Node' }
  },
  { timestamps: true }
)

export const Edge = models.Edge || model<EdgeDocument>('Edge', schema)
