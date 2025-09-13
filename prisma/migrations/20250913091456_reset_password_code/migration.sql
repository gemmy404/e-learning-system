-- CreateTable
CREATE TABLE "public"."Reset_Password_Code" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reset_Password_Code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reset_Password_Code_code_key" ON "public"."Reset_Password_Code"("code");

-- AddForeignKey
ALTER TABLE "public"."Reset_Password_Code" ADD CONSTRAINT "Reset_Password_Code_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
