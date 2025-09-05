-- DropForeignKey
ALTER TABLE "public"."Lesson" DROP CONSTRAINT "Lesson_sectionId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
