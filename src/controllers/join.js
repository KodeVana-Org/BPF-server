const User = require("../models/user.Model");
const Join = require("../models/join.Model");

exports.Join = async (req, res) => {
  try {
    const { id } = req.body;
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }

    const {
      name,
      phone,
      email,
      po,
      ps,
      gender,
      district,
      fatherName,
      villageTown,
    } = req.body;

    // if (!email && !phone) {
    // return res
    // .status(400)
    // .json({ message: "Either email or phone is required." });
    // }

    if (!name || !po || !ps || !gender || !district || !fatherName) {
      return res
        .status(400)
        .json({ message: "All fileds are required for joining " });
    }
    // Check if the user is already a join
    // if (existingUser.userType === "joined") {
    //   return res.status(400).json({ message: "User is already joined." });
    // }

    if (existingUser.userType !== "user") {
      return res
        .status(400)
        .json({ status: 400, message: "Only user can join " });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true, upsert: true }, // Options: new returns the modified document, upsert creates new document if not found
    ).exec();

    let districtModel;
    switch (district) {
      case "Tamulpur":
        districtModel = Tamulpur;
        break;
      case "Baksa":
        districtModel = Baksa;
        break;
      case "Chirang":
        districtModel = Chirang;
        break;
      case "Kokrajhar":
        districtModel = Kokrajhar;
        break;
      case "Udalguri":
        districtModel = Udalguri;
        break;
      default:
        console.log("Invalid district");
        return res.status(400).json({ message: "Invalid District" });
    }

    // Create a new join user with the provided details
    existingUser.userType = "joined";
    updatedUser.userType = "joined";
    const join = new Join({
      user: id,
    });

    // Save the joined user
    updatedUser.save();
    existingUser.joined = join._id;
    await districtModel.create({ joinedId: join._id, nameOfDist: district });
    await join.save();
    await existingUser.save();

    return res
      .status(200)
      .json({ status: 200, message: "User joined successfully.", updatedUser });
  } catch (error) {
    console.error("Error joining:", error);
    return res.status(500).json({ error: "Failed to join." });
  }
};
