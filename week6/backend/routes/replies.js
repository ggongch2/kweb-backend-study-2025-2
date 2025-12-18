const express = require('express');
const router = express.Router();
const replyService = require('../services/replyService');

router.delete('/:replyId', async (req, res) => {
  const { replyId } = req.params;

  // TODO:
  // 1. 세션에서 userId 가져오기
  const userId = req.session.userId ; 
  if(!userId) res.status(401).json({message : "you are not logged in!"}) ;
  // 2. replyService.deleteReply() 호출
  const reply = await replyService.deleteReply(replyId, userId) ; 
  // 3. 200 상태코드 반환

  res.status(200).json(reply);
});

module.exports = router;
