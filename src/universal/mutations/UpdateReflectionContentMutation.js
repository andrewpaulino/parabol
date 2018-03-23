/**
 * Updates a reflection's content for the retrospective meeting.
 *
 * @flow
 */
import {commitMutation} from 'react-relay';
import {Environment, RecordSourceProxy, RecordSourceSelectorProxy} from 'relay-runtime';

type Variables = {
  content: string,
  reflectionId: string
};

type CompletedHandler = (response: ?Object, errors: ?Array<Error>) => void;

type ErrorHandler = (error: Error) => void;

graphql`
  fragment UpdateReflectionContentMutation_team on UpdateReflectionContentPayload {
    meeting {
      id
    }
    reflection {
      id
      content
    }
  }
`;

const mutation = graphql`
  mutation UpdateReflectionContentMutation($content: String!, $reflectionId: ID!) {
    updateReflectionContent(content: $content, reflectionId: $reflectionId) {
      ...UpdateReflectionContentMutation_team @relay(mask: false)
    }
  }
`;

export const updateReflectionContentUpdater = (payload: ?RecordSourceProxy, store: RecordSourceSelectorProxy) => {
  if (!payload) {
    return;
  }
  const payloadMeeting = payload.getLinkedRecord('meeting');
  if (!payloadMeeting) {
    return;
  }
  const meetingId = payloadMeeting.getValue('id');
  const reflection = payload.getLinkedRecord('reflection');
  if (!reflection) {
    return;
  }
  const meeting = store.get(meetingId);
  if (!meeting) {
    return;
  }
  const reflections = meeting.getLinkedRecords('reflections');
  if (!reflections) {
    return;
  }
  const reflectionToUpdate = reflections.find((r) => (
    r.getValue('id') === reflection.getValue('id')
  ));
  if (!reflectionToUpdate) {
    return;
  }
  reflectionToUpdate.setValue('content', reflection.getValue('content'));
};

const getOptimisticResponse = (variables: Variables, meetingId: string) => ({
  updateReflectionContent: {
    meeting: {
      __typename: 'RetrospectiveMeeting',
      id: meetingId
    },
    reflection: variables
  }
});

const CreateReflectionMutation = (
  environment: Environment,
  variables: Variables,
  meetingId: string,
  onError?: ErrorHandler,
  onCompleted?: CompletedHandler
) => {
  return commitMutation(environment, {
    mutation,
    variables,
    onCompleted,
    onError,
    optimisticResponse: getOptimisticResponse(variables, meetingId),
    updater: (store: RecordSourceSelectorProxy) => {
      const payload = store.getRootField('updateReflectionContent');
      updateReflectionContentUpdater(payload, store);
    }
  });
};

export default CreateReflectionMutation;
