import {
  pgTable,
  index,
  foreignKey,
  unique,
  bigint,
  uuid,
  timestamp,
  varchar,
  jsonb,
  boolean,
  text,
  inet,
  check,
  smallint,
  vector,
  integer,
  doublePrecision,
  numeric,
  uniqueIndex,
  time,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const aiAssistantConversationv2 = pgTable(
  "ai_assistant_conversationv2",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_assistant_conversationv2_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    conversationUuid: uuid("conversation_uuid").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => {
    return {
      aiAssistanUserIdFd7Da6Idx: index("ai_assistan_user_id_fd7da6_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.createdAt.desc().nullsFirst().op("timestamptz_ops"),
      ),
      folderId87323610: index(
        "ai_assistant_conversationv2_folder_id_87323610",
      ).using("btree", table.folderId.asc().nullsLast().op("int8_ops")),
      userId508766A9: index(
        "ai_assistant_conversationv2_user_id_508766a9",
      ).using("btree", table.userId.asc().nullsLast().op("int8_ops")),
      aiAssistantConversationv2FolderId87323610FkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "ai_assistant_conversationv2_folder_id_87323610_fk_folders_id",
      }),
      aiAssistantConversationv2UserId508766A9FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "ai_assistant_conversationv2_user_id_508766a9_fk_users_id",
      }),
      aiAssistantConversationv2ConversationUuidKey: unique(
        "ai_assistant_conversationv2_conversation_uuid_key",
      ).on(table.conversationUuid),
    };
  },
);

