const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* Test route */

app.get("/", (req, res) => {
    res.send("VanGO backend running");
});

/* DRIVER API - update location */

app.post("/update-location", (req, res) => {

    const { van_id, lat, lng } = req.body;

    const data = fs.readFileSync("./data/locations.json");

    let locations = JSON.parse(data);

    const existingVan = locations.find(v => v.van_id === van_id);

    if (existingVan) {
        existingVan.lat = lat;
        existingVan.lng = lng;
    } else {
        locations.push({
            van_id: van_id,
            lat: lat,
            lng: lng
        });
    }

    fs.writeFileSync("./data/locations.json", JSON.stringify(locations));

    res.json({
        message: "Location updated successfully"
    });

});

/* PARENT API - get van location */

app.get("/van-location", (req, res) => {

    const data = fs.readFileSync("./data/locations.json");

    const locations = JSON.parse(data);

    res.json(locations);

});

app.post("/login", (req, res) => {

    const { id, password } = req.body;

    const data = fs.readFileSync("./data/users.json");

    const users = JSON.parse(data);

    const user = users.find(
        u => u.id === id && u.password === password
    );

    if(user){
        res.json({
            message:"Login successful",
            role:user.role
        });
    } else {
        res.status(401).json({
            message:"Invalid credentials"
        });
    }

});

app.get("/all-vans", (req, res) => {

    const data = fs.readFileSync("./data/locations.json");

    const vans = JSON.parse(data);

    res.json(vans);

});

/* SERVER */

app.listen(5000, () => {
    console.log("Server running on port 5000");
});