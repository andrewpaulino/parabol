import Notification from './Notification'
import {NotificationEnum} from 'parabol-client/types/graphql'

export type TaskInvolvement = 'ASSIGNEE' | 'MENTIONEE'

interface Input {
  changeAuthorId: string
  involvement: TaskInvolvement
  taskId: string
  teamId: string
  userId: string
}

export default class NotificationTaskInvolves extends Notification {
  changeAuthorId: string
  involvement: TaskInvolvement
  taskId: string
  teamId: string

  constructor(input: Input) {
    const {teamId, changeAuthorId, involvement, taskId, userId} = input
    super({userId, type: NotificationEnum.TASK_INVOLVES})
    this.changeAuthorId = changeAuthorId
    this.involvement = involvement
    this.taskId = taskId
    this.teamId = teamId
  }
}