export const aiAssistantConversationmessagev2 = pgTable(
  "ai_assistant_conversationmessagev2",
  {
    id: varchar({ length: 255 }).primaryKey().notNull(),
    role: varchar({ length: 16 }).notNull(),
    parts: jsonb().notNull(),
    usage: jsonb(),
    finishReason: varchar("finish_reason", { length: 64 }),
    complete: boolean().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    conversationId: bigint("conversation_id", { mode: "number" }).notNull(),
    runId: varchar("run_id", { length: 255 }),
  },
  (table) => {
    return {
      aiAssistanConvers027B8AIdx: index("ai_assistan_convers_027b8a_idx").using(
        "btree",
        table.conversationId.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      aiAssistanRunIdEbed54Idx: index("ai_assistan_run_id_ebed54_idx").using(
        "btree",
        table.runId.asc().nullsLast().op("text_ops"),
      ),
      conversationId285Fe0A4: index(
        "ai_assistant_conversationmessagev2_conversation_id_285fe0a4",
      ).using("btree", table.conversationId.asc().nullsLast().op("int8_ops")),
      idB410B239Like: index(
        "ai_assistant_conversationmessagev2_id_b410b239_like",
      ).using("btree", table.id.asc().nullsLast().op("varchar_pattern_ops")),
      runId748A2F55: index(
        "ai_assistant_conversationmessagev2_run_id_748a2f55",
      ).using("btree", table.runId.asc().nullsLast().op("text_ops")),
      runId748A2F55Like: index(
        "ai_assistant_conversationmessagev2_run_id_748a2f55_like",
      ).using("btree", table.runId.asc().nullsLast().op("varchar_pattern_ops")),
      aiAssistantConversConversationId285Fe0A4FkAiAssist: foreignKey({
        columns: [table.conversationId],
        foreignColumns: [aiAssistantConversationv2.id],
        name: "ai_assistant_convers_conversation_id_285fe0a4_fk_ai_assist",
      }),
    };
  },
);

export const aiAssistantMessage = pgTable(
  "ai_assistant_message",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_assistant_message_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    role: varchar({ length: 32 }).notNull(),
    traceData: jsonb("trace_data"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    conversationId: bigint("conversation_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    llmId: bigint("llm_id", { mode: "number" }),
    parts: jsonb(),
  },
  (table) => {
    return {
      aiAssistanConvers62C9D6Idx: index("ai_assistan_convers_62c9d6_idx").using(
        "btree",
        table.conversationId.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.desc().nullsFirst().op("int8_ops"),
      ),
      conversationId62Fa3B00: index(
        "ai_assistant_message_conversation_id_62fa3b00",
      ).using("btree", table.conversationId.asc().nullsLast().op("int8_ops")),
      llmId612Dc0Fd: index("ai_assistant_message_llm_id_612dc0fd").using(
        "btree",
        table.llmId.asc().nullsLast().op("int8_ops"),
      ),
      aiAssistantMessageConversationId62Fa3B00FkAiAssist: foreignKey({
        columns: [table.conversationId],
        foreignColumns: [aiAssistantConversation.id],
        name: "ai_assistant_message_conversation_id_62fa3b00_fk_ai_assist",
      }),
      aiAssistantMessageLlmId612Dc0FdFkAiModelsId: foreignKey({
        columns: [table.llmId],
        foreignColumns: [aiModels.id],
        name: "ai_assistant_message_llm_id_612dc0fd_fk_ai_models_id",
      }),
    };
  },
);

export const aiAssistantConversation = pgTable(
  "ai_assistant_conversation",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_assistant_conversation_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    title: varchar({ length: 255 }).notNull(),
    summary: text(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    spaceId: bigint("space_id", { mode: "number" }),
    conversationType: varchar("conversation_type", { length: 32 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    taskId: bigint("task_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    apiKeyId: bigint("api_key_id", { mode: "number" }),
    gatewayClientIp: inet("gateway_client_ip"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    aiTaskId: bigint("ai_task_id", { mode: "number" }),
  },
  (table) => {
    return {
      aiTaskId042D8D8E: index(
        "ai_assistant_conversation_ai_task_id_042d8d8e",
      ).using("btree", table.aiTaskId.asc().nullsLast().op("int8_ops")),
      apiKeyId2A704A21: index(
        "ai_assistant_conversation_api_key_id_2a704a21",
      ).using("btree", table.apiKeyId.asc().nullsLast().op("int8_ops")),
      folderId77Db6727: index(
        "ai_assistant_conversation_folder_id_77db6727",
      ).using("btree", table.folderId.asc().nullsLast().op("int8_ops")),
      spaceIdD2F47D3F: index(
        "ai_assistant_conversation_space_id_d2f47d3f",
      ).using("btree", table.spaceId.asc().nullsLast().op("int8_ops")),
      taskIdFea0Bb40: index("ai_assistant_conversation_task_id_fea0bb40").using(
        "btree",
        table.taskId.asc().nullsLast().op("int8_ops"),
      ),
      userId5Ee16771: index("ai_assistant_conversation_user_id_5ee16771").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      aiAssistantConversationAiTaskId042D8D8EFkAiTasksId: foreignKey({
        columns: [table.aiTaskId],
        foreignColumns: [aiTasks.id],
        name: "ai_assistant_conversation_ai_task_id_042d8d8e_fk_ai_tasks_id",
      }),
      aiAssistantConversationApiKeyId2A704A21FkApiKeysId: foreignKey({
        columns: [table.apiKeyId],
        foreignColumns: [apiKeys.id],
        name: "ai_assistant_conversation_api_key_id_2a704a21_fk_api_keys_id",
      }),
      aiAssistantConversationFolderId77Db6727FkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "ai_assistant_conversation_folder_id_77db6727_fk_folders_id",
      }),
      aiAssistantConversationSpaceIdD2F47D3FFkSpacesId: foreignKey({
        columns: [table.spaceId],
        foreignColumns: [spaces.id],
        name: "ai_assistant_conversation_space_id_d2f47d3f_fk_spaces_id",
      }),
      aiAssistantConversationTaskIdFea0Bb40FkTaskId: foreignKey({
        columns: [table.taskId],
        foreignColumns: [task.id],
        name: "ai_assistant_conversation_task_id_fea0bb40_fk_task_id",
      }),
      aiAssistantConversationUserId5Ee16771FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "ai_assistant_conversation_user_id_5ee16771_fk_users_id",
      }),
    };
  },
);

export const aiAssistantMessageattachment = pgTable(
  "ai_assistant_messageattachment",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_assistant_messageattachment_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    file: varchar({ length: 100 }).notNull(),
    kind: varchar({ length: 16 }).notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
    mimeType: varchar("mime_type", { length: 127 }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    uploadedById: bigint("uploaded_by_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    customPromptId: bigint("custom_prompt_id", { mode: "number" }),
  },
  (table) => {
    return {
      aiAssistanUploade7F6C09Idx: index("ai_assistan_uploade_7f6c09_idx").using(
        "btree",
        table.uploadedById.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      customPromptId0Abeace8: index(
        "ai_assistant_messageattachment_custom_prompt_id_0abeace8",
      ).using("btree", table.customPromptId.asc().nullsLast().op("int8_ops")),
      uploadedById925D1C30: index(
        "ai_assistant_messageattachment_uploaded_by_id_925d1c30",
      ).using("btree", table.uploadedById.asc().nullsLast().op("int8_ops")),
      aiAssistantMessageCustomPromptId0Abeace8FkCustomPr: foreignKey({
        columns: [table.customPromptId],
        foreignColumns: [customPrompts.id],
        name: "ai_assistant_message_custom_prompt_id_0abeace8_fk_custom_pr",
      }),
      aiAssistantMessageUploadedById925D1C30FkUsersId: foreignKey({
        columns: [table.uploadedById],
        foreignColumns: [users.id],
        name: "ai_assistant_message_uploaded_by_id_925d1c30_fk_users_id",
      }),
      aiAssistantMessageattachmentSizeBytesCheck: check(
        "ai_assistant_messageattachment_size_bytes_check",
        sql`size_bytes >= 0`,
      ),
    };
  },
);

export const aiAssistantMessageAttachments = pgTable(
  "ai_assistant_message_attachments",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_assistant_message_attachments_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    messageId: bigint("message_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    messageattachmentId: bigint("messageattachment_id", {
      mode: "number",
    }).notNull(),
  },
  (table) => {
    return {
      messageIdA96F2Cea: index(
        "ai_assistant_message_attachments_message_id_a96f2cea",
      ).using("btree", table.messageId.asc().nullsLast().op("int8_ops")),
      messageattachmentId36F2956F: index(
        "ai_assistant_message_attachments_messageattachment_id_36f2956f",
      ).using(
        "btree",
        table.messageattachmentId.asc().nullsLast().op("int8_ops"),
      ),
      aiAssistantMessageMessageIdA96F2CeaFkAiAssist: foreignKey({
        columns: [table.messageId],
        foreignColumns: [aiAssistantMessage.id],
        name: "ai_assistant_message_message_id_a96f2cea_fk_ai_assist",
      }),
      aiAssistantMessageMessageattachmentId36F2956FFkAiAssist: foreignKey({
        columns: [table.messageattachmentId],
        foreignColumns: [aiAssistantMessageattachment.id],
        name: "ai_assistant_message_messageattachment_id_36f2956f_fk_ai_assist",
      }),
      aiAssistantMessageAttMessageIdMessageattach23981Bf1Uniq: unique(
        "ai_assistant_message_att_message_id_messageattach_23981bf1_uniq",
      ).on(table.messageId, table.messageattachmentId),
    };
  },
);

export const aiAssistantV2Messageattachmentv2 = pgTable(
  "ai_assistant_v2_messageattachmentv2",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_assistant_v2_messageattachment_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    file: varchar({ length: 100 }).notNull(),
    kind: varchar({ length: 16 }).notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
    mimeType: varchar("mime_type", { length: 127 }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    uploadedById: bigint("uploaded_by_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      aiAssistanUploadeEc2101Idx: index("ai_assistan_uploade_ec2101_idx").using(
        "btree",
        table.uploadedById.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      aiAssistantV2MessageattachmentUploadedByIdF467Ec4E: index(
        "ai_assistant_v2_messageattachment_uploaded_by_id_f467ec4e",
      ).using("btree", table.uploadedById.asc().nullsLast().op("int8_ops")),
      aiAssistantV2MessUploadedByIdF467Ec4EFkUsersId: foreignKey({
        columns: [table.uploadedById],
        foreignColumns: [users.id],
        name: "ai_assistant_v2_mess_uploaded_by_id_f467ec4e_fk_users_id",
      }),
      aiAssistantV2MessageattachmentSizeBytesCheck: check(
        "ai_assistant_v2_messageattachment_size_bytes_check",
        sql`size_bytes >= 0`,
      ),
    };
  },
);

export const aiModelHealthAuditLogs = pgTable(
  "ai_model_health_audit_logs",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_model_health_audit_logs_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    previousStatus: varchar("previous_status", { length: 20 }).notNull(),
    newStatus: varchar("new_status", { length: 20 }).notNull(),
    reason: text().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    actorId: bigint("actor_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    aiModelId: bigint("ai_model_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      aiModelHeAiModeA1B2C7Idx: index("ai_model_he_ai_mode_a1b2c7_idx").using(
        "btree",
        table.aiModelId.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      aiModelHeCreated6Ebcd2Idx: index("ai_model_he_created_6ebcd2_idx").using(
        "btree",
        table.createdAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      actorId76216F2C: index(
        "ai_model_health_audit_logs_actor_id_76216f2c",
      ).using("btree", table.actorId.asc().nullsLast().op("int8_ops")),
      aiModelId70F0Fed5: index(
        "ai_model_health_audit_logs_ai_model_id_70f0fed5",
      ).using("btree", table.aiModelId.asc().nullsLast().op("int8_ops")),
      aiModelHealthAuditLogsActorId76216F2CFkUsersId: foreignKey({
        columns: [table.actorId],
        foreignColumns: [users.id],
        name: "ai_model_health_audit_logs_actor_id_76216f2c_fk_users_id",
      }),
      aiModelHealthAuditLogsAiModelId70F0Fed5FkAiModelsId: foreignKey({
        columns: [table.aiModelId],
        foreignColumns: [aiModels.id],
        name: "ai_model_health_audit_logs_ai_model_id_70f0fed5_fk_ai_models_id",
      }),
    };
  },
);

export const aiJobsJob = pgTable(
  "ai_jobs_job",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_jobs_job_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    sourceType: varchar("source_type", { length: 32 }).notNull(),
    status: varchar({ length: 16 }).notNull(),
    progressPercent: smallint("progress_percent").notNull(),
    stage: varchar({ length: 16 }),
    jobStartedAt: timestamp("job_started_at", {
      withTimezone: true,
      mode: "string",
    }),
    jobFinishedAt: timestamp("job_finished_at", {
      withTimezone: true,
      mode: "string",
    }),
    stageStartedAt: timestamp("stage_started_at", {
      withTimezone: true,
      mode: "string",
    }),
    stageFinishedAt: timestamp("stage_finished_at", {
      withTimezone: true,
      mode: "string",
    }),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    manualMetadataId: bigint("manual_metadata_id", {
      mode: "number",
    }).notNull(),
  },
  (table) => {
    return {
      manual5Ac090Idx: index("ai_jobs_job_manual__5ac090_idx").using(
        "btree",
        table.manualMetadataId.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      manualMetadataId2B55A581: index(
        "ai_jobs_job_manual_metadata_id_2b55a581",
      ).using("btree", table.manualMetadataId.asc().nullsLast().op("int8_ops")),
      sourceType4E8648F0: index("ai_jobs_job_source_type_4e8648f0").using(
        "btree",
        table.sourceType.asc().nullsLast().op("text_ops"),
      ),
      sourceType4E8648F0Like: index(
        "ai_jobs_job_source_type_4e8648f0_like",
      ).using(
        "btree",
        table.sourceType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      status32C838Idx: index("ai_jobs_job_status_32c838_idx").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      status4600Bbe0: index("ai_jobs_job_status_4600bbe0").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      status4600Bbe0Like: index("ai_jobs_job_status_4600bbe0_like").using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      aiJobsJobManualMetadataId2B55A581FkManualMetadataId: foreignKey({
        columns: [table.manualMetadataId],
        foreignColumns: [manualMetadata.id],
        name: "ai_jobs_job_manual_metadata_id_2b55a581_fk_manual_metadata_id",
      }),
      aiJobsJobProgressPercentCheck: check(
        "ai_jobs_job_progress_percent_check",
        sql`progress_percent >= 0`,
      ),
    };
  },
);

export const aiJobsChunk = pgTable(
  "ai_jobs_chunk",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_jobs_chunk_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    sourceType: varchar("source_type", { length: 16 }).notNull(),
    elementId: varchar("element_id", { length: 64 }).notNull(),
    elementType: varchar("element_type", { length: 64 }).notNull(),
    text: text().notNull(),
    textAsHtml: text("text_as_html"),
    summary: text(),
    embedding: vector({ dimensions: 1024 }),
    embeddingModel: varchar("embedding_model", { length: 128 }).notNull(),
    dimensions: integer(),
    startTime: doublePrecision("start_time"),
    endTime: doublePrecision("end_time"),
    parentElementId: varchar("parent_element_id", { length: 64 }),
    position: integer().notNull(),
    isRetrievable: boolean("is_retrievable").notNull(),
    pageNumber: integer("page_number"),
    metadata: jsonb().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    jobId: bigint("job_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      aiJobsChuJobIdAf3Dd9Idx: index("ai_jobs_chu_job_id_af3dd9_idx").using(
        "btree",
        table.jobId.asc().nullsLast().op("int4_ops"),
        table.position.asc().nullsLast().op("int8_ops"),
      ),
      aiJobsChuSource929172Idx: index("ai_jobs_chu_source__929172_idx").using(
        "btree",
        table.sourceType.asc().nullsLast().op("text_ops"),
      ),
      elementType6431Cff5: index("ai_jobs_chunk_element_type_6431cff5").using(
        "btree",
        table.elementType.asc().nullsLast().op("text_ops"),
      ),
      elementType6431Cff5Like: index(
        "ai_jobs_chunk_element_type_6431cff5_like",
      ).using(
        "btree",
        table.elementType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      embeddingDiskannIdx: index("ai_jobs_chunk_embedding_diskann_idx").using(
        "diskann",
        table.embedding.asc().nullsLast().op("vector_cosine_ops"),
      ),
      jobId3604B4Ec: index("ai_jobs_chunk_job_id_3604b4ec").using(
        "btree",
        table.jobId.asc().nullsLast().op("int8_ops"),
      ),
      organizationId84Fb2C6E: index(
        "ai_jobs_chunk_organization_id_84fb2c6e",
      ).using("btree", table.organizationId.asc().nullsLast().op("int8_ops")),
      parentElementIdE6Fda68D: index(
        "ai_jobs_chunk_parent_element_id_e6fda68d",
      ).using("btree", table.parentElementId.asc().nullsLast().op("text_ops")),
      parentElementIdE6Fda68DLike: index(
        "ai_jobs_chunk_parent_element_id_e6fda68d_like",
      ).using(
        "btree",
        table.parentElementId.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      sourceType748Ffb15: index("ai_jobs_chunk_source_type_748ffb15").using(
        "btree",
        table.sourceType.asc().nullsLast().op("text_ops"),
      ),
      sourceType748Ffb15Like: index(
        "ai_jobs_chunk_source_type_748ffb15_like",
      ).using(
        "btree",
        table.sourceType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      idxChunkBm25: index("idx_chunk_bm25")
        .using(
          "bm25",
          table.id.asc().nullsLast().op("anyelement_bm25_ops"),
          table.text.asc().nullsLast().op("anyelement_bm25_ops"),
        )
        .with({ key_field: "id" }),
      aiJobsChunkJobId3604B4EcFkAiJobsJobId: foreignKey({
        columns: [table.jobId],
        foreignColumns: [aiJobsJob.id],
        name: "ai_jobs_chunk_job_id_3604b4ec_fk_ai_jobs_job_id",
      }),
      uqChunkJobElement: unique("uq_chunk_job_element").on(
        table.elementId,
        table.jobId,
      ),
      uqChunkJobPosition: unique("uq_chunk_job_position").on(
        table.position,
        table.jobId,
      ),
      aiJobsChunkDimensionsCheck: check(
        "ai_jobs_chunk_dimensions_check",
        sql`dimensions >= 0`,
      ),
      aiJobsChunkPageNumberCheck: check(
        "ai_jobs_chunk_page_number_check",
        sql`page_number >= 0`,
      ),
      aiJobsChunkPositionCheck: check(
        "ai_jobs_chunk_position_check",
        sql`"position" >= 0`,
      ),
    };
  },
);

export const actionTokens = pgTable(
  "action_tokens",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "action_tokens_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    tokenType: varchar("token_type", { length: 50 }).notNull(),
    token: varchar({ length: 255 }).notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    requiredActionId: bigint("required_action_id", { mode: "number" }),
  },
  (table) => {
    return {
      actionTokeExpiresA6E12AIdx: index("action_toke_expires_a6e12a_idx").using(
        "btree",
        table.expiresAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      actionTokeUserId807B66Idx: index("action_toke_user_id_807b66_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.tokenType.asc().nullsLast().op("int8_ops"),
      ),
      requiredActionIdD11Dbf0A: index(
        "action_tokens_required_action_id_d11dbf0a",
      ).using("btree", table.requiredActionId.asc().nullsLast().op("int8_ops")),
      tokenDfcccafbLike: index("action_tokens_token_dfcccafb_like").using(
        "btree",
        table.token.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      userId37Cc3C50: index("action_tokens_user_id_37cc3c50").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      actionTokensRequiredActionIdD11Dbf0AFkRequired: foreignKey({
        columns: [table.requiredActionId],
        foreignColumns: [requiredActions.id],
        name: "action_tokens_required_action_id_d11dbf0a_fk_required_",
      }),
      actionTokensUserId37Cc3C50FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "action_tokens_user_id_37cc3c50_fk_users_id",
      }),
      actionTokensTokenKey: unique("action_tokens_token_key").on(table.token),
    };
  },
);

export const aiModelTokenUsage = pgTable(
  "ai_model_token_usage",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_model_token_usage_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    promptTokens: bigint("prompt_tokens", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    completionTokens: bigint("completion_tokens", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    totalTokens: bigint("total_tokens", { mode: "number" }).notNull(),
    conversationId: varchar("conversation_id", { length: 255 }),
    requestId: varchar("request_id", { length: 255 }),
    metadata: jsonb(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    aiModelId: bigint("ai_model_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    spaceId: bigint("space_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    cachedTokens: bigint("cached_tokens", { mode: "number" }).notNull(),
    cost: numeric({ precision: 14, scale: 6 }),
    executionId: varchar("execution_id", { length: 255 }),
    executionType: varchar("execution_type", { length: 50 }),
    provider: varchar({ length: 100 }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    reasoningTokens: bigint("reasoning_tokens", { mode: "number" }).notNull(),
    requestCount: integer("request_count").notNull(),
  },
  (table) => {
    return {
      aiModelToAiMode76Cbd3Idx: index("ai_model_to_ai_mode_76cbd3_idx").using(
        "btree",
        table.aiModelId.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      aiModelToCreatedBa6Be8Idx: index("ai_model_to_created_ba6be8_idx").using(
        "btree",
        table.createdAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      aiModelToExecuti74B314Idx: index("ai_model_to_executi_74b314_idx").using(
        "btree",
        table.executionType.asc().nullsLast().op("text_ops"),
        table.createdAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      aiModelToOrganiz18Dae2Idx: index("ai_model_to_organiz_18dae2_idx").using(
        "btree",
        table.organizationId.asc().nullsLast().op("int8_ops"),
        table.aiModelId.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      aiModelToSpaceI4614F0Idx: index("ai_model_to_space_i_4614f0_idx").using(
        "btree",
        table.spaceId.asc().nullsLast().op("timestamptz_ops"),
        table.aiModelId.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      aiModelToUserIdFd636CIdx: index("ai_model_to_user_id_fd636c_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.aiModelId.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      aiModelId6Cfb02Ff: index(
        "ai_model_token_usage_ai_model_id_6cfb02ff",
      ).using("btree", table.aiModelId.asc().nullsLast().op("int8_ops")),
      executionId5B6A18Dc: index(
        "ai_model_token_usage_execution_id_5b6a18dc",
      ).using("btree", table.executionId.asc().nullsLast().op("text_ops")),
      executionId5B6A18DcLike: index(
        "ai_model_token_usage_execution_id_5b6a18dc_like",
      ).using(
        "btree",
        table.executionId.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      executionType0B7Aee4B: index(
        "ai_model_token_usage_execution_type_0b7aee4b",
      ).using("btree", table.executionType.asc().nullsLast().op("text_ops")),
      executionType0B7Aee4BLike: index(
        "ai_model_token_usage_execution_type_0b7aee4b_like",
      ).using(
        "btree",
        table.executionType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      organizationIdAbf94F97: index(
        "ai_model_token_usage_organization_id_abf94f97",
      ).using("btree", table.organizationId.asc().nullsLast().op("int8_ops")),
      requestId4Df460A8Like: index(
        "ai_model_token_usage_request_id_4df460a8_like",
      ).using(
        "btree",
        table.requestId.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      spaceIdB2Bf96C5: index("ai_model_token_usage_space_id_b2bf96c5").using(
        "btree",
        table.spaceId.asc().nullsLast().op("int8_ops"),
      ),
      userIdBfa9Cae2: index("ai_model_token_usage_user_id_bfa9cae2").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      aiModelTokenUsageAiModelId6Cfb02FfFkAiModelsId: foreignKey({
        columns: [table.aiModelId],
        foreignColumns: [aiModels.id],
        name: "ai_model_token_usage_ai_model_id_6cfb02ff_fk_ai_models_id",
      }),
      aiModelTokenUsageOrganizationIdAbf94F97FkOrganizat: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "ai_model_token_usage_organization_id_abf94f97_fk_organizat",
      }),
      aiModelTokenUsageSpaceIdB2Bf96C5FkSpacesId: foreignKey({
        columns: [table.spaceId],
        foreignColumns: [spaces.id],
        name: "ai_model_token_usage_space_id_b2bf96c5_fk_spaces_id",
      }),
      aiModelTokenUsageUserIdBfa9Cae2FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "ai_model_token_usage_user_id_bfa9cae2_fk_users_id",
      }),
      aiModelTokenUsageRequestIdKey: unique(
        "ai_model_token_usage_request_id_key",
      ).on(table.requestId),
      aiModelTokenUsageCachedTokensCheck: check(
        "ai_model_token_usage_cached_tokens_check",
        sql`cached_tokens >= 0`,
      ),
      aiModelTokenUsageCompletionTokensCheck: check(
        "ai_model_token_usage_completion_tokens_check",
        sql`completion_tokens >= 0`,
      ),
      aiModelTokenUsagePromptTokensCheck: check(
        "ai_model_token_usage_prompt_tokens_check",
        sql`prompt_tokens >= 0`,
      ),
      aiModelTokenUsageReasoningTokensCheck: check(
        "ai_model_token_usage_reasoning_tokens_check",
        sql`reasoning_tokens >= 0`,
      ),
      aiModelTokenUsageRequestCountCheck: check(
        "ai_model_token_usage_request_count_check",
        sql`request_count >= 0`,
      ),
      aiModelTokenUsageTotalTokensCheck: check(
        "ai_model_token_usage_total_tokens_check",
        sql`total_tokens >= 0`,
      ),
    };
  },
);

export const aiModels = pgTable(
  "ai_models",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_models_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    name: varchar({ length: 255 }).notNull(),
    version: varchar({ length: 50 }),
    modelType: varchar("model_type", { length: 10 }).notNull(),
    isActive: boolean("is_active").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    apiKey: text("api_key"),
    apiStyle: varchar("api_style", { length: 30 }),
    authType: varchar("auth_type", { length: 20 }),
    baseUrl: varchar("base_url", { length: 500 }),
    deploymentMode: varchar("deployment_mode", { length: 10 }),
    isSuspended: boolean("is_suspended").notNull(),
    modelValue: varchar("model_value", { length: 255 }),
    runtimeProvider: varchar("runtime_provider", { length: 30 }),
    consecutiveFailureCount: smallint("consecutive_failure_count").notNull(),
    contextWindow: integer("context_window"),
    cooldownUntil: timestamp("cooldown_until", {
      withTimezone: true,
      mode: "string",
    }),
    healthCheckedAt: timestamp("health_checked_at", {
      withTimezone: true,
      mode: "string",
    }),
    healthStatus: varchar("health_status", { length: 20 }).notNull(),
    isBase: boolean("is_base").notNull(),
    providerCredentials: text("provider_credentials"),
  },
  (table) => {
    return {
      healthSIdx: index("ai_models_health_s_idx").using(
        "btree",
        table.healthStatus.asc().nullsLast().op("text_ops"),
      ),
      isActiB1B072Idx: index("ai_models_is_acti_b1b072_idx").using(
        "btree",
        table.isActive.asc().nullsLast().op("bool_ops"),
      ),
      modelT608C1FIdx: index("ai_models_model_t_608c1f_idx").using(
        "btree",
        table.modelType.asc().nullsLast().op("text_ops"),
      ),
      modelT6A43A2Idx: index("ai_models_model_t_6a43a2_idx").using(
        "btree",
        table.modelType.asc().nullsLast().op("bool_ops"),
        table.isActive.asc().nullsLast().op("bool_ops"),
      ),
      uniqueBaseAiModel: uniqueIndex("unique_base_ai_model")
        .using("btree", table.isBase.asc().nullsLast().op("bool_ops"))
        .where(sql`is_base`),
      aiModelsNameVersion8B8F9363Uniq: unique(
        "ai_models_name_version_8b8f9363_uniq",
      ).on(table.name, table.version),
      aiModelsConsecutiveFailureCountCheck: check(
        "ai_models_consecutive_failure_count_check",
        sql`consecutive_failure_count >= 0`,
      ),
      aiModelsContextWindowCheck: check(
        "ai_models_context_window_check",
        sql`context_window >= 0`,
      ),
    };
  },
);

export const aiTasks = pgTable(
  "ai_tasks",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_tasks_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    name: varchar({ length: 255 }).notNull(),
    prompt: text().notNull(),
    frequency: varchar({ length: 20 }).notNull(),
    status: varchar({ length: 20 }).notNull(),
    runTime: time("run_time").notNull(),
    runDate: date("run_date"),
    weekday: integer(),
    monthDay: integer("month_day"),
    month: integer(),
    nextRunAt: timestamp("next_run_at", { withTimezone: true, mode: "string" }),
    lastRunAt: timestamp("last_run_at", { withTimezone: true, mode: "string" }),
    runCount: integer("run_count").notNull(),
    isDeleted: boolean("is_deleted").notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      folder29B7D5Idx: index("ai_tasks_folder__29b7d5_idx").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
        table.isDeleted.asc().nullsLast().op("int8_ops"),
      ),
      folderId621C6967: index("ai_tasks_folder_id_621c6967").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
      ),
      frequency7209303E: index("ai_tasks_frequency_7209303e").using(
        "btree",
        table.frequency.asc().nullsLast().op("text_ops"),
      ),
      frequency7209303ELike: index("ai_tasks_frequency_7209303e_like").using(
        "btree",
        table.frequency.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      isDeleted90Eb7Cfb: index("ai_tasks_is_deleted_90eb7cfb").using(
        "btree",
        table.isDeleted.asc().nullsLast().op("bool_ops"),
      ),
      nextRunAt246Dcbd4: index("ai_tasks_next_run_at_246dcbd4").using(
        "btree",
        table.nextRunAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      statusE25077Idx: index("ai_tasks_status_e25077_idx").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
        table.nextRunAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      statusE909C4Bb: index("ai_tasks_status_e909c4bb").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      statusE909C4BbLike: index("ai_tasks_status_e909c4bb_like").using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      userIdC70BbfIdx: index("ai_tasks_user_id_c70bbf_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.isDeleted.asc().nullsLast().op("int8_ops"),
        table.status.asc().nullsLast().op("int8_ops"),
      ),
      userIdC7482Aa8: index("ai_tasks_user_id_c7482aa8").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      aiTasksFolderId621C6967FkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "ai_tasks_folder_id_621c6967_fk_folders_id",
      }),
      aiTasksUserIdC7482Aa8FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "ai_tasks_user_id_c7482aa8_fk_users_id",
      }),
      aiTaskMonthDayRange: check(
        "ai_task_month_day_range",
        sql`(month_day IS NULL) OR ((month_day >= 1) AND (month_day <= 31))`,
      ),
      aiTaskMonthRange: check(
        "ai_task_month_range",
        sql`(month IS NULL) OR ((month >= 1) AND (month <= 12))`,
      ),
      aiTaskWeekdayRange: check(
        "ai_task_weekday_range",
        sql`(weekday IS NULL) OR ((weekday >= 1) AND (weekday <= 7))`,
      ),
    };
  },
);

export const aiTaskExecutions = pgTable(
  "ai_task_executions",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_task_executions_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    status: varchar({ length: 20 }).notNull(),
    scheduledAt: timestamp("scheduled_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    startedAt: timestamp("started_at", { withTimezone: true, mode: "string" }),
    finishedAt: timestamp("finished_at", {
      withTimezone: true,
      mode: "string",
    }),
    errorMessage: text("error_message"),
    errorType: varchar("error_type", { length: 100 }),
    executionMetadata: jsonb("execution_metadata").notNull(),
    retryCount: integer("retry_count").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    conversationId: bigint("conversation_id", { mode: "number" }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    taskId: bigint("task_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      aiTaskExeStatusBf2060Idx: index("ai_task_exe_status_bf2060_idx").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
        table.createdAt.asc().nullsLast().op("text_ops"),
      ),
      aiTaskExeTaskIdAf501FIdx: index("ai_task_exe_task_id_af501f_idx").using(
        "btree",
        table.taskId.asc().nullsLast().op("timestamptz_ops"),
        table.scheduledAt.desc().nullsFirst().op("int8_ops"),
      ),
      aiTaskExeTaskIdEf72C2Idx: index("ai_task_exe_task_id_ef72c2_idx").using(
        "btree",
        table.taskId.asc().nullsLast().op("int8_ops"),
        table.status.asc().nullsLast().op("text_ops"),
      ),
      conversationId9C774Dc1: index(
        "ai_task_executions_conversation_id_9c774dc1",
      ).using("btree", table.conversationId.asc().nullsLast().op("int8_ops")),
      errorType403Cb155: index("ai_task_executions_error_type_403cb155").using(
        "btree",
        table.errorType.asc().nullsLast().op("text_ops"),
      ),
      errorType403Cb155Like: index(
        "ai_task_executions_error_type_403cb155_like",
      ).using(
        "btree",
        table.errorType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      scheduledAt2443970E: index(
        "ai_task_executions_scheduled_at_2443970e",
      ).using(
        "btree",
        table.scheduledAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      status498103E2: index("ai_task_executions_status_498103e2").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      status498103E2Like: index(
        "ai_task_executions_status_498103e2_like",
      ).using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      taskId16E19A4B: index("ai_task_executions_task_id_16e19a4b").using(
        "btree",
        table.taskId.asc().nullsLast().op("int8_ops"),
      ),
      aiTaskExecutionsTaskId16E19A4BFkAiTasksId: foreignKey({
        columns: [table.taskId],
        foreignColumns: [aiTasks.id],
        name: "ai_task_executions_task_id_16e19a4b_fk_ai_tasks_id",
      }),
    };
  },
);

export const apiKeyAuditLogs = pgTable(
  "api_key_audit_logs",
  {
    id: uuid().primaryKey().notNull(),
    keyPrefix: varchar("key_prefix", { length: 16 }).notNull(),
    eventType: varchar("event_type", { length: 30 }).notNull(),
    ipAddress: inet("ip_address"),
    origin: varchar({ length: 512 }).notNull(),
    userAgent: text("user_agent").notNull(),
    requestPath: varchar("request_path", { length: 1024 }).notNull(),
    requestMethod: varchar("request_method", { length: 10 }).notNull(),
    success: boolean().notNull(),
    failureReason: varchar("failure_reason", { length: 255 }).notNull(),
    timestamp: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    apiKeyId: bigint("api_key_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    spaceId: bigint("space_id", { mode: "number" }),
  },
  (table) => {
    return {
      apiKeyId9A77E6Aa: index("api_key_audit_logs_api_key_id_9a77e6aa").using(
        "btree",
        table.apiKeyId.asc().nullsLast().op("int8_ops"),
      ),
      eventType18Ca46D6: index("api_key_audit_logs_event_type_18ca46d6").using(
        "btree",
        table.eventType.asc().nullsLast().op("text_ops"),
      ),
      eventType18Ca46D6Like: index(
        "api_key_audit_logs_event_type_18ca46d6_like",
      ).using(
        "btree",
        table.eventType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      organizationIdDf3C0A5B: index(
        "api_key_audit_logs_organization_id_df3c0a5b",
      ).using("btree", table.organizationId.asc().nullsLast().op("int8_ops")),
      spaceId3Ffc4Ddb: index("api_key_audit_logs_space_id_3ffc4ddb").using(
        "btree",
        table.spaceId.asc().nullsLast().op("int8_ops"),
      ),
      success5E6F7378: index("api_key_audit_logs_success_5e6f7378").using(
        "btree",
        table.success.asc().nullsLast().op("bool_ops"),
      ),
      timestampB4Ea28B5: index("api_key_audit_logs_timestamp_b4ea28b5").using(
        "btree",
        table.timestamp.asc().nullsLast().op("timestamptz_ops"),
      ),
      idxAuditEventTime: index("idx_audit_event_time").using(
        "btree",
        table.eventType.asc().nullsLast().op("text_ops"),
        table.timestamp.asc().nullsLast().op("text_ops"),
      ),
      idxAuditIpTime: index("idx_audit_ip_time").using(
        "btree",
        table.ipAddress.asc().nullsLast().op("timestamptz_ops"),
        table.timestamp.asc().nullsLast().op("timestamptz_ops"),
      ),
      idxAuditKeyTime: index("idx_audit_key_time").using(
        "btree",
        table.apiKeyId.asc().nullsLast().op("int8_ops"),
        table.timestamp.asc().nullsLast().op("int8_ops"),
      ),
      idxAuditOrgTime: index("idx_audit_org_time").using(
        "btree",
        table.organizationId.asc().nullsLast().op("int8_ops"),
        table.timestamp.asc().nullsLast().op("int8_ops"),
      ),
      apiKeyAuditLogsApiKeyId9A77E6AaFkApiKeysId: foreignKey({
        columns: [table.apiKeyId],
        foreignColumns: [apiKeys.id],
        name: "api_key_audit_logs_api_key_id_9a77e6aa_fk_api_keys_id",
      }),
      apiKeyAuditLogsOrganizationIdDf3C0A5BFkOrganizationsId: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "api_key_audit_logs_organization_id_df3c0a5b_fk_organizations_id",
      }),
      apiKeyAuditLogsSpaceId3Ffc4DdbFkSpacesId: foreignKey({
        columns: [table.spaceId],
        foreignColumns: [spaces.id],
        name: "api_key_audit_logs_space_id_3ffc4ddb_fk_spaces_id",
      }),
    };
  },
);

export const apiKeys = pgTable(
  "api_keys",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "api_keys_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    name: varchar({ length: 255 }).notNull(),
    keyHash: varchar("key_hash", { length: 64 }).notNull(),
    keyPrefix: varchar("key_prefix", { length: 16 }).notNull(),
    organizationDomain: varchar("organization_domain", {
      length: 63,
    }).notNull(),
    domain: varchar({ length: 512 }).notNull(),
    status: varchar({ length: 20 }).notNull(),
    isActive: boolean("is_active").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }),
    lastUsedAt: timestamp("last_used_at", {
      withTimezone: true,
      mode: "string",
    }),
    revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "string" }),
    rotationGracePeriodEnds: timestamp("rotation_grace_period_ends", {
      withTimezone: true,
      mode: "string",
    }),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    revokedBy: varchar("revoked_by", { length: 255 }).notNull(),
    revocationReason: text("revocation_reason").notNull(),
    extraMetadata: jsonb("extra_metadata").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    exposedById: bigint("exposed_by_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    rotatedFromId: bigint("rotated_from_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    spaceId: bigint("space_id", { mode: "number" }),
  },
  (table) => {
    return {
      createdAtB7702630: index("api_keys_created_at_b7702630").using(
        "btree",
        table.createdAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      expiresAtCbbbde6A: index("api_keys_expires_at_cbbbde6a").using(
        "btree",
        table.expiresAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      exposedByIdC94E86A2: index("api_keys_exposed_by_id_c94e86a2").using(
        "btree",
        table.exposedById.asc().nullsLast().op("int8_ops"),
      ),
      folderIdF7B911Bb: index("api_keys_folder_id_f7b911bb").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
      ),
      isActive54242Afb: index("api_keys_is_active_54242afb").using(
        "btree",
        table.isActive.asc().nullsLast().op("bool_ops"),
      ),
      keyHashF470374CLike: index("api_keys_key_hash_f470374c_like").using(
        "btree",
        table.keyHash.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      organizationDomain273Ba7Ef: index(
        "api_keys_organization_domain_273ba7ef",
      ).using(
        "btree",
        table.organizationDomain.asc().nullsLast().op("text_ops"),
      ),
      organizationDomain273Ba7EfLike: index(
        "api_keys_organization_domain_273ba7ef_like",
      ).using(
        "btree",
        table.organizationDomain.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      organizationId745157A7: index("api_keys_organization_id_745157a7").using(
        "btree",
        table.organizationId.asc().nullsLast().op("int8_ops"),
      ),
      rotatedFromId45Ba13E4: index("api_keys_rotated_from_id_45ba13e4").using(
        "btree",
        table.rotatedFromId.asc().nullsLast().op("int8_ops"),
      ),
      spaceId0D8160Ba: index("api_keys_space_id_0d8160ba").using(
        "btree",
        table.spaceId.asc().nullsLast().op("int8_ops"),
      ),
      statusD5Aab957: index("api_keys_status_d5aab957").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      statusD5Aab957Like: index("api_keys_status_d5aab957_like").using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      idxApikeyExpires: index("idx_apikey_expires").using(
        "btree",
        table.expiresAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      idxApikeyOrgActive: index("idx_apikey_org_active").using(
        "btree",
        table.organizationId.asc().nullsLast().op("int8_ops"),
        table.isActive.asc().nullsLast().op("int8_ops"),
      ),
      idxApikeySpaceActive: index("idx_apikey_space_active").using(
        "btree",
        table.spaceId.asc().nullsLast().op("int8_ops"),
        table.isActive.asc().nullsLast().op("int8_ops"),
      ),
      apiKeysExposedByIdC94E86A2FkUsersId: foreignKey({
        columns: [table.exposedById],
        foreignColumns: [users.id],
        name: "api_keys_exposed_by_id_c94e86a2_fk_users_id",
      }),
      apiKeysFolderIdF7B911BbFkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "api_keys_folder_id_f7b911bb_fk_folders_id",
      }),
      apiKeysOrganizationId745157A7FkOrganizationsId: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "api_keys_organization_id_745157a7_fk_organizations_id",
      }),
      apiKeysRotatedFromId45Ba13E4FkApiKeysId: foreignKey({
        columns: [table.rotatedFromId],
        foreignColumns: [table.id],
        name: "api_keys_rotated_from_id_45ba13e4_fk_api_keys_id",
      }),
      apiKeysSpaceId0D8160BaFkSpacesId: foreignKey({
        columns: [table.spaceId],
        foreignColumns: [spaces.id],
        name: "api_keys_space_id_0d8160ba_fk_spaces_id",
      }),
      apiKeysKeyHashKey: unique("api_keys_key_hash_key").on(table.keyHash),
    };
  },
);

export const authGroup = pgTable(
  "auth_group",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "auth_group_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    name: varchar({ length: 150 }).notNull(),
  },
  (table) => {
    return {
      nameA6Ea08EcLike: index("auth_group_name_a6ea08ec_like").using(
        "btree",
        table.name.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      authGroupNameKey: unique("auth_group_name_key").on(table.name),
    };
  },
);

export const djangoContentType = pgTable(
  "django_content_type",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "django_content_type_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    appLabel: varchar("app_label", { length: 100 }).notNull(),
    model: varchar({ length: 100 }).notNull(),
  },
  (table) => {
    return {
      djangoContentTypeAppLabelModel76Bd3D3BUniq: unique(
        "django_content_type_app_label_model_76bd3d3b_uniq",
      ).on(table.appLabel, table.model),
    };
  },
);

export const databaseIngestions = pgTable(
  "database_ingestions",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "database_ingestions_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    ingestionCategory: varchar("ingestion_category", { length: 20 }).notNull(),
    databaseEngine: varchar("database_engine", { length: 50 }).notNull(),
    connectionString: text("connection_string").notNull(),
    connectionDetails: jsonb("connection_details").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    uploadedById: bigint("uploaded_by_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      databaseInFolder4Ec59DIdx: index("database_in_folder__4ec59d_idx").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      databaseInIngesti611C4BIdx: index("database_in_ingesti_611c4b_idx").using(
        "btree",
        table.ingestionCategory.asc().nullsLast().op("text_ops"),
        table.databaseEngine.asc().nullsLast().op("text_ops"),
      ),
      databaseInUploade1AabbbIdx: index("database_in_uploade_1aabbb_idx").using(
        "btree",
        table.uploadedById.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      databaseEngineF01Fcbe5: index(
        "database_ingestions_database_engine_f01fcbe5",
      ).using("btree", table.databaseEngine.asc().nullsLast().op("text_ops")),
      databaseEngineF01Fcbe5Like: index(
        "database_ingestions_database_engine_f01fcbe5_like",
      ).using(
        "btree",
        table.databaseEngine.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      folderId12Ed975C: index("database_ingestions_folder_id_12ed975c").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
      ),
      ingestionCategoryBf3644A6: index(
        "database_ingestions_ingestion_category_bf3644a6",
      ).using(
        "btree",
        table.ingestionCategory.asc().nullsLast().op("text_ops"),
      ),
      ingestionCategoryBf3644A6Like: index(
        "database_ingestions_ingestion_category_bf3644a6_like",
      ).using(
        "btree",
        table.ingestionCategory.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      uploadedById5424A97C: index(
        "database_ingestions_uploaded_by_id_5424a97c",
      ).using("btree", table.uploadedById.asc().nullsLast().op("int8_ops")),
      databaseIngestionsFolderId12Ed975CFkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "database_ingestions_folder_id_12ed975c_fk_folders_id",
      }),
      databaseIngestionsUploadedById5424A97CFkUsersId: foreignKey({
        columns: [table.uploadedById],
        foreignColumns: [users.id],
        name: "database_ingestions_uploaded_by_id_5424a97c_fk_users_id",
      }),
    };
  },
);

