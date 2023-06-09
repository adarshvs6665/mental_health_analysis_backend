import mongoose, { Document, Model, Schema } from "mongoose";

interface ITasks extends Document {
  taskId: String;
  taskName: String;
  taskTime: String;
  status: String;
  taskDescription: String;
  image: String;
}

interface ITaskList extends Document {
  userId: String;
  tasks: Array<ITasks>;
  assignedDate: String;
}

const TasksSchema: Schema<ITasks> = new mongoose.Schema({
  taskId: String,
  taskName: String,
  taskTime: String,
  status: String,
  taskDescription: String,
  image: String,
});

const TaskListSchema: Schema<ITaskList> = new mongoose.Schema({
  userId: String,
  tasks: [TasksSchema],
  assignedDate: String,
});

const TaskList: Model<ITaskList> = mongoose.model<ITaskList>(
  "TaskList",
  TaskListSchema
);

export default TaskList;
