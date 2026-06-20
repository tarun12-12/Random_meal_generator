import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://mealify-backend-oke2.onrender.com/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/contact`, formData);

      alert(res.data.message);

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <style>{`
        *{
          box-sizing:border-box;
        }

        body{
          margin:0;
          font-family:Arial,Helvetica,sans-serif;
          background:#f5f5f5;
        }

        .contact-container{
          width:100%;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:60px 20px;
        }

        .contact-card{
          width:100%;
          max-width:650px;
          background:#fff;
          padding:35px;
          border-radius:12px;
          box-shadow:0 8px 25px rgba(0,0,0,.1);
        }

        .contact-card h2{
          text-align:center;
          margin-bottom:25px;
          color:#222;
        }

        .contact-form{
          display:flex;
          flex-direction:column;
          gap:18px;
        }

        .contact-form input,
        .contact-form textarea{
          width:100%;
          padding:14px;
          border:1px solid #ccc;
          border-radius:8px;
          font-size:16px;
          outline:none;
          transition:.3s;
        }

        .contact-form input:focus,
        .contact-form textarea:focus{
          border-color:#ff4d4d;
          box-shadow:0 0 5px rgba(255,77,77,.3);
        }

        .contact-form textarea{
          resize:none;
        }

        .contact-form button{
          background:#ff4d4d;
          color:white;
          border:none;
          padding:15px;
          border-radius:8px;
          font-size:17px;
          cursor:pointer;
          transition:.3s;
        }

        .contact-form button:hover{
          background:#e63946;
        }

        @media(max-width:768px){
          .contact-card{
            padding:25px;
          }

          .contact-card h2{
            font-size:24px;
          }
        }
      `}</style>

      <div className="contact-container">
        <div className="contact-card">
          <h2>Contact Us</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              rows="6"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;