import {GraphQLID, GraphQLInterfaceType, GraphQLNonNull} from 'graphql'
import {CHECKIN, UPDATES} from '../../../client/utils/constants'
import CheckInStage from './CheckInStage'
import {resolveTeamMember} from '../resolvers'
import TeamMember from './TeamMember'
import UpdatesStage from './UpdatesStage'
import MeetingMember from './MeetingMember'
import {GQLContext} from '../graphql'
import fromTeamMemberId from 'parabol-client/utils/relay/fromTeamMemberId'
import toTeamMemberId from 'parabol-client/utils/relay/toTeamMemberId'

export const newMeetingTeamMemberStageFields = () => ({
  meetingMember: {
    description: 'The meeting member that is the focus for this phase item',
    type: new GraphQLNonNull(MeetingMember),
    resolve: async (source, _args, {dataLoader}: GQLContext) => {
      const {meetingId, teamMemberId} = source
      const {userId} = fromTeamMemberId(teamMemberId)
      const meetingMemberId = toTeamMemberId(meetingId, userId)
      return dataLoader.get('meetingMembers').load(meetingMemberId)
    }
  },
  teamMemberId: {
    type: new GraphQLNonNull(GraphQLID),
    description: 'foreign key. use teamMember'
  },
  teamMember: {
    description: 'The team member that is the focus for this phase item',
    type: new GraphQLNonNull(TeamMember),
    resolve: resolveTeamMember
  }
})

const NewMeetingTeamMemberStage = new GraphQLInterfaceType({
  name: 'NewMeetingTeamMemberStage',
  description:
    'An instance of a meeting phase item. On the client, this usually represents a single view',
  fields: newMeetingTeamMemberStageFields,
  resolveType: ({phaseType}) => {
    const resolveTypeLookup = {
      [CHECKIN]: CheckInStage,
      [UPDATES]: UpdatesStage
    }
    return resolveTypeLookup[phaseType]
  }
})

export default NewMeetingTeamMemberStage