export const authPermission = pgTable(
  "auth_permission",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "auth_permission_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    name: varchar({ length: 255 }).notNull(),
    contentTypeId: integer("content_type_id").notNull(),
    codename: varchar({ length: 100 }).notNull(),
  },
  (table) => {
    return {
      contentTypeId2F476E4B: index(
        "auth_permission_content_type_id_2f476e4b",
      ).using("btree", table.contentTypeId.asc().nullsLast().op("int4_ops")),
      authPermissionContentTypeId2F476E4BFkDjangoCo: foreignKey({
        columns: [table.contentTypeId],
        foreignColumns: [djangoContentType.id],
        name: "auth_permission_content_type_id_2f476e4b_fk_django_co",
      }),
      authPermissionContentTypeIdCodename01Ab375AUniq: unique(
        "auth_permission_content_type_id_codename_01ab375a_uniq",
      ).on(table.contentTypeId, table.codename),
    };
  },
);

export const djangoAdminLog = pgTable(
  "django_admin_log",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "django_admin_log_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    actionTime: timestamp("action_time", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    objectId: text("object_id"),
    objectRepr: varchar("object_repr", { length: 200 }).notNull(),
    actionFlag: smallint("action_flag").notNull(),
    changeMessage: text("change_message").notNull(),
    contentTypeId: integer("content_type_id"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      contentTypeIdC4Bce8Eb: index(
        "django_admin_log_content_type_id_c4bce8eb",
      ).using("btree", table.contentTypeId.asc().nullsLast().op("int4_ops")),
      userIdC564Eba6: index("django_admin_log_user_id_c564eba6").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      djangoAdminLogContentTypeIdC4Bce8EbFkDjangoCo: foreignKey({
        columns: [table.contentTypeId],
        foreignColumns: [djangoContentType.id],
        name: "django_admin_log_content_type_id_c4bce8eb_fk_django_co",
      }),
      djangoAdminLogUserIdC564Eba6FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "django_admin_log_user_id_c564eba6_fk_users_id",
      }),
      djangoAdminLogActionFlagCheck: check(
        "django_admin_log_action_flag_check",
        sql`action_flag >= 0`,
      ),
    };
  },
);

