import * as writingAnalysisService from './services/writingAnalysisService';
import * as readingSessionService from './services/readingSessionService';

async function loadWritingData(conversationId) {
    const generalReport = await writingAnalysisService.fetchGeneralReport(conversationId);
}
