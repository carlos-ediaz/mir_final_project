// import { prisma } from "./database";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const lessonExpiredStatusThread = async (req, res, next) => {
  try {
    await prisma.lesson.updateMany({
      where: {
        status: "Pending",
        scheduledAt: {
          lte: new Date(),
        },
      },
      data: {
        status: "Expired",
      },
    });
    console.log("Checking for expired lessons");
  } catch (error) {
    console.log(error);
  }
};

export const lessonFinishedStatusThread = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const getLessons = await prisma.lesson.findMany({
      where: {
        status: "Ongoing",
        scheduledAt: {
          lte: new Date(currentDate.setMinutes(currentDate.getMinutes() - 62)),
        },
      },
    });
    getLessons.map(async (getLesson) => {
      console.log(getLesson);
      const scheduledTime = getLesson.scheduledAt;
      await prisma.lesson.update({
        where: {
          id: getLesson.id,
        },
        data: {
          status: "Finished",
          finishedAt: new Date(
            scheduledTime.setMinutes(scheduledTime.getMinutes() + 60)
          ),
          duration: 60,
        },
      });
    });
    console.log("Checking for unfinished lessons");
  } catch (error) {
    console.log(error);
  }
};

export const lessonOngoingStatusThread = async (req, res, next) => {
  try {
    await prisma.lesson.updateMany({
      where: {
        status: "Scheduled",
        scheduledAt: {
          lte: new Date(),
        },
      },
      data: {
        status: "Ongoing",
      },
    });
    console.log("Checking for started lessons");
  } catch (error) {
    console.log(error);
  }
};