export const customMetadata = pgTable(
  "custom_metadata",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "custom_metadata_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    key: varchar({ length: 255 }).notNull(),
    value: text().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    manualMetadataId: bigint("manual_metadata_id", {
      mode: "number",
    }).notNull(),
  },
  (table) => {
    return {
      manualMetadataId78Cccf98: index(
        "custom_metadata_manual_metadata_id_78cccf98",
      ).using("btree", table.manualMetadataId.asc().nullsLast().op("int8_ops")),
      customMetadataManualMetadataId78Cccf98FkManualMe: foreignKey({
        columns: [table.manualMetadataId],
        foreignColumns: [manualMetadata.id],
        name: "custom_metadata_manual_metadata_id_78cccf98_fk_manual_me",
      }),
      customMetadataManualMetadataIdKey7916A73CUniq: unique(
        "custom_metadata_manual_metadata_id_key_7916a73c_uniq",
      ).on(table.key, table.manualMetadataId),
    };
  },
);

export const customPrompts = pgTable(
  "custom_prompts",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "custom_prompts_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    title: varchar({ length: 255 }),
    prompt: text().notNull(),
    variables: jsonb().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }),
    location: varchar({ length: 16 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    spaceId: bigint("space_id", { mode: "number" }),
  },
  (table) => {
    return {
      customPromOrganizA9E222Idx: index("custom_prom_organiz_a9e222_idx").using(
        "btree",
        table.organizationId.asc().nullsLast().op("int8_ops"),
      ),
      customPromUserId40E003Idx: index("custom_prom_user_id_40e003_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.updatedAt.desc().nullsFirst().op("int8_ops"),
      ),
      customPromUserId5B6418Idx: index("custom_prom_user_id_5b6418_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.folderId.asc().nullsLast().op("int8_ops"),
      ),
      customPromUserIdF8291AIdx: index("custom_prom_user_id_f8291a_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.spaceId.asc().nullsLast().op("int8_ops"),
      ),
      customPromUserIdFd5F97Idx: index("custom_prom_user_id_fd5f97_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.location.asc().nullsLast().op("int8_ops"),
      ),
      folderIdFd286B8D: index("custom_prompts_folder_id_fd286b8d").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
      ),
      locationD5C3Ef78: index("custom_prompts_location_d5c3ef78").using(
        "btree",
        table.location.asc().nullsLast().op("text_ops"),
      ),
      locationD5C3Ef78Like: index(
        "custom_prompts_location_d5c3ef78_like",
      ).using(
        "btree",
        table.location.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      organizationIdAcff01Af: index(
        "custom_prompts_organization_id_acff01af",
      ).using("btree", table.organizationId.asc().nullsLast().op("int8_ops")),
      spaceId1B0Fc252: index("custom_prompts_space_id_1b0fc252").using(
        "btree",
        table.spaceId.asc().nullsLast().op("int8_ops"),
      ),
      userId2A2Ed8B5: index("custom_prompts_user_id_2a2ed8b5").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      customPromptsFolderIdFd286B8DFkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "custom_prompts_folder_id_fd286b8d_fk_folders_id",
      }),
      customPromptsOrganizationIdAcff01AfFkOrganizationsId: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "custom_prompts_organization_id_acff01af_fk_organizations_id",
      }),
      customPromptsSpaceId1B0Fc252FkSpacesId: foreignKey({
        columns: [table.spaceId],
        foreignColumns: [spaces.id],
        name: "custom_prompts_space_id_1b0fc252_fk_spaces_id",
      }),
      customPromptsUserId2A2Ed8B5FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "custom_prompts_user_id_2a2ed8b5_fk_users_id",
      }),
      customPromptLocationTargets: check(
        "custom_prompt_location_targets",
        sql`((folder_id IS NULL) AND ((location)::text = 'HOME'::text) AND (space_id IS NULL)) OR ((folder_id IS NULL) AND ((location)::text = 'SPACE_HOME'::text) AND (space_id IS NOT NULL)) OR ((folder_id IS NOT NULL) AND ((location)::text = 'FOLDER'::text))`,
      ),
    };
  },
);

export const djangoEventstreamEvent = pgTable(
  "django_eventstream_event",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "django_eventstream_event_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    channel: varchar({ length: 255 }).notNull(),
    type: varchar({ length: 255 }).notNull(),
    data: text().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    eid: bigint({ mode: "number" }).notNull(),
    created: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      channel49Bacd5E: index("django_eventstream_event_channel_49bacd5e").using(
        "btree",
        table.channel.asc().nullsLast().op("text_ops"),
      ),
      channel49Bacd5ELike: index(
        "django_eventstream_event_channel_49bacd5e_like",
      ).using(
        "btree",
        table.channel.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      created039C5D02: index("django_eventstream_event_created_039c5d02").using(
        "btree",
        table.created.asc().nullsLast().op("timestamptz_ops"),
      ),
      eid2Da5C1C0: index("django_eventstream_event_eid_2da5c1c0").using(
        "btree",
        table.eid.asc().nullsLast().op("int8_ops"),
      ),
      type0E7A664E: index("django_eventstream_event_type_0e7a664e").using(
        "btree",
        table.type.asc().nullsLast().op("text_ops"),
      ),
      type0E7A664ELike: index(
        "django_eventstream_event_type_0e7a664e_like",
      ).using("btree", table.type.asc().nullsLast().op("varchar_pattern_ops")),
      djangoEventstreamEventChannelEid20F68A1AUniq: unique(
        "django_eventstream_event_channel_eid_20f68a1a_uniq",
      ).on(table.channel, table.eid),
    };
  },
);

export const djangoEventstreamEventcounter = pgTable(
  "django_eventstream_eventcounter",
  {
    id: integer()
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "django_eventstream_eventcounter_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    name: varchar({ length: 255 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    value: bigint({ mode: "number" }).notNull(),
    updated: timestamp({ withTimezone: true, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      name3F2F7780Like: index(
        "django_eventstream_eventcounter_name_3f2f7780_like",
      ).using("btree", table.name.asc().nullsLast().op("varchar_pattern_ops")),
      updated0B6F9A25: index(
        "django_eventstream_eventcounter_updated_0b6f9a25",
      ).using("btree", table.updated.asc().nullsLast().op("timestamptz_ops")),
      djangoEventstreamEventcounterNameKey: unique(
        "django_eventstream_eventcounter_name_key",
      ).on(table.name),
    };
  },
);

export const djangoMigrations = pgTable("django_migrations", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity({
      name: "django_migrations_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
  app: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  applied: timestamp({ withTimezone: true, mode: "string" }).notNull(),
});

export const djangoSession = pgTable(
  "django_session",
  {
    sessionKey: varchar("session_key", { length: 40 }).primaryKey().notNull(),
    sessionData: text("session_data").notNull(),
    expireDate: timestamp("expire_date", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
  },
  (table) => {
    return {
      expireDateA5C62663: index("django_session_expire_date_a5c62663").using(
        "btree",
        table.expireDate.asc().nullsLast().op("timestamptz_ops"),
      ),
      sessionKeyC0390E0FLike: index(
        "django_session_session_key_c0390e0f_like",
      ).using(
        "btree",
        table.sessionKey.asc().nullsLast().op("varchar_pattern_ops"),
      ),
    };
  },
);

export const folderContentReads = pgTable(
  "folder_content_reads",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "folder_content_reads_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    metadataId: bigint("metadata_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      folderId481Ac0F0: index("folder_content_reads_folder_id_481ac0f0").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
      ),
      metadataId8901Feaa: index(
        "folder_content_reads_metadata_id_8901feaa",
      ).using("btree", table.metadataId.asc().nullsLast().op("int8_ops")),
      folderContentReadsFolderId481Ac0F0FkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "folder_content_reads_folder_id_481ac0f0_fk_folders_id",
      }),
      folderContentReadsMetadataId8901FeaaFkManualMetadataId: foreignKey({
        columns: [table.metadataId],
        foreignColumns: [manualMetadata.id],
        name: "folder_content_reads_metadata_id_8901feaa_fk_manual_metadata_id",
      }),
      folderContentReadsUserIdF5C5A4E2FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "folder_content_reads_user_id_f5c5a4e2_fk_users_id",
      }),
      folderContentReadsUserIdFolderIdMetada316Adf5EUniq: unique(
        "folder_content_reads_user_id_folder_id_metada_316adf5e_uniq",
      ).on(table.folderId, table.metadataId, table.userId),
    };
  },
);

export const jobExecution = pgTable(
  "job_execution",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "job_execution_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    generationNumber: integer("generation_number").notNull(),
    status: varchar({ length: 50 }).notNull(),
    totalUnits: integer("total_units"),
    startedAt: timestamp("started_at", { withTimezone: true, mode: "string" }),
    finishedAt: timestamp("finished_at", {
      withTimezone: true,
      mode: "string",
    }),
    retryReason: text("retry_reason"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    jobId: bigint("job_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      jobExecutiJobId426B76Idx: index("job_executi_job_id_426b76_idx").using(
        "btree",
        table.jobId.asc().nullsLast().op("int4_ops"),
        table.generationNumber.asc().nullsLast().op("int8_ops"),
      ),
      jobExecutiStatus6Daa73Idx: index("job_executi_status_6daa73_idx").using(
        "btree",
        table.status.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.asc().nullsLast().op("text_ops"),
      ),
      jobId1E17A7Ed: index("job_execution_job_id_1e17a7ed").using(
        "btree",
        table.jobId.asc().nullsLast().op("int8_ops"),
      ),
      statusBca1053C: index("job_execution_status_bca1053c").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      statusBca1053CLike: index("job_execution_status_bca1053c_like").using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      jobExecutionJobId1E17A7EdFkOcrJobId: foreignKey({
        columns: [table.jobId],
        foreignColumns: [ocrJob.id],
        name: "job_execution_job_id_1e17a7ed_fk_ocr_job_id",
      }),
      uniqueJobGeneration: unique("unique_job_generation").on(
        table.generationNumber,
        table.jobId,
      ),
    };
  },
);

export const executionAttempt = pgTable(
  "execution_attempt",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "execution_attempt_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    attemptNumber: integer("attempt_number").notNull(),
    aiDone: boolean("ai_done").notNull(),
    saveDone: boolean("save_done").notNull(),
    cleanupDone: boolean("cleanup_done").notNull(),
    ocrResponse: jsonb("ocr_response"),
    errorMessage: text("error_message"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    workUnitId: bigint("work_unit_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      workUnitIdBa50310A: index(
        "execution_attempt_work_unit_id_ba50310a",
      ).using("btree", table.workUnitId.asc().nullsLast().op("int8_ops")),
      executionAttemptWorkUnitIdBa50310AFkWorkUnitId: foreignKey({
        columns: [table.workUnitId],
        foreignColumns: [ocrWorkUnit.id],
        name: "execution_attempt_work_unit_id_ba50310a_fk_work_unit_id",
      }),
      uniqueAttempt: unique("unique_attempt").on(
        table.attemptNumber,
        table.workUnitId,
      ),
    };
  },
);

export const folders = pgTable(
  "folders",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "folders_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    name: varchar({ length: 25 }).notNull(),
    about: text().notNull(),
    systemGeneratedInstructions: text("system_generated_instructions"),
    avatar: varchar({ length: 100 }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdById: bigint("created_by_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    spaceId: bigint("space_id", { mode: "number" }),
    folderType: varchar("folder_type", { length: 32 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    aiModelId: bigint("ai_model_id", { mode: "number" }),
  },
  (table) => {
    return {
      aiMode418316Idx: index("folders_ai_mode_418316_idx").using(
        "btree",
        table.aiModelId.asc().nullsLast().op("int8_ops"),
      ),
      aiModelId0F48A206: index("folders_ai_model_id_0f48a206").using(
        "btree",
        table.aiModelId.asc().nullsLast().op("int8_ops"),
      ),
      createdById829125E0: index("folders_created_by_id_829125e0").using(
        "btree",
        table.createdById.asc().nullsLast().op("int8_ops"),
      ),
      folderType88Cd580F: index("folders_folder_type_88cd580f").using(
        "btree",
        table.folderType.asc().nullsLast().op("text_ops"),
      ),
      folderType88Cd580FLike: index("folders_folder_type_88cd580f_like").using(
        "btree",
        table.folderType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      spaceI276970Idx: index("folders_space_i_276970_idx").using(
        "btree",
        table.spaceId.asc().nullsLast().op("text_ops"),
        table.folderType.asc().nullsLast().op("int8_ops"),
      ),
      spaceI9C4339Idx: index("folders_space_i_9c4339_idx").using(
        "btree",
        table.spaceId.asc().nullsLast().op("int8_ops"),
      ),
      spaceId0A97C671: index("folders_space_id_0a97c671").using(
        "btree",
        table.spaceId.asc().nullsLast().op("int8_ops"),
      ),
      foldersAiModelId0F48A206FkAiModelsId: foreignKey({
        columns: [table.aiModelId],
        foreignColumns: [aiModels.id],
        name: "folders_ai_model_id_0f48a206_fk_ai_models_id",
      }),
      foldersCreatedById829125E0FkUsersId: foreignKey({
        columns: [table.createdById],
        foreignColumns: [users.id],
        name: "folders_created_by_id_829125e0_fk_users_id",
      }),
      foldersSpaceId0A97C671FkSpacesId: foreignKey({
        columns: [table.spaceId],
        foreignColumns: [spaces.id],
        name: "folders_space_id_0a97c671_fk_spaces_id",
      }),
      foldersNameCreatedByIdBd60D8A1Uniq: unique(
        "folders_name_created_by_id_bd60d8a1_uniq",
      ).on(table.name, table.createdById),
    };
  },
);

export const folderMembers = pgTable(
  "folder_members",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "folder_members_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    role: varchar({ length: 20 }).notNull(),
    addedAt: timestamp("added_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      folderMembFolderF2Cb3DIdx: index("folder_memb_folder__f2cb3d_idx").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
        table.role.asc().nullsLast().op("int8_ops"),
      ),
      folderId6Dfc2723: index("folder_members_folder_id_6dfc2723").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
      ),
      userId1A659506: index("folder_members_user_id_1a659506").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      folderMembersFolderId6Dfc2723FkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "folder_members_folder_id_6dfc2723_fk_folders_id",
      }),
      folderMembersUserId1A659506FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "folder_members_user_id_1a659506_fk_users_id",
      }),
      folderMembersFolderIdUserId402Cd01BUniq: unique(
        "folder_members_folder_id_user_id_402cd01b_uniq",
      ).on(table.folderId, table.userId),
    };
  },
);

export const mediaHandlerJobs = pgTable(
  "media_handler_jobs",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "media_handler_jobs_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    mediaType: varchar("media_type", { length: 20 }).notNull(),
    shouldConvert: boolean("should_convert").notNull(),
    shouldCompress: boolean("should_compress").notNull(),
    status: varchar({ length: 20 }).notNull(),
    currentStep: varchar("current_step", { length: 50 }).notNull(),
    lastCompletedStep: varchar("last_completed_step", { length: 50 }).notNull(),
    stepStatus: varchar("step_status", { length: 20 }).notNull(),
    retryCounts: jsonb("retry_counts").notNull(),
    totalRetryCount: integer("total_retry_count").notNull(),
    sourceDownloaded: boolean("source_downloaded").notNull(),
    sourceLocalPath: text("source_local_path").notNull(),
    convertDone: boolean("convert_done").notNull(),
    compressDone: boolean("compress_done").notNull(),
    posterDone: boolean("poster_done").notNull(),
    clipDone: boolean("clip_done").notNull(),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    manualMetadataId: bigint("manual_metadata_id", {
      mode: "number",
    }).notNull(),
    nextRetryAt: timestamp("next_retry_at", {
      withTimezone: true,
      mode: "string",
    }),
  },
  (table) => {
    return {
      mediaHandlStatus37C8A5Idx: index("media_handl_status_37c8a5_idx").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
        table.updatedAt.asc().nullsLast().op("text_ops"),
      ),
      status5958F7E9: index("media_handler_jobs_status_5958f7e9").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      status5958F7E9Like: index(
        "media_handler_jobs_status_5958f7e9_like",
      ).using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      mediaHandlerJobsManualMetadataIdF6116806FkManualMe: foreignKey({
        columns: [table.manualMetadataId],
        foreignColumns: [manualMetadata.id],
        name: "media_handler_jobs_manual_metadata_id_f6116806_fk_manual_me",
      }),
      mediaHandlerJobsManualMetadataIdKey: unique(
        "media_handler_jobs_manual_metadata_id_key",
      ).on(table.manualMetadataId),
    };
  },
);

