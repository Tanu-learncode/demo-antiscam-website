-- CreateTable
CREATE TABLE "public"."AnalysisHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "riskScore" DOUBLE PRECISION,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalysisHistory_userId_idx" ON "public"."AnalysisHistory"("userId");

-- AddForeignKey
ALTER TABLE "public"."AnalysisHistory" ADD CONSTRAINT "AnalysisHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
