-- DropForeignKey
ALTER TABLE "public"."Section" DROP CONSTRAINT "Section_courseId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Section" ADD CONSTRAINT "Section_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
