import React from "react";
import Transition from "../../components/transition/Transition";

import "./profile.css";

import MagneticButton from "../../components/magneticbutton/MagneticButton";

const Profile = () => {
  return (
    <div className="contact page">
      <div className="container">
        <section className="contact-hero">
          <div className="contact-row">
            <div className="contact-col"></div>
            <div className="contact-col">
              <h1>
                Welcome, <span>username</span>
              </h1>
            </div>
          </div>
        </section>

        <section className="section contact-form">
          <div className="contact-row">
            <div className="contact-col">
              <p>
                <span>Profile</span>
              </p>
            </div>
            <div className="contact-col">
              <form action="">
                <div className="input">
                  <input type="text" placeholder="Name" />
                </div>
                <div className="input">
                  <input type="text" placeholder="Password" />
                </div>
                <div className="input">
                  <input type="text" placeholder="Other" />
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="contact-subscribe">
          <div className="contact-row">
            <div className="contact-col">
              <p>
                <span>Generate Report</span>
              </p>
            </div>
            <div className="contact-col">
              <h3>
                Receive report on progress
              </h3>
              <p>
                Your growth starts with failure and learning from it.
              </p>
              <div className="input">
                <input type="text" placeholder="Write how you feel!" />
                <button>Submit</button>
              </div>
            </div>
          </div>
        </section>

       
        <MagneticButton />
      </div>
    </div>
  );
};

export default Transition(Profile);
