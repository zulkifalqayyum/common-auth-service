import { relations } from "drizzle-orm/relations";
import { folders, aiAssistantConversationv2, users, aiAssistantConversationmessagev2, aiAssistantConversation, aiAssistantMessage, aiModels, aiTasks, apiKeys, spaces, task, customPrompts, aiAssistantMessageattachment, aiAssistantMessageAttachments, aiAssistantV2Messageattachmentv2, aiModelHealthAuditLogs, manualMetadata, aiJobsJob, aiJobsChunk, requiredActions, actionTokens, aiModelTokenUsage, organizations, aiTaskExecutions, apiKeyAuditLogs, databaseIngestions, djangoContentType, authPermission, djangoAdminLog, customMetadata, folderContentReads, ocrJob, jobExecution, ocrWorkUnit, executionAttempt, folderMembers, mediaHandlerJobs, multiFactorAuditLogs, mediaFiles, notificationPreferences, organizationAiQuotas, multiFactorEmailOtps, posts, postComments, organizationStorage, postLikes, postsManualMetadata, multiFactorMethods, notifications, postBroadshares, recordsManagerPostapprovalconfiguration, reservedDomains, smtpConfigurations, spaceMembers, storageLedger, quotaAuditLogs, sttWorkUnit, sttAttempt, sttJob, savedFilters, tokenBlacklistOutstandingtoken, sttExecution, userAiQuotas, userStorage, authGroup, usersGroups, usersUserPermissions, gmailConnectors, authGroupPermissions, tokenBlacklistBlacklistedtoken, aiAssistantConversationmessagev2Attachments } from "./schema";

export const aiAssistantConversationv2Relations = relations(aiAssistantConversationv2, ({one, many}) => ({
	folder: one(folders, {
		fields: [aiAssistantConversationv2.folderId],
		references: [folders.id]
	}),
	user: one(users, {
		fields: [aiAssistantConversationv2.userId],
		references: [users.id]
	}),
	aiAssistantConversationmessagev2s: many(aiAssistantConversationmessagev2),
}));

export const foldersRelations = relations(folders, ({one, many}) => ({
	aiAssistantConversationv2s: many(aiAssistantConversationv2),
	aiAssistantConversations: many(aiAssistantConversation),
	aiTasks: many(aiTasks),
	apiKeys: many(apiKeys),
	databaseIngestions: many(databaseIngestions),
	customPrompts: many(customPrompts),
	folderContentReads: many(folderContentReads),
	aiModel: one(aiModels, {
		fields: [folders.aiModelId],
		references: [aiModels.id]
	}),
	user: one(users, {
		fields: [folders.createdById],
		references: [users.id]
	}),
	space: one(spaces, {
		fields: [folders.spaceId],
		references: [spaces.id]
	}),
	folderMembers: many(folderMembers),
	mediaFiles: many(mediaFiles),
	posts: many(posts),
	tasks: many(task),
	gmailConnectors: many(gmailConnectors),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	aiAssistantConversationv2s: many(aiAssistantConversationv2),
	aiAssistantConversations: many(aiAssistantConversation),
	aiAssistantMessageattachments: many(aiAssistantMessageattachment),
	aiAssistantV2Messageattachmentv2s: many(aiAssistantV2Messageattachmentv2),
	aiModelHealthAuditLogs: many(aiModelHealthAuditLogs),
	actionTokens: many(actionTokens),
	aiModelTokenUsages: many(aiModelTokenUsage),
	aiTasks: many(aiTasks),
	apiKeys: many(apiKeys),
	databaseIngestions: many(databaseIngestions),
	djangoAdminLogs: many(djangoAdminLog),
	customPrompts: many(customPrompts),
	folderContentReads: many(folderContentReads),
	folders: many(folders),
	folderMembers: many(folderMembers),
	multiFactorAuditLogs_performedById: many(multiFactorAuditLogs, {
		relationName: "multiFactorAuditLogs_performedById_users_id"
	}),
	multiFactorAuditLogs_userId: many(multiFactorAuditLogs, {
		relationName: "multiFactorAuditLogs_userId_users_id"
	}),
	mediaFiles: many(mediaFiles),
	notificationPreferences: many(notificationPreferences),
	organizationAiQuotas: many(organizationAiQuotas),
	multiFactorEmailOtps: many(multiFactorEmailOtps),
	postComments: many(postComments),
	posts: many(posts),
	postLikes: many(postLikes),
	multiFactorMethods: many(multiFactorMethods),
	notifications_actorId: many(notifications, {
		relationName: "notifications_actorId_users_id"
	}),
	notifications_recipientId: many(notifications, {
		relationName: "notifications_recipientId_users_id"
	}),
	postBroadshares: many(postBroadshares),
	spaceMembers: many(spaceMembers),
	storageLedgers: many(storageLedger),
	quotaAuditLogs: many(quotaAuditLogs),
	requiredActions: many(requiredActions),
	savedFilters: many(savedFilters),
	tokenBlacklistOutstandingtokens: many(tokenBlacklistOutstandingtoken),
	userAiQuotas_allocatedById: many(userAiQuotas, {
		relationName: "userAiQuotas_allocatedById_users_id"
	}),
	userAiQuotas_userId: many(userAiQuotas, {
		relationName: "userAiQuotas_userId_users_id"
	}),
	userStorages: many(userStorage),
	usersGroups: many(usersGroups),
	usersUserPermissions: many(usersUserPermissions),
	tasks: many(task),
	organization: one(organizations, {
		fields: [users.organizationId],
		references: [organizations.id]
	}),
	gmailConnectors: many(gmailConnectors),
}));