export const multiFactorAuditLogs = pgTable(
  "multi_factor_audit_logs",
  {
    id: uuid().primaryKey().notNull(),
    eventType: varchar("event_type", { length: 30 }).notNull(),
    methodType: varchar("method_type", { length: 10 }).notNull(),
    ipAddress: inet("ip_address"),
    userAgent: text("user_agent").notNull(),
    success: boolean().notNull(),
    failureReason: varchar("failure_reason", { length: 255 }).notNull(),
    timestamp: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    performedById: bigint("performed_by_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }),
  },
  (table) => {
    return {
      idxMfaAuditEventTime: index("idx_mfa_audit_event_time").using(
        "btree",
        table.eventType.asc().nullsLast().op("text_ops"),
        table.timestamp.asc().nullsLast().op("text_ops"),
      ),
      idxMfaAuditUserTime: index("idx_mfa_audit_user_time").using(
        "btree",
        table.userId.asc().nullsLast().op("timestamptz_ops"),
        table.timestamp.asc().nullsLast().op("timestamptz_ops"),
      ),
      eventTypeAfbb61Eb: index(
        "multi_factor_audit_logs_event_type_afbb61eb",
      ).using("btree", table.eventType.asc().nullsLast().op("text_ops")),
      eventTypeAfbb61EbLike: index(
        "multi_factor_audit_logs_event_type_afbb61eb_like",
      ).using(
        "btree",
        table.eventType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      performedById83Db639B: index(
        "multi_factor_audit_logs_performed_by_id_83db639b",
      ).using("btree", table.performedById.asc().nullsLast().op("int8_ops")),
      successC860D223: index("multi_factor_audit_logs_success_c860d223").using(
        "btree",
        table.success.asc().nullsLast().op("bool_ops"),
      ),
      timestamp1Cc8Fa96: index(
        "multi_factor_audit_logs_timestamp_1cc8fa96",
      ).using("btree", table.timestamp.asc().nullsLast().op("timestamptz_ops")),
      userId05D71E20: index("multi_factor_audit_logs_user_id_05d71e20").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      multiFactorAuditLogsPerformedById83Db639BFkUsersId: foreignKey({
        columns: [table.performedById],
        foreignColumns: [users.id],
        name: "multi_factor_audit_logs_performed_by_id_83db639b_fk_users_id",
      }),
      multiFactorAuditLogsUserId05D71E20FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "multi_factor_audit_logs_user_id_05d71e20_fk_users_id",
      }),
    };
  },
);

export const mediaFiles = pgTable(
  "media_files",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "media_files_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    mediaFile: varchar("media_file", { length: 512 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    size: bigint({ mode: "number" }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    batchId: varchar("batch_id", { length: 100 }).notNull(),
    batchSequence: integer("batch_sequence").notNull(),
    customMetadata: jsonb("custom_metadata"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    uploadedById: bigint("uploaded_by_id", { mode: "number" }).notNull(),
    duration: doublePrecision(),
    extension: varchar({ length: 20 }).notNull(),
    poster: varchar({ length: 512 }),
    shortClip: varchar("short_clip", { length: 512 }),
    mediaType: varchar("media_type", { length: 20 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      batchId99A7Ac6B: index("media_files_batch_id_99a7ac6b").using(
        "btree",
        table.batchId.asc().nullsLast().op("text_ops"),
      ),
      batchId99A7Ac6BLike: index("media_files_batch_id_99a7ac6b_like").using(
        "btree",
        table.batchId.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      extension5E179Faa: index("media_files_extension_5e179faa").using(
        "btree",
        table.extension.asc().nullsLast().op("text_ops"),
      ),
      extension5E179FaaLike: index("media_files_extension_5e179faa_like").using(
        "btree",
        table.extension.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      folderIdE03887Af: index("media_files_folder_id_e03887af").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
      ),
      mediaFileNameA58Fa4E1: index(
        "media_files_media_file_name_a58fa4e1",
      ).using("btree", table.name.asc().nullsLast().op("text_ops")),
      mediaFileNameA58Fa4E1Like: index(
        "media_files_media_file_name_a58fa4e1_like",
      ).using("btree", table.name.asc().nullsLast().op("varchar_pattern_ops")),
      uploade7A664AIdx: index("media_files_uploade_7a664a_idx").using(
        "btree",
        table.uploadedById.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      uploadedByIdC4A2A636: index("media_files_uploaded_by_id_c4a2a636").using(
        "btree",
        table.uploadedById.asc().nullsLast().op("int8_ops"),
      ),
      mediaFilesFolderIdE03887AfFkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "media_files_folder_id_e03887af_fk_folders_id",
      }),
      mediaFilesUploadedByIdC4A2A636FkUsersId: foreignKey({
        columns: [table.uploadedById],
        foreignColumns: [users.id],
        name: "media_files_uploaded_by_id_c4a2a636_fk_users_id",
      }),
    };
  },
);

export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "notification_preferences_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    notificationType: varchar("notification_type", { length: 64 }).notNull(),
    inApp: boolean("in_app").notNull(),
    email: boolean().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      notifPrefUserTypeIdx: index("notif_pref_user_type_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.notificationType.asc().nullsLast().op("text_ops"),
      ),
      userId08802827: index("notification_preferences_user_id_08802827").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      notificationPreferencesUserId08802827FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "notification_preferences_user_id_08802827_fk_users_id",
      }),
      uniqueUserNotificationPreference: unique(
        "unique_user_notification_preference",
      ).on(table.notificationType, table.userId),
    };
  },
);

export const organizationAiQuotas = pgTable(
  "organization_ai_quotas",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "organization_ai_quotas_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    tokensUsed: bigint("tokens_used", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    aiModelId: bigint("ai_model_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    allocatedById: bigint("allocated_by_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }).notNull(),
    isDefault: boolean("is_default").notNull(),
  },
  (table) => {
    return {
      organizatioOrganizE0A279Idx: index(
        "organizatio_organiz_e0a279_idx",
      ).using(
        "btree",
        table.organizationId.asc().nullsLast().op("int8_ops"),
        table.isDefault.asc().nullsLast().op("int8_ops"),
      ),
      organizatioOrganizE44351Idx: index(
        "organizatio_organiz_e44351_idx",
      ).using(
        "btree",
        table.organizationId.asc().nullsLast().op("int8_ops"),
        table.aiModelId.asc().nullsLast().op("int8_ops"),
      ),
      aiModelIdBa86186F: index(
        "organization_ai_quotas_ai_model_id_ba86186f",
      ).using("btree", table.aiModelId.asc().nullsLast().op("int8_ops")),
      allocatedById93A1D3Eb: index(
        "organization_ai_quotas_allocated_by_id_93a1d3eb",
      ).using("btree", table.allocatedById.asc().nullsLast().op("int8_ops")),
      organizationId7A049Da7: index(
        "organization_ai_quotas_organization_id_7a049da7",
      ).using("btree", table.organizationId.asc().nullsLast().op("int8_ops")),
      uniqueDefaultAiModelPerOrg: uniqueIndex("unique_default_ai_model_per_org")
        .using("btree", table.organizationId.asc().nullsLast().op("int8_ops"))
        .where(sql`is_default`),
      organizationAiQuotOrganizationId7A049Da7FkOrganizat: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "organization_ai_quot_organization_id_7a049da7_fk_organizat",
      }),
      organizationAiQuotasAiModelIdBa86186FFkAiModelsId: foreignKey({
        columns: [table.aiModelId],
        foreignColumns: [aiModels.id],
        name: "organization_ai_quotas_ai_model_id_ba86186f_fk_ai_models_id",
      }),
      organizationAiQuotasAllocatedById93A1D3EbFkUsersId: foreignKey({
        columns: [table.allocatedById],
        foreignColumns: [users.id],
        name: "organization_ai_quotas_allocated_by_id_93a1d3eb_fk_users_id",
      }),
      organizationAiQuotasOrganizationIdAiModel1Ba5D85BUniq: unique(
        "organization_ai_quotas_organization_id_ai_model_1ba5d85b_uniq",
      ).on(table.aiModelId, table.organizationId),
      organizationAiQuotasTokensUsedCheck: check(
        "organization_ai_quotas_tokens_used_check",
        sql`tokens_used >= 0`,
      ),
    };
  },
);

export const multiFactorEmailOtps = pgTable(
  "multi_factor_email_otps",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "multi_factor_email_otps_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    purpose: varchar({ length: 10 }).notNull(),
    codeHash: varchar("code_hash", { length: 64 }).notNull(),
    encryptedCode: text("encrypted_code"),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    attemptCount: smallint("attempt_count").notNull(),
    consumedAt: timestamp("consumed_at", {
      withTimezone: true,
      mode: "string",
    }),
    lastSentAt: timestamp("last_sent_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      multiFactoUserId8F100DIdx: index("multi_facto_user_id_8f100d_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.purpose.asc().nullsLast().op("timestamptz_ops"),
        table.consumedAt.asc().nullsLast().op("text_ops"),
      ),
      userId8941796D: index("multi_factor_email_otps_user_id_8941796d").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      uniqueLiveEmailOtpPerUserPurpose: uniqueIndex(
        "unique_live_email_otp_per_user_purpose",
      )
        .using(
          "btree",
          table.userId.asc().nullsLast().op("int8_ops"),
          table.purpose.asc().nullsLast().op("int8_ops"),
        )
        .where(sql`(consumed_at IS NULL)`),
      multiFactorEmailOtpsUserId8941796DFkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "multi_factor_email_otps_user_id_8941796d_fk_users_id",
      }),
      multiFactorEmailOtpsAttemptCountCheck: check(
        "multi_factor_email_otps_attempt_count_check",
        sql`attempt_count >= 0`,
      ),
    };
  },
);

export const ocrJob = pgTable(
  "ocr_job",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ocr_job_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    status: varchar({ length: 50 }).notNull(),
    sourceDownloaded: boolean("source_downloaded").notNull(),
    sourceLocalPath: text("source_local_path"),
    chunksCreated: boolean("chunks_created").notNull(),
    chunksUploaded: boolean("chunks_uploaded").notNull(),
    chunkMetadata: jsonb("chunk_metadata").notNull(),
    totalUnits: integer("total_units"),
    initAttemptCount: integer("init_attempt_count").notNull(),
    initLastError: text("init_last_error"),
    maxRetries: integer("max_retries").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    errorMessage: text("error_message"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    manualMetadataId: bigint("manual_metadata_id", {
      mode: "number",
    }).notNull(),
  },
  (table) => {
    return {
      manualMetadataIdA40A4336: index(
        "ocr_job_manual_metadata_id_a40a4336",
      ).using("btree", table.manualMetadataId.asc().nullsLast().op("int8_ops")),
      status508727Idx: index("ocr_job_status_508727_idx").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
        table.createdAt.asc().nullsLast().op("text_ops"),
      ),
      statusE7F31D07: index("ocr_job_status_e7f31d07").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      statusE7F31D07Like: index("ocr_job_status_e7f31d07_like").using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      ocrJobManualMetadataIdA40A4336FkManualMetadataId: foreignKey({
        columns: [table.manualMetadataId],
        foreignColumns: [manualMetadata.id],
        name: "ocr_job_manual_metadata_id_a40a4336_fk_manual_metadata_id",
      }),
    };
  },
);

export const postComments = pgTable(
  "post_comments",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "post_comments_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    comment: text().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    postId: bigint("post_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      postCommenPostId886916Idx: index("post_commen_post_id_886916_idx").using(
        "btree",
        table.postId.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      postIdE17F8125: index("post_comments_post_id_e17f8125").using(
        "btree",
        table.postId.asc().nullsLast().op("int8_ops"),
      ),
      userId540F5634: index("post_comments_user_id_540f5634").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      postCommentsPostIdE17F8125FkPostsId: foreignKey({
        columns: [table.postId],
        foreignColumns: [posts.id],
        name: "post_comments_post_id_e17f8125_fk_posts_id",
      }),
      postCommentsUserId540F5634FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "post_comments_user_id_540f5634_fk_users_id",
      }),
    };
  },
);

export const organizationStorage = pgTable(
  "organization_storage",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "organization_storage_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    totalQuotaBytes: bigint("total_quota_bytes", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    usedBytes: bigint("used_bytes", { mode: "number" }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      organizationStorageOrganizationId0093DeecFkOrganizat: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "organization_storage_organization_id_0093deec_fk_organizat",
      }),
      organizationStorageOrganizationIdKey: unique(
        "organization_storage_organization_id_key",
      ).on(table.organizationId),
      organizationStorageTotalQuotaNonNegative: check(
        "organization_storage_total_quota_non_negative",
        sql`total_quota_bytes >= 0`,
      ),
      organizationStorageUsedBytesNonNegative: check(
        "organization_storage_used_bytes_non_negative",
        sql`used_bytes >= 0`,
      ),
      organizationStorageUsedLteTotal: check(
        "organization_storage_used_lte_total",
        sql`used_bytes <= total_quota_bytes`,
      ),
    };
  },
);

export const posts = pgTable(
  "posts",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "posts_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    title: varchar({ length: 255 }).notNull(),
    isOriginal: boolean("is_original").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    isDeleted: boolean("is_deleted").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdById: bigint("created_by_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    parentPostId: bigint("parent_post_id", { mode: "number" }),
    approvalStatus: varchar("approval_status", { length: 20 }).notNull(),
    approvalType: varchar("approval_type", { length: 20 }).notNull(),
    approvedBy: jsonb("approved_by").notNull(),
    approvers: jsonb().notNull(),
    rejectedBy: integer("rejected_by"),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
  },
  (table) => {
    return {
      createdByIdD25C0D44: index("posts_created_by_id_d25c0d44").using(
        "btree",
        table.createdById.asc().nullsLast().op("int8_ops"),
      ),
      folder15A0D0Idx: index("posts_folder__15a0d0_idx").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
        table.isDeleted.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.asc().nullsLast().op("bool_ops"),
      ),
      folderIdA3Cc30D1: index("posts_folder_id_a3cc30d1").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
      ),
      parentPostId68Fb7Eae: index("posts_parent_post_id_68fb7eae").using(
        "btree",
        table.parentPostId.asc().nullsLast().op("int8_ops"),
      ),
      postsCreatedByIdD25C0D44FkUsersId: foreignKey({
        columns: [table.createdById],
        foreignColumns: [users.id],
        name: "posts_created_by_id_d25c0d44_fk_users_id",
      }),
      postsFolderIdA3Cc30D1FkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "posts_folder_id_a3cc30d1_fk_folders_id",
      }),
      postsParentPostId68Fb7EaeFkPostsId: foreignKey({
        columns: [table.parentPostId],
        foreignColumns: [table.id],
        name: "posts_parent_post_id_68fb7eae_fk_posts_id",
      }),
    };
  },
);

