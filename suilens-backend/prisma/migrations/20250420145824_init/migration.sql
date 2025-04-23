-- CreateTable
CREATE TABLE "MessageSent" (
    "dbId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "MessageSent_pkey" PRIMARY KEY ("dbId")
);

-- CreateTable
CREATE TABLE "PlatformFeeCut" (
    "dbId" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "amount" TEXT NOT NULL,

    CONSTRAINT "PlatformFeeCut_pkey" PRIMARY KEY ("dbId")
);

-- CreateTable
CREATE TABLE "cursor" (
    "id" TEXT NOT NULL,
    "eventSeq" TEXT NOT NULL,
    "txDigest" TEXT NOT NULL,

    CONSTRAINT "cursor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageSent_dbId_key" ON "MessageSent"("dbId");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformFeeCut_dbId_key" ON "PlatformFeeCut"("dbId");
