import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {createFragmentContainer} from 'react-relay'
import {PALETTE} from '../../../../../styles/paletteV2'
import {FONT_FAMILY} from '../../../../../styles/typographyV2'
import makeDateString from '../../../../../utils/makeDateString'
import {SummaryHeader_meeting} from '../../../../../__generated__/SummaryHeader_meeting.graphql'
import emailDir from '../../../emailDir'

const meetingSummaryLabel = {
  color: PALETTE.TEXT_GRAY,
  fontFamily: FONT_FAMILY.SANS_SERIF,
  textTransform: 'uppercase',
  fontSize: '12px',
  fontWeight: 600,
  paddingTop: 8,
  textAlign: 'center'
} as React.CSSProperties

const teamNameLabel = {
  color: PALETTE.TEXT_MAIN,
  fontFamily: FONT_FAMILY.SANS_SERIF,
  fontSize: 36,
  fontWeight: 600,
  paddingTop: 16
} as React.CSSProperties

const dateLabel = {
  color: PALETTE.TEXT_GRAY,
  fontFamily: FONT_FAMILY.SANS_SERIF,
  fontSize: '15px',
  fontWeight: 400,
  paddingTop: 8
} as React.CSSProperties

interface Props {
  meeting: SummaryHeader_meeting
  isDemo?: boolean
}

const SummaryHeader = (props: Props) => {
  const {meeting, isDemo} = props
  const {createdAt, name: meetingName, team} = meeting
  const {name: teamName} = team
  const meetingDate = makeDateString(createdAt, {showDay: true})
  return (
    <table align='center' width='100%'>
      <tbody>
        <tr>
          <td align='center' style={{paddingTop: 16}}>
            <img
              crossOrigin=''
              alt='Parabol Logo'
              src={`${emailDir}mark-purple@3x.png`}
              height='28'
              width='31'
            />
          </td>
        </tr>
        <tr>
          <td align='center' style={meetingSummaryLabel}>
            {'Meeting Summary'}
          </td>
        </tr>
        <tr>
          <td align='center' style={teamNameLabel}>
            {teamName}
          </td>
        </tr>
        <tr>
          <td align='center' style={dateLabel}>
            {isDemo ? meetingDate : `${meetingName} • ${meetingDate}`}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default createFragmentContainer(SummaryHeader, {
  meeting: graphql`
    fragment SummaryHeader_meeting on NewMeeting {
      createdAt
      name
      team {
        name
      }
    }
  `
})
