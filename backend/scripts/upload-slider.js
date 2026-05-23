const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const API_BASE = 'http://localhost:4000/api';

const uploadSlider = async () => {
  try {
    console.log("Logging in as Admin...");
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      loginId: 'admin@admin.com',
      password: 'password123'
    });
    const token = loginRes.data.token;

    const sliders = [
      {
        path: 'C:/Users/arbei/.gemini/antigravity-ide/brain/b2ac158f-60a7-412c-9763-6afaa854f510/banner_hero_2_1779520664770.png',
        title: 'Summer Modest Collection',
        desc: 'Embrace the sun with our new vibrant and elegant modest summer outfits.'
      },
      {
        path: 'C:/Users/arbei/.gemini/antigravity-ide/brain/b2ac158f-60a7-412c-9763-6afaa854f510/banner_hero_3_1779520682939.png',
        title: 'Luxury Evening Wear',
        desc: 'Discover luxury evening gowns tailored for grace and sophistication.'
      }
    ];

    for (const slider of sliders) {
      if (!fs.existsSync(slider.path)) {
        console.log("Path not found:", slider.path);
        continue;
      }

      const form = new FormData();
      form.append('title', slider.title);
      form.append('description', slider.desc);
      form.append('buttonLabel', 'Shop Now');
      form.append('buttonLink', '/shop');
      form.append('type', 'hero');
      form.append('page', 'home');
      form.append('image', fs.createReadStream(slider.path));
      form.append('thumb', fs.createReadStream(slider.path));

      console.log(`Uploading ${slider.title}...`);
      await axios.post(`${API_BASE}/banners`, form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`Uploaded ${slider.title} successfully!`);
    }
  } catch (err) {
    console.error(err?.response?.data || err.message);
  }
};

uploadSlider();
