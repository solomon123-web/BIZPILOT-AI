ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "workspaceId" TEXT,
  ADD COLUMN IF NOT EXISTS "category" TEXT,
  ADD COLUMN IF NOT EXISTS "imageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "availability" TEXT DEFAULT 'in_stock',
  ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "stockQuantity" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "sku" TEXT,
  ADD COLUMN IF NOT EXISTS "businessLocation" TEXT,
  ADD COLUMN IF NOT EXISTS "deliveryInfo" TEXT,
  ADD COLUMN IF NOT EXISTS "productVariations" JSONB;

CREATE TABLE IF NOT EXISTS "ProductMedia" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'image',
    "url" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "fileName" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductMedia_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProductListing" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "listingUrl" TEXT,
    "externalId" TEXT,
    "content" JSONB,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductListing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PublishingJob" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "payload" JSONB,
    "result" JSONB,
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublishingJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PublishingAttempt" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "responseBody" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishingAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ConnectedSocialAccount" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "displayName" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectedSocialAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CustomerConversation" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalUserId" TEXT,
    "customerName" TEXT,
    "lastMessageAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerConversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CustomerMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "externalMessageId" TEXT,
    "senderName" TEXT,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Lead" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "FollowUp" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "leadId" TEXT,
    "dueAt" TIMESTAMP(3),
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AIAction" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requiresPermission" BOOLEAN NOT NULL DEFAULT true,
    "result" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executedAt" TIMESTAMP(3),

    CONSTRAINT "AIAction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AIActionLog" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "actor" TEXT,
    "event" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIActionLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AIPermission" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'REQUIRE_APPROVAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIPermission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BusinessActivity" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessActivity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SocialConnection" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "platform" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "accountName" TEXT,
    "accountType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'connected',
    "accessTokenRef" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "scopes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialConnection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "OAuthState" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "connectionId" TEXT,
    "businessId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthState_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ProductListing_productId_channel_key"
    ON "ProductListing"("productId", "channel");

CREATE UNIQUE INDEX IF NOT EXISTS "OAuthState_state_key"
    ON "OAuthState"("state");

CREATE INDEX IF NOT EXISTS "ProductMedia_productId_idx"
    ON "ProductMedia"("productId");

CREATE INDEX IF NOT EXISTS "ProductMedia_businessId_idx"
    ON "ProductMedia"("businessId");

CREATE INDEX IF NOT EXISTS "ProductListing_businessId_idx"
    ON "ProductListing"("businessId");

CREATE INDEX IF NOT EXISTS "PublishingJob_productId_idx"
    ON "PublishingJob"("productId");

CREATE INDEX IF NOT EXISTS "PublishingJob_businessId_idx"
    ON "PublishingJob"("businessId");

CREATE INDEX IF NOT EXISTS "CustomerConversation_businessId_idx"
    ON "CustomerConversation"("businessId");

CREATE INDEX IF NOT EXISTS "CustomerMessage_conversationId_idx"
    ON "CustomerMessage"("conversationId");

CREATE INDEX IF NOT EXISTS "Lead_businessId_idx"
    ON "Lead"("businessId");

CREATE INDEX IF NOT EXISTS "FollowUp_businessId_idx"
    ON "FollowUp"("businessId");

CREATE INDEX IF NOT EXISTS "AIAction_businessId_idx"
    ON "AIAction"("businessId");

CREATE INDEX IF NOT EXISTS "AIActionLog_businessId_idx"
    ON "AIActionLog"("businessId");

CREATE INDEX IF NOT EXISTS "AIPermission_businessId_idx"
    ON "AIPermission"("businessId");

CREATE INDEX IF NOT EXISTS "BusinessActivity_businessId_idx"
    ON "BusinessActivity"("businessId");

CREATE INDEX IF NOT EXISTS "SocialConnection_businessId_idx"
    ON "SocialConnection"("businessId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Product_workspaceId_fkey'
    ) THEN
        ALTER TABLE "Product"
            ADD CONSTRAINT "Product_workspaceId_fkey"
            FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ProductMedia_productId_fkey'
    ) THEN
        ALTER TABLE "ProductMedia"
            ADD CONSTRAINT "ProductMedia_productId_fkey"
            FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ProductMedia_businessId_fkey'
    ) THEN
        ALTER TABLE "ProductMedia"
            ADD CONSTRAINT "ProductMedia_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ProductListing_productId_fkey'
    ) THEN
        ALTER TABLE "ProductListing"
            ADD CONSTRAINT "ProductListing_productId_fkey"
            FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ProductListing_businessId_fkey'
    ) THEN
        ALTER TABLE "ProductListing"
            ADD CONSTRAINT "ProductListing_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'PublishingJob_productId_fkey'
    ) THEN
        ALTER TABLE "PublishingJob"
            ADD CONSTRAINT "PublishingJob_productId_fkey"
            FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'PublishingJob_businessId_fkey'
    ) THEN
        ALTER TABLE "PublishingJob"
            ADD CONSTRAINT "PublishingJob_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'PublishingAttempt_jobId_fkey'
    ) THEN
        ALTER TABLE "PublishingAttempt"
            ADD CONSTRAINT "PublishingAttempt_jobId_fkey"
            FOREIGN KEY ("jobId") REFERENCES "PublishingJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'ConnectedSocialAccount_businessId_fkey'
    ) THEN
        ALTER TABLE "ConnectedSocialAccount"
            ADD CONSTRAINT "ConnectedSocialAccount_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'CustomerConversation_businessId_fkey'
    ) THEN
        ALTER TABLE "CustomerConversation"
            ADD CONSTRAINT "CustomerConversation_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'CustomerMessage_conversationId_fkey'
    ) THEN
        ALTER TABLE "CustomerMessage"
            ADD CONSTRAINT "CustomerMessage_conversationId_fkey"
            FOREIGN KEY ("conversationId") REFERENCES "CustomerConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Lead_businessId_fkey'
    ) THEN
        ALTER TABLE "Lead"
            ADD CONSTRAINT "Lead_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'FollowUp_businessId_fkey'
    ) THEN
        ALTER TABLE "FollowUp"
            ADD CONSTRAINT "FollowUp_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'AIAction_businessId_fkey'
    ) THEN
        ALTER TABLE "AIAction"
            ADD CONSTRAINT "AIAction_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'AIActionLog_businessId_fkey'
    ) THEN
        ALTER TABLE "AIActionLog"
            ADD CONSTRAINT "AIActionLog_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'AIPermission_businessId_fkey'
    ) THEN
        ALTER TABLE "AIPermission"
            ADD CONSTRAINT "AIPermission_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'BusinessActivity_businessId_fkey'
    ) THEN
        ALTER TABLE "BusinessActivity"
            ADD CONSTRAINT "BusinessActivity_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'SocialConnection_businessId_fkey'
    ) THEN
        ALTER TABLE "SocialConnection"
            ADD CONSTRAINT "SocialConnection_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'SocialConnection_workspaceId_fkey'
    ) THEN
        ALTER TABLE "SocialConnection"
            ADD CONSTRAINT "SocialConnection_workspaceId_fkey"
            FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'OAuthState_businessId_fkey'
    ) THEN
        ALTER TABLE "OAuthState"
            ADD CONSTRAINT "OAuthState_businessId_fkey"
            FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'OAuthState_connectionId_fkey'
    ) THEN
        ALTER TABLE "OAuthState"
            ADD CONSTRAINT "OAuthState_connectionId_fkey"
            FOREIGN KEY ("connectionId") REFERENCES "SocialConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