export const aiAssistantConversationmessagev2Relations = relations(aiAssistantConversationmessagev2, ({one, many}) => ({
	aiAssistantConversationv2: one(aiAssistantConversationv2, {
		fields: [aiAssistantConversationmessagev2.conversationId],
		references: [aiAssistantConversationv2.id]
	}),
	aiAssistantConversationmessagev2Attachments: many(aiAssistantConversationmessagev2Attachments),
}));

export const aiAssistantMessageRelations = relations(aiAssistantMessage, ({one, many}) => ({
	aiAssistantConversation: one(aiAssistantConversation, {
		fields: [aiAssistantMessage.conversationId],
		references: [aiAssistantConversation.id]
	}),
	aiModel: one(aiModels, {
		fields: [aiAssistantMessage.llmId],
		references: [aiModels.id]
	}),
	aiAssistantMessageAttachments: many(aiAssistantMessageAttachments),
}));

export const aiAssistantConversationRelations = relations(aiAssistantConversation, ({one, many}) => ({
	aiAssistantMessages: many(aiAssistantMessage),
	aiTask: one(aiTasks, {
		fields: [aiAssistantConversation.aiTaskId],
		references: [aiTasks.id]
	}),
	apiKey: one(apiKeys, {
		fields: [aiAssistantConversation.apiKeyId],
		references: [apiKeys.id]
	}),
	folder: one(folders, {
		fields: [aiAssistantConversation.folderId],
		references: [folders.id]
	}),
	space: one(spaces, {
		fields: [aiAssistantConversation.spaceId],
		references: [spaces.id]
	}),
	task: one(task, {
		fields: [aiAssistantConversation.taskId],
		references: [task.id]
	}),
	user: one(users, {
		fields: [aiAssistantConversation.userId],
		references: [users.id]
	}),
}));

export const aiModelsRelations = relations(aiModels, ({many}) => ({
	aiAssistantMessages: many(aiAssistantMessage),
	aiModelHealthAuditLogs: many(aiModelHealthAuditLogs),
	aiModelTokenUsages: many(aiModelTokenUsage),
	folders: many(folders),
	organizationAiQuotas: many(organizationAiQuotas),
	spaces: many(spaces),
	quotaAuditLogs: many(quotaAuditLogs),
	userAiQuotas: many(userAiQuotas),
}));

