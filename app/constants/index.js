export default {
  AVAILABLE_LOGOS: ['carol', 'linkedin', 'rss', 'twitter', 'facebook', 'salesforce', 'netsuite', 'adp', 'dropbox', 'file', 'totvs'],
  ENTITY_SPACE_PUBLISHED: 'PRODUCTION',
  ENTITY_SPACE_WORKING: 'WORKING',
  NEW_RECORDS_TIME_OFFSET: 3 * 24 * 60 * 60 * 1000, //3 days to milliseconds
  RUNNING_STATE_PAUSED: 'PAUSED',
  RUNNING_STATE_RUNNING: 'RUNNING',
  UPDATED_RECORDS_TIME_OFFSET: 10 * 60 * 1000, // 10 minutes
  ROLE_USER: 'USER',
  ROLE_EXPLORER: 'EXPLORER',
  ROLE_REPORT_VIEWER: 'REPORT_VIEWER',
  ROLE_TENANTADMIN: 'TENANTADMIN',
  ROLE_CAROL_ADMIN: 'CAROLADMIN',
  SURVIVORSHIP_DEFAULT_PARAMETER: 'most recent'
};
