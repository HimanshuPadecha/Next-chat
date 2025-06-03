import { db } from "../db";
import { users } from "../db/schema";
import { hashPassword } from "../utils/utils";
import logger from "../utils/winston.logger";

const seedingUsers = [
  {
    username: "user1",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user2",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user3",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user4",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user5",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user6",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user7",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user8",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user9",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user10",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user11",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user12",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user13",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user14",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user15",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user16",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user17",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user18",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user19",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user20",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user21",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user22",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user23",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user24",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user25",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user26",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user27",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user28",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user29",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
  {
    username: "user30",
    password: "123456789",
    profileImg:
      "https://res.cloudinary.com/himanshupadecha/image/upload/v1747456415/skjw2emfrxin9ul9pf2o.jpg",
  },
];

const seedUsers = async () => {
  try {
    const finalArray = await Promise.all(
      seedingUsers.map(async (user) => {
        user.password = await hashPassword(user.password);
        return user;
      })
    );

    await db.insert(users).values(finalArray);

    logger.info("users seeded successfully");
  } catch (error) {
    logger.error("Error while seeding users");
  }
};

seedUsers();
