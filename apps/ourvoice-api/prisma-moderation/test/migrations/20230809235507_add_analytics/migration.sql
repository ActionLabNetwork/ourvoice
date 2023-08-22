-- CreateTable
CREATE TABLE "ApiCallRecord" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userHash" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "action" TEXT,
    "data" JSONB NOT NULL,

    CONSTRAINT "ApiCallRecord_pkey" PRIMARY KEY ("id")
);