export const ocrWorkUnit = pgTable(
  "ocr_work_unit",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "work_unit_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    unitIndex: integer("unit_index").notNull(),
    chunkS3Key: varchar("chunk_s3_key", { length: 500 }).notNull(),
    status: varchar({ length: 50 }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    errorMessage: text("error_message"),
    errorType: varchar("error_type", { length: 100 }),
    rawText: text("raw_text"),
    markdownText: text("markdown_text"),
    resultStatus: varchar("result_status", { length: 50 }),
    textDetected: boolean("text_detected"),
    processingTime: doublePrecision("processing_time"),
    pageAlias: varchar("page_alias", { length: 100 }),
    pageType: varchar("page_type", { length: 100 }),
    tokensUsed: integer("tokens_used"),
    pageNumber: integer("page_number"),
    frameNumber: integer("frame_number"),
    startTime: doublePrecision("start_time"),
    endTime: doublePrecision("end_time"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    executionId: bigint("execution_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    jobId: bigint("job_id", { mode: "number" }).notNull(),
    s3Chunk: varchar("s3_chunk", { length: 100 }),
  },
  (table) => {
    return {
      ocrWorkUnExecuti6B974BIdx: index("ocr_work_un_executi_6b974b_idx").using(
        "btree",
        table.executionId.asc().nullsLast().op("int8_ops"),
        table.status.asc().nullsLast().op("text_ops"),
      ),
      ocrWorkUnExecutiAb3A94Idx: index("ocr_work_un_executi_ab3a94_idx").using(
        "btree",
        table.executionId.asc().nullsLast().op("int8_ops"),
        table.unitIndex.asc().nullsLast().op("int8_ops"),
      ),
      workUnitErrorType8Eee0E25: index("work_unit_error_type_8eee0e25").using(
        "btree",
        table.errorType.asc().nullsLast().op("text_ops"),
      ),
      workUnitErrorType8Eee0E25Like: index(
        "work_unit_error_type_8eee0e25_like",
      ).using(
        "btree",
        table.errorType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      workUnitExecutionIdE51Bfc2F: index(
        "work_unit_execution_id_e51bfc2f",
      ).using("btree", table.executionId.asc().nullsLast().op("int8_ops")),
      workUnitJobIdDa5B9810: index("work_unit_job_id_da5b9810").using(
        "btree",
        table.jobId.asc().nullsLast().op("int8_ops"),
      ),
      workUnitStatusFa856F78: index("work_unit_status_fa856f78").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      workUnitStatusFa856F78Like: index("work_unit_status_fa856f78_like").using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      workUnitExecutionIdE51Bfc2FFkJobExecutionId: foreignKey({
        columns: [table.executionId],
        foreignColumns: [jobExecution.id],
        name: "work_unit_execution_id_e51bfc2f_fk_job_execution_id",
      }),
      workUnitJobIdDa5B9810FkOcrJobId: foreignKey({
        columns: [table.jobId],
        foreignColumns: [ocrJob.id],
        name: "work_unit_job_id_da5b9810_fk_ocr_job_id",
      }),
      uniqueExecutionUnit: unique("unique_execution_unit").on(
        table.unitIndex,
        table.executionId,
      ),
    };
  },
);

export const postLikes = pgTable(
  "post_likes",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "post_likes_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    postId: bigint("post_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      postId9B873AIdx: index("post_likes_post_id_9b873a_idx").using(
        "btree",
        table.postId.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      postIdB7E609E3: index("post_likes_post_id_b7e609e3").using(
        "btree",
        table.postId.asc().nullsLast().op("int8_ops"),
      ),
      userId12E60720: index("post_likes_user_id_12e60720").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      postLikesPostIdB7E609E3FkPostsId: foreignKey({
        columns: [table.postId],
        foreignColumns: [posts.id],
        name: "post_likes_post_id_b7e609e3_fk_posts_id",
      }),
      postLikesUserId12E60720FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "post_likes_user_id_12e60720_fk_users_id",
      }),
      postLikesPostIdUserId4A23D35FUniq: unique(
        "post_likes_post_id_user_id_4a23d35f_uniq",
      ).on(table.postId, table.userId),
    };
  },
);

export const postsManualMetadata = pgTable(
  "posts_manual_metadata",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "posts_manual_metadata_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    postId: bigint("post_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    manualmetadataId: bigint("manualmetadata_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      manualmetadataId3D2F9E71: index(
        "posts_manual_metadata_manualmetadata_id_3d2f9e71",
      ).using("btree", table.manualmetadataId.asc().nullsLast().op("int8_ops")),
      postId695Fd53E: index("posts_manual_metadata_post_id_695fd53e").using(
        "btree",
        table.postId.asc().nullsLast().op("int8_ops"),
      ),
      postsManualMetadatManualmetadataId3D2F9E71FkManualMe: foreignKey({
        columns: [table.manualmetadataId],
        foreignColumns: [manualMetadata.id],
        name: "posts_manual_metadat_manualmetadata_id_3d2f9e71_fk_manual_me",
      }),
      postsManualMetadataPostId695Fd53EFkPostsId: foreignKey({
        columns: [table.postId],
        foreignColumns: [posts.id],
        name: "posts_manual_metadata_post_id_695fd53e_fk_posts_id",
      }),
      postsManualMetadataPostIdManualmetadataIdCee00192Uniq: unique(
        "posts_manual_metadata_post_id_manualmetadata_id_cee00192_uniq",
      ).on(table.postId, table.manualmetadataId),
    };
  },
);

export const organizations = pgTable(
  "organizations",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "organizations_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    name: varchar({ length: 255 }).notNull(),
    abbreviation: varchar({ length: 10 }).notNull(),
    subTitle: varchar("sub_title", { length: 255 }),
    logo: varchar({ length: 100 }),
    notes: text(),
    about: text(),
    systemGeneratedInstructions: text("system_generated_instructions"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    storageQuota: bigint("storage_quota", { mode: "number" }).notNull(),
    userQuota: integer("user_quota").notNull(),
    spaceQuota: integer("space_quota").notNull(),
    isActive: boolean("is_active").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    tokenQuota: bigint("token_quota", { mode: "number" }).notNull(),
    domain: varchar({ length: 255 }).notNull(),
  },
  (table) => {
    return {
      abbreviationD491819BLike: index(
        "organizations_abbreviation_d491819b_like",
      ).using(
        "btree",
        table.abbreviation.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      nameEee39956Like: index("organizations_name_eee39956_like").using(
        "btree",
        table.name.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      organizationsNameKey: unique("organizations_name_key").on(table.name),
      organizationsAbbreviationKey: unique("organizations_abbreviation_key").on(
        table.abbreviation,
      ),
      organizationsTokenQuotaCheck: check(
        "organizations_token_quota_check",
        sql`token_quota >= 0`,
      ),
    };
  },
);

export const multiFactorMethods = pgTable(
  "multi_factor_methods",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "multi_factor_methods_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    methodType: varchar("method_type", { length: 10 }).notNull(),
    status: varchar({ length: 10 }).notNull(),
    isDefault: boolean("is_default").notNull(),
    encryptedSecret: text("encrypted_secret"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    lastUsedStep: bigint("last_used_step", { mode: "number" }),
    pendingExpiresAt: timestamp("pending_expires_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    confirmedAt: timestamp("confirmed_at", {
      withTimezone: true,
      mode: "string",
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      multiFactoUserId0C4A72Idx: index("multi_facto_user_id_0c4a72_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.isDefault.asc().nullsLast().op("bool_ops"),
      ),
      multiFactoUserIdA8753AIdx: index("multi_facto_user_id_a8753a_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.status.asc().nullsLast().op("int8_ops"),
      ),
      userIdDa6D04F4: index("multi_factor_methods_user_id_da6d04f4").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      uniqueDefaultMethodPerUser: uniqueIndex("unique_default_method_per_user")
        .using("btree", table.userId.asc().nullsLast().op("int8_ops"))
        .where(sql`is_default`),
      multiFactorMethodsUserIdDa6D04F4FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "multi_factor_methods_user_id_da6d04f4_fk_users_id",
      }),
      multiFactorMethodsUserIdMethodType5643D7D2Uniq: unique(
        "multi_factor_methods_user_id_method_type_5643d7d2_uniq",
      ).on(table.methodType, table.userId),
    };
  },
);

export const notifications = pgTable(
  "notifications",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "notifications_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    notificationType: varchar("notification_type", { length: 64 }).notNull(),
    channel: varchar({ length: 10 }).notNull(),
    severity: varchar({ length: 10 }).notNull(),
    title: varchar({ length: 255 }).notNull(),
    message: text().notNull(),
    data: jsonb().notNull(),
    isRead: boolean("is_read").notNull(),
    readAt: timestamp("read_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    actorId: bigint("actor_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    recipientId: bigint("recipient_id", { mode: "number" }).notNull(),
    emailSentAt: timestamp("email_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    isEmailSent: boolean("is_email_sent").notNull(),
  },
  (table) => {
    return {
      notifRecipientCreatedIdx: index("notif_recipient_created_idx").using(
        "btree",
        table.recipientId.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.desc().nullsFirst().op("int8_ops"),
      ),
      notifRecipientTypeIdx: index("notif_recipient_type_idx").using(
        "btree",
        table.recipientId.asc().nullsLast().op("text_ops"),
        table.notificationType.asc().nullsLast().op("text_ops"),
        table.createdAt.desc().nullsFirst().op("text_ops"),
      ),
      notifRecipientUnreadIdx: index("notif_recipient_unread_idx").using(
        "btree",
        table.recipientId.asc().nullsLast().op("timestamptz_ops"),
        table.isRead.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.desc().nullsFirst().op("timestamptz_ops"),
      ),
      actorIdF6Ddf1D3: index("notifications_actor_id_f6ddf1d3").using(
        "btree",
        table.actorId.asc().nullsLast().op("int8_ops"),
      ),
      organizationIdBf0D0E52: index(
        "notifications_organization_id_bf0d0e52",
      ).using("btree", table.organizationId.asc().nullsLast().op("int8_ops")),
      recipientIdE1133Bac: index("notifications_recipient_id_e1133bac").using(
        "btree",
        table.recipientId.asc().nullsLast().op("int8_ops"),
      ),
      notificationsActorIdF6Ddf1D3FkUsersId: foreignKey({
        columns: [table.actorId],
        foreignColumns: [users.id],
        name: "notifications_actor_id_f6ddf1d3_fk_users_id",
      }),
      notificationsOrganizationIdBf0D0E52FkOrganizationsId: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "notifications_organization_id_bf0d0e52_fk_organizations_id",
      }),
      notificationsRecipientIdE1133BacFkUsersId: foreignKey({
        columns: [table.recipientId],
        foreignColumns: [users.id],
        name: "notifications_recipient_id_e1133bac_fk_users_id",
      }),
    };
  },
);

export const postBroadshares = pgTable(
  "post_broadshares",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "post_broadshares_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    shareId: uuid("share_id").notNull(),
    sharedAt: timestamp("shared_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    startsAt: timestamp("starts_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "string" }),
    isActive: boolean("is_active").notNull(),
    visitCount: integer("visit_count").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    postId: bigint("post_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    sharedById: bigint("shared_by_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      postBroadsExpires77F576Idx: index("post_broads_expires_77f576_idx").using(
        "btree",
        table.expiresAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      postBroadsShareIB48187Idx: index("post_broads_share_i_b48187_idx").using(
        "btree",
        table.shareId.asc().nullsLast().op("uuid_ops"),
      ),
      postId44B29C05: index("post_broadshares_post_id_44b29c05").using(
        "btree",
        table.postId.asc().nullsLast().op("int8_ops"),
      ),
      sharedByIdCa5823Cc: index("post_broadshares_shared_by_id_ca5823cc").using(
        "btree",
        table.sharedById.asc().nullsLast().op("int8_ops"),
      ),
      postBroadsharesPostId44B29C05FkPostsId: foreignKey({
        columns: [table.postId],
        foreignColumns: [posts.id],
        name: "post_broadshares_post_id_44b29c05_fk_posts_id",
      }),
      postBroadsharesSharedByIdCa5823CcFkUsersId: foreignKey({
        columns: [table.sharedById],
        foreignColumns: [users.id],
        name: "post_broadshares_shared_by_id_ca5823cc_fk_users_id",
      }),
      postBroadsharesShareIdKey: unique("post_broadshares_share_id_key").on(
        table.shareId,
      ),
      postBroadsharesVisitCountCheck: check(
        "post_broadshares_visit_count_check",
        sql`visit_count >= 0`,
      ),
    };
  },
);

export const recordsManagerPostapprovalconfiguration = pgTable(
  "records_manager_postapprovalconfiguration",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "records_manager_postapprovalconfiguration_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    approvalType: varchar("approval_type", { length: 20 }).notNull(),
    approvalStatus: varchar("approval_status", { length: 20 }).notNull(),
    approvers: jsonb().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    postId: bigint("post_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      recordsManagerPostPostId639B3517FkPostsId: foreignKey({
        columns: [table.postId],
        foreignColumns: [posts.id],
        name: "records_manager_post_post_id_639b3517_fk_posts_id",
      }),
      recordsManagerPostapprovalconfigurationPostIdKey: unique(
        "records_manager_postapprovalconfiguration_post_id_key",
      ).on(table.postId),
    };
  },
);

export const reservedDomains = pgTable(
  "reserved_domains",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "reserved_domains_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    domain: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }),
  },
  (table) => {
    return {
      domainE9636249Like: index("reserved_domains_domain_e9636249_like").using(
        "btree",
        table.domain.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      organizationIdFfc22Ad6: index(
        "reserved_domains_organization_id_ffc22ad6",
      ).using("btree", table.organizationId.asc().nullsLast().op("int8_ops")),
      reservedDomainsOrganizationIdFfc22Ad6FkOrganizationsId: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "reserved_domains_organization_id_ffc22ad6_fk_organizations_id",
      }),
      reservedDomainsDomainKey: unique("reserved_domains_domain_key").on(
        table.domain,
      ),
    };
  },
);

export const spaces = pgTable(
  "spaces",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "spaces_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    name: varchar({ length: 255 }).notNull(),
    shortName: varchar("short_name", { length: 10 }).notNull(),
    about: text().notNull(),
    systemGeneratedInstructions: text("system_generated_instructions"),
    avatar: varchar({ length: 100 }),
    isActive: boolean("is_active").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    aiModelId: bigint("ai_model_id", { mode: "number" }),
  },
  (table) => {
    return {
      aiModelIdF494F73E: index("spaces_ai_model_id_f494f73e").using(
        "btree",
        table.aiModelId.asc().nullsLast().op("int8_ops"),
      ),
      organizationId481B43B3: index("spaces_organization_id_481b43b3").using(
        "btree",
        table.organizationId.asc().nullsLast().op("int8_ops"),
      ),
      spacesAiModelIdF494F73EFkAiModelsId: foreignKey({
        columns: [table.aiModelId],
        foreignColumns: [aiModels.id],
        name: "spaces_ai_model_id_f494f73e_fk_ai_models_id",
      }),
      spacesOrganizationId481B43B3FkOrganizationsId: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "spaces_organization_id_481b43b3_fk_organizations_id",
      }),
      spacesNameOrganizationId9425Bd8AUniq: unique(
        "spaces_name_organization_id_9425bd8a_uniq",
      ).on(table.name, table.organizationId),
      spacesShortNameOrganizationId65C4C6A5Uniq: unique(
        "spaces_short_name_organization_id_65c4c6a5_uniq",
      ).on(table.shortName, table.organizationId),
    };
  },
);

export const rootStorage = pgTable(
  "root_storage",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "root_storage_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    totalQuotaBytes: bigint("total_quota_bytes", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    usedQuotaBytes: bigint("used_quota_bytes", { mode: "number" }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
  },
  (table) => {
    return {
      rootStorageTotalQuotaNonNegative: check(
        "root_storage_total_quota_non_negative",
        sql`total_quota_bytes >= 0`,
      ),
      rootStorageUsedQuotaLteTotal: check(
        "root_storage_used_quota_lte_total",
        sql`used_quota_bytes <= total_quota_bytes`,
      ),
      rootStorageUsedQuotaNonNegative: check(
        "root_storage_used_quota_non_negative",
        sql`used_quota_bytes >= 0`,
      ),
    };
  },
);

export const smtpConfigurations = pgTable(
  "smtp_configurations",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "smtp_configurations_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    name: varchar({ length: 100 }).notNull(),
    provider: varchar({ length: 20 }).notNull(),
    smtpServer: varchar("smtp_server", { length: 255 }).notNull(),
    smtpPort: integer("smtp_port").notNull(),
    emailUsername: varchar("email_username", { length: 255 }).notNull(),
    emailPassword: varchar("email_password", { length: 1024 }).notNull(),
    senderEmail: varchar("sender_email", { length: 254 }).notNull(),
    useTls: boolean("use_tls").notNull(),
    useSsl: boolean("use_ssl").notNull(),
    isActive: boolean("is_active").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      smtpConfigurationsOrganizationId6F1Fd282FkOrganizat: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "smtp_configurations_organization_id_6f1fd282_fk_organizat",
      }),
      smtpConfigurationsOrganizationId6F1Fd282Uniq: unique(
        "smtp_configurations_organization_id_6f1fd282_uniq",
      ).on(table.organizationId),
    };
  },
);

export const spaceMembers = pgTable(
  "space_members",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "space_members_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    role: varchar({ length: 20 }).notNull(),
    addedAt: timestamp("added_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    spaceId: bigint("space_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      spaceMembeSpaceI042Bf8Idx: index("space_membe_space_i_042bf8_idx").using(
        "btree",
        table.spaceId.asc().nullsLast().op("int8_ops"),
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      spaceId83Ce5442: index("space_members_space_id_83ce5442").using(
        "btree",
        table.spaceId.asc().nullsLast().op("int8_ops"),
      ),
      userIdD86Eeba4: index("space_members_user_id_d86eeba4").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      spaceMembersSpaceId83Ce5442FkSpacesId: foreignKey({
        columns: [table.spaceId],
        foreignColumns: [spaces.id],
        name: "space_members_space_id_83ce5442_fk_spaces_id",
      }),
      spaceMembersUserIdD86Eeba4FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "space_members_user_id_d86eeba4_fk_users_id",
      }),
      spaceMembersSpaceIdUserId373Bf75BUniq: unique(
        "space_members_space_id_user_id_373bf75b_uniq",
      ).on(table.spaceId, table.userId),
    };
  },
);

