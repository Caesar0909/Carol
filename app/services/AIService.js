// @flow
import MdmAIService from 'totvslabs-ui-framework/react-native/rest/services/aiNlp.service.js';

import ExploreService from './ExploreService';
import Team from '../models/Team';

class AIService extends ExploreService {

    static sendQuestion (question: string, success: Function, failure?: Function) {
        //alert(Team.getTeamName());
        super.setupRestService();
        return super.createAuthenticatedRequest(
            () => MdmAIService.carolAINLPQuery({"question": question}),
            success,
            failure
        );
    }

    static sendResponse (msgId: string, resp: boolean, success: Function, failure?: Function) {

        // return super.createAuthenticatedRequest(
        //     () => MdmAIService.sendResponse(msgId, resp),
        //     success,
        //     failure
        // );
    }

}

export default AIService;
