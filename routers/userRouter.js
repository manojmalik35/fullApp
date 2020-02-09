const express = require("express")
const userRouter = express.Router();

const multer = require("multer");

var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + ".jpeg")
  },
  destination: function (req, file, cb) {
    cb(null, 'public');
  }
})

function fileFilter(req, file, cb) {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To accept the file pass `true`, like so:
  if (file.mimetype.startsWith("image"))
    cb(null, true)
  else
    cb(null, false)
  // To reject this file pass `false`, like so:

  // You can always pass an error if something goes wrong:
  // cb(new Error('I don\'t have a clue!'))
}

var upload = multer({
  storage: storage,
  fileFilter: fileFilter
});


const { signup, login, forgotPassword, resetPassword, protectRoute } = require("../controllers/authController");
const { updateUser } = require("../controllers/userController");

userRouter.route("/signup").post(signup);

userRouter.route("/login").post(login);

userRouter.route("/forgotpassword").patch(forgotPassword);
userRouter.route("/resetpassword").patch(resetPassword);
userRouter.route("/updateuser/:id").post(protectRoute, upload.single("photo"), updateUser);

// userRouter.route("/:id")
// .patch(updateUser)
// .get(getUser)
// .delete(deleteUser);

module.exports = userRouter;