export const aiTasksRelations = relations(aiTasks, ({one, many}) => ({
	aiAssistantConversations: many(aiAssistantConversation),
	folder: one(folders, {
		fields: [aiTasks.folderId],
		references: [folders.id]
	}),
	user: one(users, {
		fields: [aiTasks.userId],
		references: [users.id]
	}),
	aiTaskExecutions: many(aiTaskExecutions),
}));

export const apiKeysRelations = relations(apiKeys, ({one, many}) => ({
	aiAssistantConversations: many(aiAssistantConversation),
	apiKeyAuditLogs: many(apiKeyAuditLogs),
	user: one(users, {
		fields: [apiKeys.exposedById],
		references: [users.id]
	}),
	folder: one(folders, {
		fields: [apiKeys.folderId],
		references: [folders.id]
	}),
	organization: one(organizations, {
		fields: [apiKeys.organizationId],
		references: [organizations.id]
	}),
	apiKey: one(apiKeys, {
		fields: [apiKeys.rotatedFromId],
		references: [apiKeys.id],
		relationName: "apiKeys_rotatedFromId_apiKeys_id"
	}),
	apiKeys: many(apiKeys, {
		relationName: "apiKeys_rotatedFromId_apiKeys_id"
	}),
	space: one(spaces, {
		fields: [apiKeys.spaceId],
		references: [spaces.id]
	}),
}));

export const spacesRelations = relations(spaces, ({one, many}) => ({
	aiAssistantConversations: many(aiAssistantConversation),
	aiModelTokenUsages: many(aiModelTokenUsage),
	apiKeyAuditLogs: many(apiKeyAuditLogs),
	apiKeys: many(apiKeys),
	customPrompts: many(customPrompts),
	folders: many(folders),
	aiModel: one(aiModels, {
		fields: [spaces.aiModelId],
		references: [aiModels.id]
	}),
	organization: one(organizations, {
		fields: [spaces.organizationId],
		references: [organizations.id]
	}),
	spaceMembers: many(spaceMembers),
}));

export const taskRelations = relations(task, ({one, many}) => ({
	aiAssistantConversations: many(aiAssistantConversation),
	folder: one(folders, {
		fields: [task.folderId],
		references: [folders.id]
	}),
	user: one(users, {
		fields: [task.userId],
		references: [users.id]
	}),
}));

export const aiAssistantMessageattachmentRelations = relations(aiAssistantMessageattachment, ({one, many}) => ({
	customPrompt: one(customPrompts, {
		fields: [aiAssistantMessageattachment.customPromptId],
		references: [customPrompts.id]
	}),
	user: one(users, {
		fields: [aiAssistantMessageattachment.uploadedById],
		references: [users.id]
	}),
	aiAssistantMessageAttachments: many(aiAssistantMessageAttachments),
}));

export const customPromptsRelations = relations(customPrompts, ({one, many}) => ({
	aiAssistantMessageattachments: many(aiAssistantMessageattachment),
	folder: one(folders, {
		fields: [customPrompts.folderId],
		references: [folders.id]
	}),
	organization: one(organizations, {
		fields: [customPrompts.organizationId],
		references: [organizations.id]
	}),
	space: one(spaces, {
		fields: [customPrompts.spaceId],
		references: [spaces.id]
	}),
	user: one(users, {
		fields: [customPrompts.userId],
		references: [users.id]
	}),
}));

export const aiAssistantMessageAttachmentsRelations = relations(aiAssistantMessageAttachments, ({one}) => ({
	aiAssistantMessage: one(aiAssistantMessage, {
		fields: [aiAssistantMessageAttachments.messageId],
		references: [aiAssistantMessage.id]
	}),
	aiAssistantMessageattachment: one(aiAssistantMessageattachment, {
		fields: [aiAssistantMessageAttachments.messageattachmentId],
		references: [aiAssistantMessageattachment.id]
	}),
}));

