import React from "react";
import { styles } from "../styles/style";

const About = () => {
  return (
    <div className="text-black dark:text-white">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient">brightboost?</span>
      </h1>

      <br />
      <div className="w-[95%] 800px:w-[85%] m-auto">
        <p className="text-[18px] font-Poppins">
          Welcome to Bright Boost, your gateway to academic excellence! We're
          dedicated to empowering high school students by providing a dynamic
          after-school program that goes beyond traditional tutoring. With our
          app, students can access expert support, attend flexible learning
          sessions, and receive personalized guidance to help them achieve their
          educational goals. Our mission is to enhance your learning experiences
          and boost your academic performance. We believe in the power of
          data-driven insights, flexible schedules, and expert support to
          provide you with the best possible education. At Bright Boost, we
          prioritize your success by offering transparent monitoring of your
          progress, ensuring that you can confidently navigate your academic
          journey. Our dedicated team of tutors is committed to helping you
          succeed, and our app makes it easier than ever to connect with them.
          We're here to make learning efficient, enjoyable, and tailored to your
          needs. With Bright Boost, you're not just a student; you're a valued
          member of a thriving educational community. Join us on this journey to
          excellence, and let Bright Boost illuminate your path to success
        </p>
        <br />
        <span className="text-[22px]">Pin, Ghaidha, Erca, Disco & Vish</span>
        <h5 className="text-[18px] font-Poppins">
          Creators of BrightBoost App
        </h5>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;
