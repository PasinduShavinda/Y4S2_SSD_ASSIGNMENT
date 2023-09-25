const express = require("express");
const router = express.Router();
const ResTopicController = require("../controllers/shv_res_topic_controller");

router.get("/", ResTopicController.getAllResTopics);
router.get("/:id", ResTopicController.getResTopicsById);
router.post("/", ResTopicController.addResTopics);
router.put("/:id", ResTopicController.updateResTopics);
router.delete("/:id", ResTopicController.deleteResTopics);

module.exports = router;