export const aiAssistantV2Messageattachmentv2Relations = relations(aiAssistantV2Messageattachmentv2, ({one, many}) => ({
	user: one(users, {
		fields: [aiAssistantV2Messageattachmentv2.uploadedById],
		references: [users.id]
	}),
	aiAssistantConversationmessagev2Attachments: many(aiAssistantConversationmessagev2Attachments),
}));

export const aiModelHealthAuditLogsRelations = relations(aiModelHealthAuditLogs, ({one}) => ({
	user: one(users, {
		fields: [aiModelHealthAuditLogs.actorId],
		references: [users.id]
	}),
	aiModel: one(aiModels, {
		fields: [aiModelHealthAuditLogs.aiModelId],
		references: [aiModels.id]
	}),
}));

export const aiJobsJobRelations = relations(aiJobsJob, ({one, many}) => ({
	manualMetadatum: one(manualMetadata, {
		fields: [aiJobsJob.manualMetadataId],
		references: [manualMetadata.id]
	}),
	aiJobsChunks: many(aiJobsChunk),
}));

export const manualMetadataRelations = relations(manualMetadata, ({one, many}) => ({
	aiJobsJobs: many(aiJobsJob),
	customMetadata: many(customMetadata),
	folderContentReads: many(folderContentReads),
	mediaHandlerJobs: many(mediaHandlerJobs),
	ocrJobs: many(ocrJob),
	postsManualMetadata: many(postsManualMetadata),
	sttJobs: many(sttJob),
	databaseIngestion: one(databaseIngestions, {
		fields: [manualMetadata.databaseIngestionId],
		references: [databaseIngestions.id]
	}),
	mediaFile: one(mediaFiles, {
		fields: [manualMetadata.mediaFileId],
		references: [mediaFiles.id]
	}),
	gmailConnector: one(gmailConnectors, {
		fields: [manualMetadata.gmailConnectorId],
		references: [gmailConnectors.id]
	}),
}));

export const aiJobsChunkRelations = relations(aiJobsChunk, ({one}) => ({
	aiJobsJob: one(aiJobsJob, {
		fields: [aiJobsChunk.jobId],
		references: [aiJobsJob.id]
	}),
}));

export const actionTokensRelations = relations(actionTokens, ({one}) => ({
	requiredAction: one(requiredActions, {
		fields: [actionTokens.requiredActionId],
		references: [requiredActions.id]
	}),
	user: one(users, {
		fields: [actionTokens.userId],
		references: [users.id]
	}),
}));

export const requiredActionsRelations = relations(requiredActions, ({one, many}) => ({
	actionTokens: many(actionTokens),
	user: one(users, {
		fields: [requiredActions.userId],
		references: [users.id]
	}),
}));

export const aiModelTokenUsageRelations = relations(aiModelTokenUsage, ({one}) => ({
	aiModel: one(aiModels, {
		fields: [aiModelTokenUsage.aiModelId],
		references: [aiModels.id]
	}),
	organization: one(organizations, {
		fields: [aiModelTokenUsage.organizationId],
		references: [organizations.id]
	}),
	space: one(spaces, {
		fields: [aiModelTokenUsage.spaceId],
		references: [spaces.id]
	}),
	user: one(users, {
		fields: [aiModelTokenUsage.userId],
		references: [users.id]
	}),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	aiModelTokenUsages: many(aiModelTokenUsage),
	apiKeyAuditLogs: many(apiKeyAuditLogs),
	apiKeys: many(apiKeys),
	customPrompts: many(customPrompts),
	organizationAiQuotas: many(organizationAiQuotas),
	organizationStorages: many(organizationStorage),
	notifications: many(notifications),
	reservedDomains: many(reservedDomains),
	spaces: many(spaces),
	smtpConfigurations: many(smtpConfigurations),
	storageLedgers: many(storageLedger),
	users: many(users),
}));

