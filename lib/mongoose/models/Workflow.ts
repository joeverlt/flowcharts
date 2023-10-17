import { Document, Schema, model, models } from 'mongoose'
import { NodeDocument } from './Node'
import { EdgeDocument } from './Edge'

export interface WorkflowDocument extends Document {
  name: string
  description: string
  deleted: boolean
  nodes: NodeDocument['_id'][]
  edges: EdgeDocument['_id'][]
}

const schema = new Schema<WorkflowDocument>(
  {
    name: String,
    description: String,
    deleted: { type: Boolean, default: false },
    nodes: [{ type: Schema.Types.ObjectId, ref: 'Node' }],
    edges: [{ type: Schema.Types.ObjectId, ref: 'Edge' }]
  },
  { timestamps: true }
)

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  }
})

export const Workflow =
  models.Workflow || model<WorkflowDocument>('Workflow', schema)