export const storageLedger = pgTable(
  "storage_ledger",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "storage_ledger_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    changeType: varchar("change_type", { length: 40 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    changedBytes: bigint("changed_bytes", { mode: "number" }).notNull(),
    referenceId: varchar("reference_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }),
  },
  (table) => {
    return {
      storageLedOrganizCf20E3Idx: index("storage_led_organiz_cf20e3_idx").using(
        "btree",
        table.organizationId.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      storageLedUserIdF25C30Idx: index("storage_led_user_id_f25c30_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      organizationId9Adccad5: index(
        "storage_ledger_organization_id_9adccad5",
      ).using("btree", table.organizationId.asc().nullsLast().op("int8_ops")),
      userIdDb2850Ed: index("storage_ledger_user_id_db2850ed").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      storageLedgerOrganizationId9Adccad5FkOrganizationsId: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "storage_ledger_organization_id_9adccad5_fk_organizations_id",
      }),
      storageLedgerUserIdDb2850EdFkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "storage_ledger_user_id_db2850ed_fk_users_id",
      }),
    };
  },
);

export const quotaAuditLogs = pgTable(
  "quota_audit_logs",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "quota_audit_logs_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    action: varchar({ length: 10 }).notNull(),
    level: varchar({ length: 15 }).notNull(),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: integer("entity_id").notNull(),
    reason: text(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    aiModelId: bigint("ai_model_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    performedById: bigint("performed_by_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    newValue: bigint("new_value", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    oldValue: bigint("old_value", { mode: "number" }),
  },
  (table) => {
    return {
      quotaAuditAiModeA249C8Idx: index("quota_audit_ai_mode_a249c8_idx").using(
        "btree",
        table.aiModelId.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      quotaAuditCreated40298BIdx: index("quota_audit_created_40298b_idx").using(
        "btree",
        table.createdAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      quotaAuditLevel2De5CcIdx: index("quota_audit_level_2de5cc_idx").using(
        "btree",
        table.level.asc().nullsLast().op("int8_ops"),
        table.entityId.asc().nullsLast().op("int8_ops"),
        table.aiModelId.asc().nullsLast().op("int8_ops"),
      ),
      aiModelIdE97F53E1: index("quota_audit_logs_ai_model_id_e97f53e1").using(
        "btree",
        table.aiModelId.asc().nullsLast().op("int8_ops"),
      ),
      performedById91330228: index(
        "quota_audit_logs_performed_by_id_91330228",
      ).using("btree", table.performedById.asc().nullsLast().op("int8_ops")),
      quotaAuditPerform6C903FIdx: index("quota_audit_perform_6c903f_idx").using(
        "btree",
        table.performedById.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("int8_ops"),
      ),
      quotaAuditLogsAiModelIdE97F53E1FkAiModelsId: foreignKey({
        columns: [table.aiModelId],
        foreignColumns: [aiModels.id],
        name: "quota_audit_logs_ai_model_id_e97f53e1_fk_ai_models_id",
      }),
      quotaAuditLogsPerformedById91330228FkUsersId: foreignKey({
        columns: [table.performedById],
        foreignColumns: [users.id],
        name: "quota_audit_logs_performed_by_id_91330228_fk_users_id",
      }),
      quotaAuditLogsEntityIdCheck: check(
        "quota_audit_logs_entity_id_check",
        sql`entity_id >= 0`,
      ),
      quotaAuditLogsNewValueCheck: check(
        "quota_audit_logs_new_value_check",
        sql`new_value >= 0`,
      ),
      quotaAuditLogsOldValueCheck: check(
        "quota_audit_logs_old_value_check",
        sql`old_value >= 0`,
      ),
    };
  },
);

export const sttAttempt = pgTable(
  "stt_attempt",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "stt_attempt_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    attemptNumber: integer("attempt_number").notNull(),
    apiCalled: boolean("api_called").notNull(),
    saved: boolean().notNull(),
    errorMessage: text("error_message"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    workUnitId: bigint("work_unit_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      workUnitId2De94381: index("stt_attempt_work_unit_id_2de94381").using(
        "btree",
        table.workUnitId.asc().nullsLast().op("int8_ops"),
      ),
      sttAttemptWorkUnitId2De94381FkSttWorkUnitId: foreignKey({
        columns: [table.workUnitId],
        foreignColumns: [sttWorkUnit.id],
        name: "stt_attempt_work_unit_id_2de94381_fk_stt_work_unit_id",
      }),
      uniqueSttAttempt: unique("unique_stt_attempt").on(
        table.attemptNumber,
        table.workUnitId,
      ),
    };
  },
);

export const sttJob = pgTable(
  "stt_job",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "stt_job_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    status: varchar({ length: 50 }).notNull(),
    sourceDownloaded: boolean("source_downloaded").notNull(),
    sourceLocalPath: text("source_local_path").notNull(),
    chunksCreated: boolean("chunks_created").notNull(),
    chunksUploaded: boolean("chunks_uploaded").notNull(),
    chunkMetadata: jsonb("chunk_metadata").notNull(),
    totalUnits: integer("total_units"),
    initAttemptCount: integer("init_attempt_count").notNull(),
    initLastError: text("init_last_error").notNull(),
    maxRetries: integer("max_retries").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    errorMessage: text("error_message").notNull(),
    fullText: text("full_text"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    manualMetadataId: bigint("manual_metadata_id", {
      mode: "number",
    }).notNull(),
  },
  (table) => {
    return {
      manualMetadataId31471Eab: index(
        "stt_job_manual_metadata_id_31471eab",
      ).using("btree", table.manualMetadataId.asc().nullsLast().op("int8_ops")),
      status360792Idx: index("stt_job_status_360792_idx").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
        table.createdAt.asc().nullsLast().op("text_ops"),
      ),
      status36C71Ee4: index("stt_job_status_36c71ee4").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      status36C71Ee4Like: index("stt_job_status_36c71ee4_like").using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      sttJobManualMetadataId31471EabFkManualMetadataId: foreignKey({
        columns: [table.manualMetadataId],
        foreignColumns: [manualMetadata.id],
        name: "stt_job_manual_metadata_id_31471eab_fk_manual_metadata_id",
      }),
    };
  },
);

export const requiredActions = pgTable(
  "required_actions",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "required_actions_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    actionType: varchar("action_type", { length: 50 }).notNull(),
    isCompleted: boolean("is_completed").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    completedAt: timestamp("completed_at", {
      withTimezone: true,
      mode: "string",
    }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      requiredAcUserId8C5A54Idx: index("required_ac_user_id_8c5a54_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.isCompleted.asc().nullsLast().op("bool_ops"),
      ),
      userIdE83C7208: index("required_actions_user_id_e83c7208").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      requiredActionsUserIdE83C7208FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "required_actions_user_id_e83c7208_fk_users_id",
      }),
      uniqRequiredActionUserActionType: unique(
        "uniq_required_action_user_action_type",
      ).on(table.actionType, table.userId),
    };
  },
);

export const savedFilters = pgTable(
  "saved_filters",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "saved_filters_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    name: varchar({ length: 100 }).notNull(),
    scope: varchar({ length: 20 }).notNull(),
    items: jsonb().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdById: bigint("created_by_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      savedFilteCreated14E292Idx: index("saved_filte_created_14e292_idx").using(
        "btree",
        table.createdById.asc().nullsLast().op("text_ops"),
        table.scope.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("text_ops"),
      ),
      createdById14Da3Fd6: index("saved_filters_created_by_id_14da3fd6").using(
        "btree",
        table.createdById.asc().nullsLast().op("int8_ops"),
      ),
      name43E63760: index("saved_filters_name_43e63760").using(
        "btree",
        table.name.asc().nullsLast().op("text_ops"),
      ),
      name43E63760Like: index("saved_filters_name_43e63760_like").using(
        "btree",
        table.name.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      scope24D58991: index("saved_filters_scope_24d58991").using(
        "btree",
        table.scope.asc().nullsLast().op("text_ops"),
      ),
      scope24D58991Like: index("saved_filters_scope_24d58991_like").using(
        "btree",
        table.scope.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      savedFiltersCreatedById14Da3Fd6FkUsersId: foreignKey({
        columns: [table.createdById],
        foreignColumns: [users.id],
        name: "saved_filters_created_by_id_14da3fd6_fk_users_id",
      }),
      savedFiltersCreatedByIdScopeNameB9FdceafUniq: unique(
        "saved_filters_created_by_id_scope_name_b9fdceaf_uniq",
      ).on(table.name, table.scope, table.createdById),
    };
  },
);

export const tokenBlacklistOutstandingtoken = pgTable(
  "token_blacklist_outstandingtoken",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "token_blacklist_outstandingtoken_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    token: text().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }),
    jti: varchar({ length: 255 }).notNull(),
  },
  (table) => {
    return {
      jtiHexD9Bdf6F7Like: index(
        "token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like",
      ).using("btree", table.jti.asc().nullsLast().op("varchar_pattern_ops")),
      userId83Bc629A: index(
        "token_blacklist_outstandingtoken_user_id_83bc629a",
      ).using("btree", table.userId.asc().nullsLast().op("int8_ops")),
      tokenBlacklistOutstandingtokenUserId83Bc629AFkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "token_blacklist_outstandingtoken_user_id_83bc629a_fk_users_id",
      }),
      tokenBlacklistOutstandingtokenJtiHexD9Bdf6F7Uniq: unique(
        "token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq",
      ).on(table.jti),
    };
  },
);

export const sttWorkUnit = pgTable(
  "stt_work_unit",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "stt_work_unit_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    unitIndex: integer("unit_index").notNull(),
    startTime: doublePrecision("start_time").notNull(),
    endTime: doublePrecision("end_time").notNull(),
    chunkS3Key: varchar("chunk_s3_key", { length: 500 }).notNull(),
    status: varchar({ length: 50 }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    errorMessage: text("error_message"),
    errorType: varchar("error_type", { length: 100 }),
    aiDone: boolean("ai_done").notNull(),
    saveDone: boolean("save_done").notNull(),
    cleanupDone: boolean("cleanup_done").notNull(),
    fullText: text("full_text"),
    timestamps: jsonb(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    executionId: bigint("execution_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    jobId: bigint("job_id", { mode: "number" }).notNull(),
    s3Chunk: varchar("s3_chunk", { length: 100 }),
  },
  (table) => {
    return {
      sttWorkUnExecuti1C9A63Idx: index("stt_work_un_executi_1c9a63_idx").using(
        "btree",
        table.executionId.asc().nullsLast().op("text_ops"),
        table.status.asc().nullsLast().op("text_ops"),
      ),
      sttWorkUnExecutiF349B8Idx: index("stt_work_un_executi_f349b8_idx").using(
        "btree",
        table.executionId.asc().nullsLast().op("int8_ops"),
        table.unitIndex.asc().nullsLast().op("int8_ops"),
      ),
      sttWorkUnJobIdD631F9Idx: index("stt_work_un_job_id_d631f9_idx").using(
        "btree",
        table.jobId.asc().nullsLast().op("int8_ops"),
        table.status.asc().nullsLast().op("int8_ops"),
      ),
      sttWorkUnStartTE39915Idx: index("stt_work_un_start_t_e39915_idx").using(
        "btree",
        table.startTime.asc().nullsLast().op("float8_ops"),
      ),
      sttWorkUnStatus2A5A47Idx: index("stt_work_un_status_2a5a47_idx").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
        table.errorType.asc().nullsLast().op("text_ops"),
      ),
      errorType15054E86: index("stt_work_unit_error_type_15054e86").using(
        "btree",
        table.errorType.asc().nullsLast().op("text_ops"),
      ),
      errorType15054E86Like: index(
        "stt_work_unit_error_type_15054e86_like",
      ).using(
        "btree",
        table.errorType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      executionId95D2Dd5E: index("stt_work_unit_execution_id_95d2dd5e").using(
        "btree",
        table.executionId.asc().nullsLast().op("int8_ops"),
      ),
      jobId14058390: index("stt_work_unit_job_id_14058390").using(
        "btree",
        table.jobId.asc().nullsLast().op("int8_ops"),
      ),
      status87293D21: index("stt_work_unit_status_87293d21").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      status87293D21Like: index("stt_work_unit_status_87293d21_like").using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      sttWorkUnitExecutionId95D2Dd5EFkSttExecutionId: foreignKey({
        columns: [table.executionId],
        foreignColumns: [sttExecution.id],
        name: "stt_work_unit_execution_id_95d2dd5e_fk_stt_execution_id",
      }),
      sttWorkUnitJobId14058390FkSttJobId: foreignKey({
        columns: [table.jobId],
        foreignColumns: [sttJob.id],
        name: "stt_work_unit_job_id_14058390_fk_stt_job_id",
      }),
      uniqueSttExecutionUnit: unique("unique_stt_execution_unit").on(
        table.unitIndex,
        table.executionId,
      ),
    };
  },
);

export const userAiQuotas = pgTable(
  "user_ai_quotas",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "user_ai_quotas_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    tokensUsed: bigint("tokens_used", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    aiModelId: bigint("ai_model_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    allocatedById: bigint("allocated_by_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      userAiQuoUserIdC2894BIdx: index("user_ai_quo_user_id_c2894b_idx").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
        table.aiModelId.asc().nullsLast().op("int8_ops"),
      ),
      aiModelIdCb615E3C: index("user_ai_quotas_ai_model_id_cb615e3c").using(
        "btree",
        table.aiModelId.asc().nullsLast().op("int8_ops"),
      ),
      allocatedById680Cb78A: index(
        "user_ai_quotas_allocated_by_id_680cb78a",
      ).using("btree", table.allocatedById.asc().nullsLast().op("int8_ops")),
      userId237564Ae: index("user_ai_quotas_user_id_237564ae").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      userAiQuotasAiModelIdCb615E3CFkAiModelsId: foreignKey({
        columns: [table.aiModelId],
        foreignColumns: [aiModels.id],
        name: "user_ai_quotas_ai_model_id_cb615e3c_fk_ai_models_id",
      }),
      userAiQuotasAllocatedById680Cb78AFkUsersId: foreignKey({
        columns: [table.allocatedById],
        foreignColumns: [users.id],
        name: "user_ai_quotas_allocated_by_id_680cb78a_fk_users_id",
      }),
      userAiQuotasUserId237564AeFkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "user_ai_quotas_user_id_237564ae_fk_users_id",
      }),
      userAiQuotasUserIdAiModelId954Bdb5EUniq: unique(
        "user_ai_quotas_user_id_ai_model_id_954bdb5e_uniq",
      ).on(table.aiModelId, table.userId),
      userAiQuotasTokensUsedCheck: check(
        "user_ai_quotas_tokens_used_check",
        sql`tokens_used >= 0`,
      ),
    };
  },
);

export const userStorage = pgTable(
  "user_storage",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "user_storage_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    assignedQuotaBytes: bigint("assigned_quota_bytes", {
      mode: "number",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    usedBytes: bigint("used_bytes", { mode: "number" }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      userStorageUserId0Ee4599DFkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "user_storage_user_id_0ee4599d_fk_users_id",
      }),
      userStorageUserIdKey: unique("user_storage_user_id_key").on(table.userId),
      userStorageAssignedQuotaNonNegative: check(
        "user_storage_assigned_quota_non_negative",
        sql`assigned_quota_bytes >= 0`,
      ),
      userStorageUsedBytesNonNegative: check(
        "user_storage_used_bytes_non_negative",
        sql`used_bytes >= 0`,
      ),
      userStorageUsedLteAssigned: check(
        "user_storage_used_lte_assigned",
        sql`used_bytes <= assigned_quota_bytes`,
      ),
    };
  },
);

export const usersGroups = pgTable(
  "users_groups",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "users_groups_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
    groupId: integer("group_id").notNull(),
  },
  (table) => {
    return {
      groupId2F3517Aa: index("users_groups_group_id_2f3517aa").using(
        "btree",
        table.groupId.asc().nullsLast().op("int4_ops"),
      ),
      userIdF500Bee5: index("users_groups_user_id_f500bee5").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      usersGroupsGroupId2F3517AaFkAuthGroupId: foreignKey({
        columns: [table.groupId],
        foreignColumns: [authGroup.id],
        name: "users_groups_group_id_2f3517aa_fk_auth_group_id",
      }),
      usersGroupsUserIdF500Bee5FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "users_groups_user_id_f500bee5_fk_users_id",
      }),
      usersGroupsUserIdGroupIdFc7788E8Uniq: unique(
        "users_groups_user_id_group_id_fc7788e8_uniq",
      ).on(table.userId, table.groupId),
    };
  },
);