export const aiTaskExecutionsRelations = relations(aiTaskExecutions, ({one}) => ({
	aiTask: one(aiTasks, {
		fields: [aiTaskExecutions.taskId],
		references: [aiTasks.id]
	}),
}));

export const apiKeyAuditLogsRelations = relations(apiKeyAuditLogs, ({one}) => ({
	apiKey: one(apiKeys, {
		fields: [apiKeyAuditLogs.apiKeyId],
		references: [apiKeys.id]
	}),
	organization: one(organizations, {
		fields: [apiKeyAuditLogs.organizationId],
		references: [organizations.id]
	}),
	space: one(spaces, {
		fields: [apiKeyAuditLogs.spaceId],
		references: [spaces.id]
	}),
}));

export const databaseIngestionsRelations = relations(databaseIngestions, ({one, many}) => ({
	folder: one(folders, {
		fields: [databaseIngestions.folderId],
		references: [folders.id]
	}),
	user: one(users, {
		fields: [databaseIngestions.uploadedById],
		references: [users.id]
	}),
	manualMetadata: many(manualMetadata),
}));

export const authPermissionRelations = relations(authPermission, ({one, many}) => ({
	djangoContentType: one(djangoContentType, {
		fields: [authPermission.contentTypeId],
		references: [djangoContentType.id]
	}),
	usersUserPermissions: many(usersUserPermissions),
	authGroupPermissions: many(authGroupPermissions),
}));

export const djangoContentTypeRelations = relations(djangoContentType, ({many}) => ({
	authPermissions: many(authPermission),
	djangoAdminLogs: many(djangoAdminLog),
}));

export const djangoAdminLogRelations = relations(djangoAdminLog, ({one}) => ({
	djangoContentType: one(djangoContentType, {
		fields: [djangoAdminLog.contentTypeId],
		references: [djangoContentType.id]
	}),
	user: one(users, {
		fields: [djangoAdminLog.userId],
		references: [users.id]
	}),
}));

export const customMetadataRelations = relations(customMetadata, ({one}) => ({
	manualMetadatum: one(manualMetadata, {
		fields: [customMetadata.manualMetadataId],
		references: [manualMetadata.id]
	}),
}));

export const folderContentReadsRelations = relations(folderContentReads, ({one}) => ({
	folder: one(folders, {
		fields: [folderContentReads.folderId],
		references: [folders.id]
	}),
	manualMetadatum: one(manualMetadata, {
		fields: [folderContentReads.metadataId],
		references: [manualMetadata.id]
	}),
	user: one(users, {
		fields: [folderContentReads.userId],
		references: [users.id]
	}),
}));

export const jobExecutionRelations = relations(jobExecution, ({one, many}) => ({
	ocrJob: one(ocrJob, {
		fields: [jobExecution.jobId],
		references: [ocrJob.id]
	}),
	ocrWorkUnits: many(ocrWorkUnit),
}));

export const ocrJobRelations = relations(ocrJob, ({one, many}) => ({
	jobExecutions: many(jobExecution),
	manualMetadatum: one(manualMetadata, {
		fields: [ocrJob.manualMetadataId],
		references: [manualMetadata.id]
	}),
	ocrWorkUnits: many(ocrWorkUnit),
}));

export const executionAttemptRelations = relations(executionAttempt, ({one}) => ({
	ocrWorkUnit: one(ocrWorkUnit, {
		fields: [executionAttempt.workUnitId],
		references: [ocrWorkUnit.id]
	}),
}));

