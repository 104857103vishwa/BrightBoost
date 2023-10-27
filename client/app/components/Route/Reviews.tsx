import { styles } from "@/app/styles/style";
import Image from "next/image";
import React from "react";
import ReviewCard from "../Review/ReviewCard";

type Props = {};

export const reviews = [
  {
    name: "Vishwa Punchihewa",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Student | Swinburne university",
    comment:
      "Using the Bright Boost app has been a game-changer for me. I've seen a significant improvement in my grades, and having access to expert tutor",
  },
  {
    name: "Erka Alterangel",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profession: "Student | Swinburne .",
    comment:
      "The app's data-driven insights help me focus on areas where I need the most support. It's a confidence booster, and I can't imagine my high school journey without it!",
  },

  {
    name: "Ghaida Abobakr",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    profession: "Full stack web developer | Canada",
    comment:
      " personalized education companion that has boosted my confidence and overall academic perform",
  },
];

const Reviews = (props: Props) => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
        <div className="800px:w-[50%] w-full">
          <Image
            src={require("../../../public/assests/business-img.png")}
            alt="business"
            width={700}
            height={700}
          />
        </div>
        <br />
        <br />
      </div>
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-20px]">
        {reviews &&
          reviews.map((i, index) => <ReviewCard item={i} key={index} />)}
      </div>
    </div>
  );
};

export default Reviews;
