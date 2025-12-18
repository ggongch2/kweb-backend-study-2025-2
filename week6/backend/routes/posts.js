const express = require('express');
const router = express.Router();
const postService = require('../services/postService');
const replyService = require('../services/replyService');

router.get('/', async (req, res) => {
  // TODO: postService.getAllPosts() 호출 후 결과 반환
  const allposts = await postService.getAllPosts() ; 
  res.status(200).json(allposts);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // TODO: postService.getPostById() 호출 후 결과 반환
  const post = await postService.getPostById(id) ; 
  res.status(200).json(post);
});

router.post('/', async (req, res) => {
  const { title, content } = req.body;

  // TODO:
  // 1. 세션에서 userId 가져오기
  const userId = req.session.userId ; 
  if(!userId) res.status(401).json({message : "you are not logged in!"}) ;
  // 2. postService.createPost() 호출
  const createdPost = await postService.createPost(title, content, userId) ; 
  // 3. 201 상태코드와 함께 결과 반환
  res.status(201).json(createdPost);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // TODO:
  // 1. 세션에서 userId 가져오기
  const userId = req.session.userId ; 
  if(!userId) res.status(401).json({message : "you are not logged in!"}) ;
  // 2. postService.updatePost() 호출
  const updatdPost = await postService.updatePost(id, title, content , userId) ; 
  // 3. 결과 반환
  res.status(200).json(updatdPost);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // TODO:
  // 1. 세션에서 userId 가져오기
  const userId = req.session.userId ; 
  if(!userId) res.status(401).json({message : "you are not logged in!"}) ;
  // 2. postService.deletePost() 호출
  await postService.deletePost(id, userId) ;
  // 3. 204 상태코드 반환
  res.status(204).send();
});

router.get('/:postId/replies', async (req, res) => {
  const { postId } = req.params;

  // TODO: replyService.getRepliesByPostId() 호출 후 결과 반환
  const result = await replyService.getRepliesByPostId(postId) ; 
  res.status(200).json(result);
});

router.post('/:postId/replies', async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  // TODO:
  // 1. 세션에서 userId 가져오기
  const userId = req.session.userId ; 
  if(!userId) res.status(401).json({message : "you are not logged in!"}) ;
  // 2. replyService.createReply() 호출
  const reply = await replyService.createReply(content, postId, userId) ; 
  // 3. 201 상태코드와 함께 결과 반환

  res.status(201).json(reply);
});

module.exports = router;