export const usersUserPermissions = pgTable(
  "users_user_permissions",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "users_user_permissions_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
    permissionId: integer("permission_id").notNull(),
  },
  (table) => {
    return {
      permissionId6D08Dcd2: index(
        "users_user_permissions_permission_id_6d08dcd2",
      ).using("btree", table.permissionId.asc().nullsLast().op("int4_ops")),
      userId92473840: index("users_user_permissions_user_id_92473840").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      usersUserPermissioPermissionId6D08Dcd2FkAuthPerm: foreignKey({
        columns: [table.permissionId],
        foreignColumns: [authPermission.id],
        name: "users_user_permissio_permission_id_6d08dcd2_fk_auth_perm",
      }),
      usersUserPermissionsUserId92473840FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "users_user_permissions_user_id_92473840_fk_users_id",
      }),
      usersUserPermissionsUserIdPermissionId3B86CbdfUniq: unique(
        "users_user_permissions_user_id_permission_id_3b86cbdf_uniq",
      ).on(table.userId, table.permissionId),
    };
  },
);

export const task = pgTable(
  "task",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "task_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    name: varchar({ length: 255 }).notNull(),
    prompt: text().notNull(),
    runAt: timestamp("run_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    scheduleType: varchar("schedule_type", { length: 20 }).notNull(),
    scheduleConfig: jsonb("schedule_config").notNull(),
    status: varchar({ length: 20 }).notNull(),
    pausedDates: jsonb("paused_dates").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint("user_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      folderIdD2E094D0: index("task_folder_id_d2e094d0").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
      ),
      runAtFfb81457: index("task_run_at_ffb81457").using(
        "btree",
        table.runAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      scheduleType577F70Bb: index("task_schedule_type_577f70bb").using(
        "btree",
        table.scheduleType.asc().nullsLast().op("text_ops"),
      ),
      scheduleType577F70BbLike: index("task_schedule_type_577f70bb_like").using(
        "btree",
        table.scheduleType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      status46302Df3: index("task_status_46302df3").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      status46302Df3Like: index("task_status_46302df3_like").using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      userId270D0Bb2: index("task_user_id_270d0bb2").using(
        "btree",
        table.userId.asc().nullsLast().op("int8_ops"),
      ),
      taskFolderIdD2E094D0FkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "task_folder_id_d2e094d0_fk_folders_id",
      }),
      taskUserId270D0Bb2FkUsersId: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "task_user_id_270d0bb2_fk_users_id",
      }),
    };
  },
);

export const users = pgTable(
  "users",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "users_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    password: varchar({ length: 128 }).notNull(),
    lastLogin: timestamp("last_login", { withTimezone: true, mode: "string" }),
    isSuperuser: boolean("is_superuser").notNull(),
    firstName: varchar("first_name", { length: 150 }).notNull(),
    lastName: varchar("last_name", { length: 150 }).notNull(),
    isStaff: boolean("is_staff").notNull(),
    isActive: boolean("is_active").notNull(),
    dateJoined: timestamp("date_joined", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    username: varchar({ length: 150 }),
    email: varchar({ length: 254 }).notNull(),
    designation: varchar({ length: 150 }).notNull(),
    profilePicture: varchar("profile_picture", { length: 100 }),
    personId: varchar("person_id", { length: 15 }),
    role: varchar({ length: 20 }).notNull(),
    about: text(),
    systemGeneratedInstructions: text("system_generated_instructions"),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    organizationId: bigint("organization_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    tokenQuota: bigint("token_quota", { mode: "number" }).notNull(),
    recycleBinDeleteAfterDays: integer(
      "recycle_bin_delete_after_days",
    ).notNull(),
    autoSyncTimezone: boolean("auto_sync_timezone").notNull(),
    timezone: varchar({ length: 64 }).notNull(),
  },
  (table) => {
    return {
      email0Ea73CcaLike: index("users_email_0ea73cca_like").using(
        "btree",
        table.email.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      organizationIdAbe5D649: index("users_organization_id_abe5d649").using(
        "btree",
        table.organizationId.asc().nullsLast().op("int8_ops"),
      ),
      role000008Idx: index("users_role_000008_idx").using(
        "btree",
        table.role.asc().nullsLast().op("int8_ops"),
        table.organizationId.asc().nullsLast().op("int8_ops"),
      ),
      updated047D73Idx: index("users_updated_047d73_idx").using(
        "btree",
        table.updatedAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      usernameE8658Fc8Like: index("users_username_e8658fc8_like").using(
        "btree",
        table.username.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      usersOrganizationIdAbe5D649FkOrganizationsId: foreignKey({
        columns: [table.organizationId],
        foreignColumns: [organizations.id],
        name: "users_organization_id_abe5d649_fk_organizations_id",
      }),
      usersUsernameKey: unique("users_username_key").on(table.username),
      usersEmailKey: unique("users_email_key").on(table.email),
      usersTokenQuotaCheck: check(
        "users_token_quota_check",
        sql`token_quota >= 0`,
      ),
    };
  },
);

export const manualMetadata = pgTable(
  "manual_metadata",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "manual_metadata_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    title: varchar({ length: 255 }).notNull(),
    about: text().notNull(),
    isDisabled: boolean("is_disabled").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    isDeleted: boolean("is_deleted").notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    mediaFileId: bigint("media_file_id", { mode: "number" }),
    systemGeneratedInstructions: text(
      "system_generated_instructions",
    ).notNull(),
    ingestionType: varchar("ingestion_type", { length: 30 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    databaseIngestionId: bigint("database_ingestion_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    gmailConnectorId: bigint("gmail_connector_id", { mode: "number" }),
  },
  (table) => {
    return {
      ingestionTypeD37333D9: index(
        "manual_metadata_ingestion_type_d37333d9",
      ).using("btree", table.ingestionType.asc().nullsLast().op("text_ops")),
      ingestionTypeD37333D9Like: index(
        "manual_metadata_ingestion_type_d37333d9_like",
      ).using(
        "btree",
        table.ingestionType.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      manualMetadataDatabaseIngestionI03E0B3FaFkDatabase: foreignKey({
        columns: [table.databaseIngestionId],
        foreignColumns: [databaseIngestions.id],
        name: "manual_metadata_database_ingestion_i_03e0b3fa_fk_database_",
      }),
      manualMetadataMediaFileId51784378FkMediaFilesId: foreignKey({
        columns: [table.mediaFileId],
        foreignColumns: [mediaFiles.id],
        name: "manual_metadata_media_file_id_51784378_fk_media_files_id",
      }),
      manualMetadataGmailConnectorId7A15Fa59FkGmailCon: foreignKey({
        columns: [table.gmailConnectorId],
        foreignColumns: [gmailConnectors.id],
        name: "manual_metadata_gmail_connector_id_7a15fa59_fk_gmail_con",
      }),
      manualMetadataMediaFileIdKey: unique(
        "manual_metadata_media_file_id_key",
      ).on(table.mediaFileId),
      manualMetadataDatabaseIngestionIdKey: unique(
        "manual_metadata_database_ingestion_id_key",
      ).on(table.databaseIngestionId),
      manualMetadataGmailConnectorIdKey: unique(
        "manual_metadata_gmail_connector_id_key",
      ).on(table.gmailConnectorId),
      manualMetadataExactlyOneSource: check(
        "manual_metadata_exactly_one_source",
        sql`((media_file_id IS NOT NULL) AND (database_ingestion_id IS NULL) AND (gmail_connector_id IS NULL) AND ((ingestion_type)::text = 'media_file'::text)) OR ((media_file_id IS NULL) AND (database_ingestion_id IS NOT NULL) AND (gmail_connector_id IS NULL) AND ((ingestion_type)::text = ANY (ARRAY[('postgres'::character varying)::text, ('mysql'::character varying)::text, ('oracle'::character varying)::text, ('mongodb'::character varying)::text, ('elastic'::character varying)::text, ('other'::character varying)::text]))) OR ((media_file_id IS NULL) AND (database_ingestion_id IS NULL) AND (gmail_connector_id IS NOT NULL) AND ((ingestion_type)::text = 'gmail'::text))`,
      ),
    };
  },
);

export const authGroupPermissions = pgTable(
  "auth_group_permissions",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "auth_group_permissions_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    groupId: integer("group_id").notNull(),
    permissionId: integer("permission_id").notNull(),
  },
  (table) => {
    return {
      groupIdB120Cbf9: index("auth_group_permissions_group_id_b120cbf9").using(
        "btree",
        table.groupId.asc().nullsLast().op("int4_ops"),
      ),
      permissionId84C5C92E: index(
        "auth_group_permissions_permission_id_84c5c92e",
      ).using("btree", table.permissionId.asc().nullsLast().op("int4_ops")),
      authGroupPermissioPermissionId84C5C92EFkAuthPerm: foreignKey({
        columns: [table.permissionId],
        foreignColumns: [authPermission.id],
        name: "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm",
      }),
      authGroupPermissionsGroupIdB120Cbf9FkAuthGroupId: foreignKey({
        columns: [table.groupId],
        foreignColumns: [authGroup.id],
        name: "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id",
      }),
      authGroupPermissionsGroupIdPermissionId0Cd325B0Uniq: unique(
        "auth_group_permissions_group_id_permission_id_0cd325b0_uniq",
      ).on(table.groupId, table.permissionId),
    };
  },
);

export const sttExecution = pgTable(
  "stt_execution",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "stt_execution_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    generationNumber: integer("generation_number").notNull(),
    status: varchar({ length: 50 }).notNull(),
    totalUnits: integer("total_units"),
    startedAt: timestamp("started_at", { withTimezone: true, mode: "string" }),
    finishedAt: timestamp("finished_at", {
      withTimezone: true,
      mode: "string",
    }),
    retryReason: text("retry_reason"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    jobId: bigint("job_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      sttExecutiJobId297B71Idx: index("stt_executi_job_id_297b71_idx").using(
        "btree",
        table.jobId.asc().nullsLast().op("int4_ops"),
        table.generationNumber.asc().nullsLast().op("int8_ops"),
      ),
      sttExecutiStatus899600Idx: index("stt_executi_status_899600_idx").using(
        "btree",
        table.status.asc().nullsLast().op("timestamptz_ops"),
        table.createdAt.asc().nullsLast().op("text_ops"),
      ),
      jobId7Dff0E3E: index("stt_execution_job_id_7dff0e3e").using(
        "btree",
        table.jobId.asc().nullsLast().op("int8_ops"),
      ),
      status46Cbedae: index("stt_execution_status_46cbedae").using(
        "btree",
        table.status.asc().nullsLast().op("text_ops"),
      ),
      status46CbedaeLike: index("stt_execution_status_46cbedae_like").using(
        "btree",
        table.status.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      sttExecutionJobId7Dff0E3EFkSttJobId: foreignKey({
        columns: [table.jobId],
        foreignColumns: [sttJob.id],
        name: "stt_execution_job_id_7dff0e3e_fk_stt_job_id",
      }),
      uniqueSttJobGeneration: unique("unique_stt_job_generation").on(
        table.generationNumber,
        table.jobId,
      ),
    };
  },
);

export const tokenBlacklistBlacklistedtoken = pgTable(
  "token_blacklist_blacklistedtoken",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "token_blacklist_blacklistedtoken_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    blacklistedAt: timestamp("blacklisted_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    tokenId: bigint("token_id", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      tokenBlacklistBlacklistedtokenTokenId3Cc7Fe56Fk: foreignKey({
        columns: [table.tokenId],
        foreignColumns: [tokenBlacklistOutstandingtoken.id],
        name: "token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk",
      }),
      tokenBlacklistBlacklistedtokenTokenIdKey: unique(
        "token_blacklist_blacklistedtoken_token_id_key",
      ).on(table.tokenId),
    };
  },
);

export const aiAssistantConversationmessagev2Attachments = pgTable(
  "ai_assistant_conversationmessagev2_attachments",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "ai_assistant_conversationmessagev2_attachments_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    conversationmessagev2Id: varchar("conversationmessagev2_id", {
      length: 255,
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    messageattachmentv2Id: bigint("messageattachmentv2_id", {
      mode: "number",
    }).notNull(),
  },
  (table) => {
    return {
      aiAssistantConversatioConversationmessagev2Id1Ae50Df0Like: index(
        "ai_assistant_conversatio_conversationmessagev2_id_1ae50df0_like",
      ).using(
        "btree",
        table.conversationmessagev2Id
          .asc()
          .nullsLast()
          .op("varchar_pattern_ops"),
      ),
      aiAssistantConversationmConversationmessagev2Id1Ae50Df0: index(
        "ai_assistant_conversationm_conversationmessagev2_id_1ae50df0",
      ).using(
        "btree",
        table.conversationmessagev2Id.asc().nullsLast().op("text_ops"),
      ),
      aiAssistantConversationmMessageattachmentv2Id25083589: index(
        "ai_assistant_conversationm_messageattachmentv2_id_25083589",
      ).using(
        "btree",
        table.messageattachmentv2Id.asc().nullsLast().op("int8_ops"),
      ),
      aiAssistantConversConversationmessagev1Ae50Df0FkAiAssist: foreignKey({
        columns: [table.conversationmessagev2Id],
        foreignColumns: [aiAssistantConversationmessagev2.id],
        name: "ai_assistant_convers_conversationmessagev_1ae50df0_fk_ai_assist",
      }),
      aiAssistantConversMessageattachmentv225083589FkAiAssist: foreignKey({
        columns: [table.messageattachmentv2Id],
        foreignColumns: [aiAssistantV2Messageattachmentv2.id],
        name: "ai_assistant_convers_messageattachmentv2__25083589_fk_ai_assist",
      }),
      aiAssistantConversatioConversationmessagev2Id02Fcd030Uniq: unique(
        "ai_assistant_conversatio_conversationmessagev2_id_02fcd030_uniq",
      ).on(table.conversationmessagev2Id, table.messageattachmentv2Id),
    };
  },
);

export const gmailConnectors = pgTable(
  "gmail_connectors",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedByDefaultAsIdentity({
        name: "gmail_connectors_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1,
      }),
    gmail: varchar({ length: 254 }).notNull(),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    connectedById: bigint("connected_by_id", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    folderId: bigint("folder_id", { mode: "number" }).notNull(),
    status: varchar({ length: 20 }).default("connected").notNull(),
  },
  (table) => {
    return {
      gmailConneConnect5282D6Idx: index("gmail_conne_connect_5282d6_idx").using(
        "btree",
        table.connectedById.asc().nullsLast().op("int8_ops"),
        table.createdAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      connectedByIdCf005647: index(
        "gmail_connectors_connected_by_id_cf005647",
      ).using("btree", table.connectedById.asc().nullsLast().op("int8_ops")),
      expiresAt38Ded0E3: index("gmail_connectors_expires_at_38ded0e3").using(
        "btree",
        table.expiresAt.asc().nullsLast().op("timestamptz_ops"),
      ),
      folderIdBee0E557: index("gmail_connectors_folder_id_bee0e557").using(
        "btree",
        table.folderId.asc().nullsLast().op("int8_ops"),
      ),
      gmail3Ebd35Cb: index("gmail_connectors_gmail_3ebd35cb").using(
        "btree",
        table.gmail.asc().nullsLast().op("text_ops"),
      ),
      gmail3Ebd35CbLike: index("gmail_connectors_gmail_3ebd35cb_like").using(
        "btree",
        table.gmail.asc().nullsLast().op("varchar_pattern_ops"),
      ),
      gmailConnectorsConnectedByIdCf005647FkUsersId: foreignKey({
        columns: [table.connectedById],
        foreignColumns: [users.id],
        name: "gmail_connectors_connected_by_id_cf005647_fk_users_id",
      }),
      gmailConnectorsFolderIdBee0E557FkFoldersId: foreignKey({
        columns: [table.folderId],
        foreignColumns: [folders.id],
        name: "gmail_connectors_folder_id_bee0e557_fk_folders_id",
      }),
      gmailConnectorUniquePerUser: unique("gmail_connector_unique_per_user").on(
        table.gmail,
        table.connectedById,
      ),
    };
  },
);