export const ocrWorkUnitRelations = relations(ocrWorkUnit, ({one, many}) => ({
	executionAttempts: many(executionAttempt),
	jobExecution: one(jobExecution, {
		fields: [ocrWorkUnit.executionId],
		references: [jobExecution.id]
	}),
	ocrJob: one(ocrJob, {
		fields: [ocrWorkUnit.jobId],
		references: [ocrJob.id]
	}),
}));

export const folderMembersRelations = relations(folderMembers, ({one}) => ({
	folder: one(folders, {
		fields: [folderMembers.folderId],
		references: [folders.id]
	}),
	user: one(users, {
		fields: [folderMembers.userId],
		references: [users.id]
	}),
}));

export const mediaHandlerJobsRelations = relations(mediaHandlerJobs, ({one}) => ({
	manualMetadatum: one(manualMetadata, {
		fields: [mediaHandlerJobs.manualMetadataId],
		references: [manualMetadata.id]
	}),
}));

export const multiFactorAuditLogsRelations = relations(multiFactorAuditLogs, ({one}) => ({
	user_performedById: one(users, {
		fields: [multiFactorAuditLogs.performedById],
		references: [users.id],
		relationName: "multiFactorAuditLogs_performedById_users_id"
	}),
	user_userId: one(users, {
		fields: [multiFactorAuditLogs.userId],
		references: [users.id],
		relationName: "multiFactorAuditLogs_userId_users_id"
	}),
}));

export const mediaFilesRelations = relations(mediaFiles, ({one, many}) => ({
	folder: one(folders, {
		fields: [mediaFiles.folderId],
		references: [folders.id]
	}),
	user: one(users, {
		fields: [mediaFiles.uploadedById],
		references: [users.id]
	}),
	manualMetadata: many(manualMetadata),
}));

export const notificationPreferencesRelations = relations(notificationPreferences, ({one}) => ({
	user: one(users, {
		fields: [notificationPreferences.userId],
		references: [users.id]
	}),
}));

export const organizationAiQuotasRelations = relations(organizationAiQuotas, ({one}) => ({
	organization: one(organizations, {
		fields: [organizationAiQuotas.organizationId],
		references: [organizations.id]
	}),
	aiModel: one(aiModels, {
		fields: [organizationAiQuotas.aiModelId],
		references: [aiModels.id]
	}),
	user: one(users, {
		fields: [organizationAiQuotas.allocatedById],
		references: [users.id]
	}),
}));

export const multiFactorEmailOtpsRelations = relations(multiFactorEmailOtps, ({one}) => ({
	user: one(users, {
		fields: [multiFactorEmailOtps.userId],
		references: [users.id]
	}),
}));

