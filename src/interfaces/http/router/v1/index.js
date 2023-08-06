import express from "express";
// import other routes
import dummyRouter from "./dummyRouter";
import networkRouter from "./networkRouter";

const router = express.Router();

// mount routes
router.use("/dummy", dummyRouter);
router.use("/actor", networkRouter);

module.exports = router;