export const postCommentsRelations = relations(postComments, ({one}) => ({
	post: one(posts, {
		fields: [postComments.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [postComments.userId],
		references: [users.id]
	}),
}));

export const postsRelations = relations(posts, ({one, many}) => ({
	postComments: many(postComments),
	user: one(users, {
		fields: [posts.createdById],
		references: [users.id]
	}),
	folder: one(folders, {
		fields: [posts.folderId],
		references: [folders.id]
	}),
	post: one(posts, {
		fields: [posts.parentPostId],
		references: [posts.id],
		relationName: "posts_parentPostId_posts_id"
	}),
	posts: many(posts, {
		relationName: "posts_parentPostId_posts_id"
	}),
	postLikes: many(postLikes),
	postsManualMetadata: many(postsManualMetadata),
	postBroadshares: many(postBroadshares),
	recordsManagerPostapprovalconfigurations: many(recordsManagerPostapprovalconfiguration),
}));

export const organizationStorageRelations = relations(organizationStorage, ({one}) => ({
	organization: one(organizations, {
		fields: [organizationStorage.organizationId],
		references: [organizations.id]
	}),
}));

export const postLikesRelations = relations(postLikes, ({one}) => ({
	post: one(posts, {
		fields: [postLikes.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [postLikes.userId],
		references: [users.id]
	}),
}));

export const postsManualMetadataRelations = relations(postsManualMetadata, ({one}) => ({
	manualMetadatum: one(manualMetadata, {
		fields: [postsManualMetadata.manualmetadataId],
		references: [manualMetadata.id]
	}),
	post: one(posts, {
		fields: [postsManualMetadata.postId],
		references: [posts.id]
	}),
}));

export const multiFactorMethodsRelations = relations(multiFactorMethods, ({one}) => ({
	user: one(users, {
		fields: [multiFactorMethods.userId],
		references: [users.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user_actorId: one(users, {
		fields: [notifications.actorId],
		references: [users.id],
		relationName: "notifications_actorId_users_id"
	}),
	organization: one(organizations, {
		fields: [notifications.organizationId],
		references: [organizations.id]
	}),
	user_recipientId: one(users, {
		fields: [notifications.recipientId],
		references: [users.id],
		relationName: "notifications_recipientId_users_id"
	}),
}));

export const postBroadsharesRelations = relations(postBroadshares, ({one}) => ({
	post: one(posts, {
		fields: [postBroadshares.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [postBroadshares.sharedById],
		references: [users.id]
	}),
}));

export const recordsManagerPostapprovalconfigurationRelations = relations(recordsManagerPostapprovalconfiguration, ({one}) => ({
	post: one(posts, {
		fields: [recordsManagerPostapprovalconfiguration.postId],
		references: [posts.id]
	}),
}));

export const reservedDomainsRelations = relations(reservedDomains, ({one}) => ({
	organization: one(organizations, {
		fields: [reservedDomains.organizationId],
		references: [organizations.id]
	}),
}));

export const smtpConfigurationsRelations = relations(smtpConfigurations, ({one}) => ({
	organization: one(organizations, {
		fields: [smtpConfigurations.organizationId],
		references: [organizations.id]
	}),
}));

export const spaceMembersRelations = relations(spaceMembers, ({one}) => ({
	space: one(spaces, {
		fields: [spaceMembers.spaceId],
		references: [spaces.id]
	}),
	user: one(users, {
		fields: [spaceMembers.userId],
		references: [users.id]
	}),
}));

export const storageLedgerRelations = relations(storageLedger, ({one}) => ({
	organization: one(organizations, {
		fields: [storageLedger.organizationId],
		references: [organizations.id]
	}),
	user: one(users, {
		fields: [storageLedger.userId],
		references: [users.id]
	}),
}));

export const quotaAuditLogsRelations = relations(quotaAuditLogs, ({one}) => ({
	aiModel: one(aiModels, {
		fields: [quotaAuditLogs.aiModelId],
		references: [aiModels.id]
	}),
	user: one(users, {
		fields: [quotaAuditLogs.performedById],
		references: [users.id]
	}),
}));

export const sttAttemptRelations = relations(sttAttempt, ({one}) => ({
	sttWorkUnit: one(sttWorkUnit, {
		fields: [sttAttempt.workUnitId],
		references: [sttWorkUnit.id]
	}),
}));

export const sttWorkUnitRelations = relations(sttWorkUnit, ({one, many}) => ({
	sttAttempts: many(sttAttempt),
	sttExecution: one(sttExecution, {
		fields: [sttWorkUnit.executionId],
		references: [sttExecution.id]
	}),
	sttJob: one(sttJob, {
		fields: [sttWorkUnit.jobId],
		references: [sttJob.id]
	}),
}));

export const sttJobRelations = relations(sttJob, ({one, many}) => ({
	manualMetadatum: one(manualMetadata, {
		fields: [sttJob.manualMetadataId],
		references: [manualMetadata.id]
	}),
	sttWorkUnits: many(sttWorkUnit),
	sttExecutions: many(sttExecution),
}));

export const savedFiltersRelations = relations(savedFilters, ({one}) => ({
	user: one(users, {
		fields: [savedFilters.createdById],
		references: [users.id]
	}),
}));

export const tokenBlacklistOutstandingtokenRelations = relations(tokenBlacklistOutstandingtoken, ({one, many}) => ({
	user: one(users, {
		fields: [tokenBlacklistOutstandingtoken.userId],
		references: [users.id]
	}),
	tokenBlacklistBlacklistedtokens: many(tokenBlacklistBlacklistedtoken),
}));

export const sttExecutionRelations = relations(sttExecution, ({one, many}) => ({
	sttWorkUnits: many(sttWorkUnit),
	sttJob: one(sttJob, {
		fields: [sttExecution.jobId],
		references: [sttJob.id]
	}),
}));

export const userAiQuotasRelations = relations(userAiQuotas, ({one}) => ({
	aiModel: one(aiModels, {
		fields: [userAiQuotas.aiModelId],
		references: [aiModels.id]
	}),
	user_allocatedById: one(users, {
		fields: [userAiQuotas.allocatedById],
		references: [users.id],
		relationName: "userAiQuotas_allocatedById_users_id"
	}),
	user_userId: one(users, {
		fields: [userAiQuotas.userId],
		references: [users.id],
		relationName: "userAiQuotas_userId_users_id"
	}),
}));

export const userStorageRelations = relations(userStorage, ({one}) => ({
	user: one(users, {
		fields: [userStorage.userId],
		references: [users.id]
	}),
}));

export const usersGroupsRelations = relations(usersGroups, ({one}) => ({
	authGroup: one(authGroup, {
		fields: [usersGroups.groupId],
		references: [authGroup.id]
	}),
	user: one(users, {
		fields: [usersGroups.userId],
		references: [users.id]
	}),
}));

export const authGroupRelations = relations(authGroup, ({many}) => ({
	usersGroups: many(usersGroups),
	authGroupPermissions: many(authGroupPermissions),
}));

export const usersUserPermissionsRelations = relations(usersUserPermissions, ({one}) => ({
	authPermission: one(authPermission, {
		fields: [usersUserPermissions.permissionId],
		references: [authPermission.id]
	}),
	user: one(users, {
		fields: [usersUserPermissions.userId],
		references: [users.id]
	}),
}));

export const gmailConnectorsRelations = relations(gmailConnectors, ({one, many}) => ({
	manualMetadata: many(manualMetadata),
	user: one(users, {
		fields: [gmailConnectors.connectedById],
		references: [users.id]
	}),
	folder: one(folders, {
		fields: [gmailConnectors.folderId],
		references: [folders.id]
	}),
}));

export const authGroupPermissionsRelations = relations(authGroupPermissions, ({one}) => ({
	authPermission: one(authPermission, {
		fields: [authGroupPermissions.permissionId],
		references: [authPermission.id]
	}),
	authGroup: one(authGroup, {
		fields: [authGroupPermissions.groupId],
		references: [authGroup.id]
	}),
}));

export const tokenBlacklistBlacklistedtokenRelations = relations(tokenBlacklistBlacklistedtoken, ({one}) => ({
	tokenBlacklistOutstandingtoken: one(tokenBlacklistOutstandingtoken, {
		fields: [tokenBlacklistBlacklistedtoken.tokenId],
		references: [tokenBlacklistOutstandingtoken.id]
	}),
}));

export const aiAssistantConversationmessagev2AttachmentsRelations = relations(aiAssistantConversationmessagev2Attachments, ({one}) => ({
	aiAssistantConversationmessagev2: one(aiAssistantConversationmessagev2, {
		fields: [aiAssistantConversationmessagev2Attachments.conversationmessagev2Id],
		references: [aiAssistantConversationmessagev2.id]
	}),
	aiAssistantV2Messageattachmentv2: one(aiAssistantV2Messageattachmentv2, {
		fields: [aiAssistantConversationmessagev2Attachments.messageattachmentv2Id],
		references: [aiAssistantV2Messageattachmentv2.id]
	}),
}));